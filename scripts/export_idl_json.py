"""
Intraday Liquidity Data Exporter
Extracts data from Excel files and generates maintainable, date-flexible JSON for Plotly dashboards.
Usage:
    python scripts/export_idl_json.py [--date YYYY-MM-DD] [--src-dir PATH]
"""

import os
import sys
import argparse
import datetime
import json
import openpyxl

DEFAULT_SRC_DIR = r"d:\Backup\Rohit\Work\PMG\Research\Canada\Liquidity Management\Curiosity IDL"
DEST_FILE = r"C:\Users\rohit.gajare\Documents\GitHub\RohitCuriosity\src\content\data\intraday_liquidity.json"

def main():
    parser = argparse.ArgumentParser(description="Export Intraday Liquidity Data to JSON")
    parser.add_argument("--src-dir", default=DEFAULT_SRC_DIR, help="Directory containing source Excel files")
    parser.add_argument("--date", default=None, help="Override as-of date (YYYY-MM-DD). If omitted, inferred from data.")
    parser.add_argument("--dest", default=DEST_FILE, help="Target JSON destination path")
    args = parser.parse_args()

    src_dir = args.src_dir
    os.makedirs(os.path.dirname(args.dest), exist_ok=True)

    print(f"Reading data from: {src_dir}")

    # 1. Read Balances (MUL-BAL short.xlsx)
    bal_path = os.path.join(src_dir, "MUL-BAL short.xlsx")
    wb_bal = openpyxl.load_workbook(bal_path, data_only=True)
    sheet_bal = wb_bal.active
    bal_rows = list(sheet_bal.iter_rows(values_only=True))
    bal_h = {h: i for i, h in enumerate(bal_rows[0])}

    inferred_date = "2026-04-02"
    entities = set()
    currencies = set()
    accounts = set()

    # Time slots for 24h at 30m intervals
    time_slots = [f"{h:02d}:{m:02d}" for h in range(24) for m in (0, 30)]
    slot_map = {ts: {
        'total_available': 0.0,
        'total_projected': 0.0,
        'by_entity': {},
        'by_currency': {}
    } for ts in time_slots}

    for r in bal_rows[1:]:
        val_date = r[bal_h['Value Date']]
        if isinstance(val_date, datetime.datetime):
            inferred_date = val_date.strftime("%Y-%m-%d")

        entity = str(r[bal_h['Entity ID']] or 'Global Bank Unknown').strip()
        curr = str(r[bal_h['Currency']] or 'USD').strip()
        acct = str(r[bal_h['Account']] or '').strip()

        entities.add(entity)
        currencies.add(curr)
        if acct: accounts.add(acct)

        dt = r[bal_h['Date_Time']]
        ts = "00:00"
        if isinstance(dt, datetime.datetime):
            ts = f"{dt.hour:02d}:{dt.minute:02d}"
        elif isinstance(dt, str) and ":" in dt:
            parts = dt.split(":")
            ts = f"{int(parts[0]):02d}:{int(parts[1][:2]):02d}"

        if ts not in slot_map:
            slot_map[ts] = {'total_available': 0.0, 'total_projected': 0.0, 'by_entity': {}, 'by_currency': {}}

        avail = float(r[bal_h['BC_AVA_BAL']] or 0)
        proj = float(r[bal_h['BC_PRJ_BAL']] or 0)

        slot_map[ts]['total_available'] += avail
        slot_map[ts]['total_projected'] += proj

        # Entity grouping
        if entity not in slot_map[ts]['by_entity']:
            slot_map[ts]['by_entity'][entity] = {'available': 0.0, 'projected': 0.0}
        slot_map[ts]['by_entity'][entity]['available'] += avail
        slot_map[ts]['by_entity'][entity]['projected'] += proj

        # Currency grouping
        if curr not in slot_map[ts]['by_currency']:
            slot_map[ts]['by_currency'][curr] = {'available': 0.0, 'projected': 0.0}
        slot_map[ts]['by_currency'][curr]['available'] += avail
        slot_map[ts]['by_currency'][curr]['projected'] += proj

    target_date = args.date or inferred_date
    d_obj = datetime.datetime.strptime(target_date, "%Y-%m-%d")
    display_date = d_obj.strftime("%B %d, %Y")

    # Format trajectory list
    trajectories = []
    min_projected = float('inf')
    peak_overdraft_time = "00:00"
    opening_balance = slot_map["00:00"]['total_available'] if "00:00" in slot_map else 0.0

    for ts in sorted(slot_map.keys()):
        item = slot_map[ts]
        h_part, m_part = map(int, ts.split(":"))
        point_dt = d_obj.replace(hour=h_part, minute=m_part).strftime("%Y-%m-%dT%H:%M:%S")

        if item['total_projected'] < min_projected:
            min_projected = item['total_projected']
            peak_overdraft_time = ts

        trajectories.append({
            "time": ts,
            "hour": h_part,
            "minute": m_part,
            "dateTime": point_dt,
            "available": round(item['total_available'], 2),
            "projected": round(item['total_projected'], 2),
            "byEntity": {k: {"available": round(v["available"], 2), "projected": round(v["projected"], 2)} for k, v in item["by_entity"].items()},
            "byCurrency": {k: {"available": round(v["available"], 2), "projected": round(v["projected"], 2)} for k, v in item["by_currency"].items()}
        })

    # 2. Read Transactions (MUL-TXN short.xlsx)
    txn_path = os.path.join(src_dir, "MUL-TXN short.xlsx")
    wb_txn = openpyxl.load_workbook(txn_path, data_only=True)
    sheet_txn = wb_txn.active
    txn_rows = list(sheet_txn.iter_rows(values_only=True))
    txn_h = {h: i for i, h in enumerate(txn_rows[0])}

    hourly_map = {f"{h:02d}:00": {
        'matched_credits': 0.0,
        'unmatched_credits': 0.0,
        'matched_debits': 0.0,
        'unmatched_debits': 0.0,
        'tx_count': 0,
        'by_entity': {}
    } for h in range(24)}

    total_matched_credits = 0.0
    total_unmatched_credits = 0.0
    total_matched_debits = 0.0
    total_unmatched_debits = 0.0
    counterparty_flows = {}

    for r in txn_rows[1:]:
        hour_val = r[txn_h['Hour']]
        dt = r[txn_h['Date_Time']]
        h_str = "00:00"
        if hour_val is not None:
            try:
                h_str = f"{int(hour_val):02d}:00"
            except: pass
        elif isinstance(dt, datetime.datetime):
            h_str = f"{dt.hour:02d}:00"

        mc = float(r[txn_h['BC_MC']] or 0)
        umc = float(r[txn_h['BC_UMC']] or 0)
        md = abs(float(r[txn_h['BC_MD']] or 0)) # stored as positive for stacking or negative
        umd = abs(float(r[txn_h['BC_UMD']] or 0))
        entity = str(r[txn_h['Entity ID']] or 'Global Bank Unknown').strip()
        counterparty = str(r[txn_h['Ordering Institution']] or 'Unknown Inst').strip()

        if h_str in hourly_map:
            hourly_map[h_str]['matched_credits'] += mc
            hourly_map[h_str]['unmatched_credits'] += umc
            hourly_map[h_str]['matched_debits'] += md
            hourly_map[h_str]['unmatched_debits'] += umd
            hourly_map[h_str]['tx_count'] += 1

            if entity not in hourly_map[h_str]['by_entity']:
                hourly_map[h_str]['by_entity'][entity] = {'mc': 0.0, 'umc': 0.0, 'md': 0.0, 'umd': 0.0}
            hourly_map[h_str]['by_entity'][entity]['mc'] += mc
            hourly_map[h_str]['by_entity'][entity]['umc'] += umc
            hourly_map[h_str]['by_entity'][entity]['md'] += md
            hourly_map[h_str]['by_entity'][entity]['umd'] += umd

        total_matched_credits += mc
        total_unmatched_credits += umc
        total_matched_debits += md
        total_unmatched_debits += umd

        counterparty_flows[counterparty] = counterparty_flows.get(counterparty, 0.0) + (mc + umc + md + umd)

    hourly_cash_flows = []
    for h in range(24):
        h_str = f"{h:02d}:00"
        item = hourly_map[h_str]
        h_dt = d_obj.replace(hour=h, minute=0).strftime("%Y-%m-%dT%H:%M:%S")
        net = (item['matched_credits'] + item['unmatched_credits']) - (item['matched_debits'] + item['unmatched_debits'])
        hourly_cash_flows.append({
            "hour": h_str,
            "dateTime": h_dt,
            "matchedCredits": round(item['matched_credits'], 2),
            "unmatchedCredits": round(item['unmatched_credits'], 2),
            "matchedDebits": round(-item['matched_debits'], 2),
            "unmatchedDebits": round(-item['unmatched_debits'], 2),
            "netFlow": round(net, 2),
            "txCount": item['tx_count'],
            "byEntity": {k: {
                "matchedCredits": round(v["mc"], 2),
                "unmatchedCredits": round(v["umc"], 2),
                "matchedDebits": round(-v["md"], 2),
                "unmatchedDebits": round(-v["umd"], 2)
            } for k, v in item["by_entity"].items()}
        })

    # 3. Read Funding Sources (MUL-IDL-FUN-SRC-SUMM.xlsx)
    fun_path = os.path.join(src_dir, "MUL-IDL-FUN-SRC-SUMM.xlsx")
    wb_fun = openpyxl.load_workbook(fun_path, data_only=True)
    sheet_fun = wb_fun.active
    fun_rows = list(sheet_fun.iter_rows(values_only=True))
    fun_h = {h: i for i, h in enumerate(fun_rows[0])}

    funding_sources = []
    funding_totals = {}
    for r in fun_rows[1:]:
        ftype = str(r[fun_h['Type']] or 'Other').strip()
        curr = str(r[fun_h['Currency']] or 'USD').strip()
        bcv = float(r[fun_h['BC_VALUE']] or 0)
        entity = str(r[fun_h['Entity ID']] or 'Global Bank Unknown').strip()
        location = str(r[fun_h['Location']] or 'Global').strip()
        ownership = str(r[fun_h['Ownership']] or 'Owned').strip()

        funding_sources.append({
            "type": ftype,
            "currency": curr,
            "baseValue": round(bcv, 2),
            "entity": entity,
            "location": location,
            "ownership": ownership
        })
        funding_totals[ftype] = funding_totals.get(ftype, 0.0) + bcv

    # 4. Read Alerts (ALERTS.xlsx)
    alt_path = os.path.join(src_dir, "ALERTS.xlsx")
    wb_alt = openpyxl.load_workbook(alt_path, data_only=True)
    sheet_alt = wb_alt.active
    alt_rows = list(sheet_alt.iter_rows(values_only=True))
    alt_h = {h: i for i, h in enumerate(alt_rows[0])}

    alerts = []
    for r in alt_rows[1:]:
        sev = str(r[alt_h['Severity']] or 'Medium').strip()
        atype = str(r[alt_h['Alert Type']] or 'Alert').strip()
        curr = str(r[alt_h['Currency']] or 'USD').strip()
        acct = str(r[alt_h['Account']] or '').strip()
        entity = str(r[alt_h['Entity']] or 'Global Bank Unknown').strip()
        corr = str(r[alt_h['Corr. Bank Legal Entity']] or 'Correspondent').strip()
        
        t_val = r[alt_h['Time']]
        t_str = "12:00"
        if isinstance(t_val, datetime.datetime):
            t_str = f"{t_val.hour:02d}:{t_val.minute:02d}"
        elif isinstance(t_val, str) and ":" in t_val:
            t_str = t_val[:5]

        h_p, m_p = map(int, t_str.split(":"))
        alt_dt = d_obj.replace(hour=h_p, minute=m_p).strftime("%Y-%m-%dT%H:%M:%S")

        alerts.append({
            "time": t_str,
            "dateTime": alt_dt,
            "severity": sev,
            "type": atype,
            "currency": curr,
            "account": acct,
            "entity": entity,
            "correspondent": corr,
            "origin": str(r[alt_h['Origin']] or 'System Alert')
        })

    # Summary metrics
    total_inflow = total_matched_credits + total_unmatched_credits
    total_outflow = total_matched_debits + total_unmatched_debits
    matched_ratio = round((total_matched_credits + total_matched_debits) / (total_inflow + total_outflow) * 100, 1) if (total_inflow + total_outflow) > 0 else 0

    top_counterparties = [
        {"name": k, "volume": round(v, 2)} 
        for k, v in sorted(counterparty_flows.items(), key=lambda x: x[1], reverse=True)[:6]
    ]

    payload = {
        "metadata": {
            "version": "1.0.0",
            "asOfDate": target_date,
            "displayDate": display_date,
            "supportedDates": [target_date],
            "baseCurrency": "USD",
            "timeZone": "GMT",
            "entities": ["All", *sorted(list(entities))],
            "currencies": ["All", *sorted(list(currencies))],
            "timeStepMinutes": 30,
            "generatedAt": datetime.datetime.now().isoformat()
        },
        "summaryKPIs": {
            "openingBalance": round(opening_balance, 2),
            "peakIntradayUsage": round(min_projected, 2),
            "peakUsageTime": peak_overdraft_time,
            "totalAvailableBuffer": round(funding_totals.get('Cash', 0) + funding_totals.get('Credit Line', 0) + funding_totals.get('Avail. Collateral', 0), 2),
            "cashBuffer": round(funding_totals.get('Cash', 0), 2),
            "creditLineHeadroom": round(funding_totals.get('Credit Line', 0), 2),
            "availableCollateral": round(funding_totals.get('Avail. Collateral', 0), 2),
            "pledgedCollateral": round(funding_totals.get('Pledged Collateral', 0), 2),
            "totalGrossVolume": round(total_inflow + total_outflow, 2),
            "totalInflows": round(total_inflow, 2),
            "totalOutflows": round(total_outflow, 2),
            "matchedRate": matched_ratio,
            "activeAlertCount": len(alerts),
            "highAlertCount": sum(1 for a in alerts if a['severity'].lower() == 'high')
        },
        "trajectories": trajectories,
        "hourlyCashFlows": hourly_cash_flows,
        "fundingSources": funding_sources,
        "fundingTotals": {k: round(v, 2) for k, v in funding_totals.items()},
        "alerts": alerts,
        "topCounterparties": top_counterparties
    }

    with open(args.dest, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)

    print(f"Export successful!")
    print(f"Destination: {args.dest}")
    print(f"Base Date: {target_date} ({display_date})")
    print(f"Trajectories: {len(trajectories)} points")
    print(f"Hourly Flow slots: {len(hourly_cash_flows)}")
    print(f"Alerts: {len(alerts)}")

if __name__ == "__main__":
    main()
