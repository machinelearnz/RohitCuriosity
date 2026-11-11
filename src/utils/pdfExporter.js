/**
 * PDF Exporter for RohitCuriosity Publications & Case Studies
 * Converts rendered articles and portfolio projects into high-resolution,
 * beautifully branded, publication-grade PDFs with KaTeX math, code blocks,
 * executive headers, and hero cover images.
 */
import { resolveMediaUrl } from './mediaStore';

/**
 * Extracts lossless Base64 PNG data URL directly from an already-rendered live image DOM element.
 * Guarantees zero network latency and eliminates broken images in print.
 */
function getBase64FromImgElement(imgEl) {
  try {
    if (!imgEl) return null;
    const w = imgEl.naturalWidth || imgEl.width || imgEl.clientWidth;
    const h = imgEl.naturalHeight || imgEl.height || imgEl.clientHeight;
    if (!w || !h) return null;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgEl, 0, 0);
    return canvas.toDataURL('image/png');
  } catch (e) {
    return null;
  }
}

export function exportToPDF({
  item,
  type = 'blog',
  contentEl = null,
  contentHtml = ''
}) {
  if (!item) return;

  // 1. Gather document metadata
  const title = item.title || 'Untitled Document';
  const author = item.author || 'Rohit Gajare, CFA, FRM, RAI';
  const date = item.formattedDate || item.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const category = item.category || (type === 'blog' ? 'Research & Market Commentary' : 'Quantitative Systems & Proof of Work');
  const summary = item.summary || item.excerpt || '';
  const readTime = item.readTime || '';
  const client = item.client || item.role || '';
  const canonicalUrl = `${window.location.origin}/${type === 'blog' ? 'blogs' : 'portfolio'}/${item.slug || ''}`;
  const technologies = item.technologies || item.tags || [];

  // Map live rendered images to lossless Base64 Data URLs so images are 100% embedded
  const imageBase64Map = new Map();
  if (contentEl) {
    const liveImgs = contentEl.querySelectorAll('img');
    liveImgs.forEach((img, idx) => {
      const b64 = getBase64FromImgElement(img);
      if (b64) {
        if (img.src) imageBase64Map.set(img.src, b64);
        const rawAttr = img.getAttribute('src');
        if (rawAttr) imageBase64Map.set(rawAttr, b64);
        imageBase64Map.set(`idx_${idx}`, b64);
      }
    });
  }

  // Resolve Cover Image URL
  let rawCover = item.coverImage || '';
  if (!rawCover && item.youtubeId) {
    rawCover = `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`;
  }
  let resolvedCover = resolveMediaUrl(rawCover);
  let coverImageUrl = '';
  if (resolvedCover) {
    if (resolvedCover.startsWith('http://') || resolvedCover.startsWith('https://') || resolvedCover.startsWith('data:')) {
      coverImageUrl = resolvedCover;
    } else if (resolvedCover.startsWith('/')) {
      coverImageUrl = new URL(resolvedCover, window.location.origin).href;
    } else {
      coverImageUrl = new URL('/' + resolvedCover, window.location.origin).href;
    }
  }

  // Also check if live cover image exists on page to capture its bitmap
  if (!coverImageUrl || !coverImageUrl.startsWith('data:')) {
    const allPageImgs = Array.from(document.querySelectorAll('img'));
    const matchedCover = allPageImgs.find(img => {
      const s = img.getAttribute('src') || img.src || '';
      return rawCover && s.includes(rawCover.replace('/images/', ''));
    });
    if (matchedCover) {
      const b64 = getBase64FromImgElement(matchedCover);
      if (b64) coverImageUrl = b64;
    }
  }

  // 2. Extract and sanitize HTML content
  let bodyHtml = contentHtml;
  if (!bodyHtml && contentEl) {
    bodyHtml = contentEl.innerHTML;
  } else if (!bodyHtml && typeof document !== 'undefined') {
    const el = document.querySelector('.markdown-content');
    if (el) bodyHtml = el.innerHTML;
  }

  // Fallback if no rendered content found
  if (!bodyHtml) {
    bodyHtml = `<p>${summary || 'No content available for export.'}</p>`;
  }

  // Create temporary container to sanitize interactive elements
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = bodyHtml;

  // Remove interactive UI buttons (e.g. copy buttons, tooltips)
  const buttons = tempDiv.querySelectorAll('button, .copy-button, [aria-label="Copy code"]');
  buttons.forEach(btn => btn.remove());

  // Convert relative image sources to Base64 or absolute URLs, remove lazy loading
  const images = tempDiv.querySelectorAll('img');
  images.forEach((img, idx) => {
    img.removeAttribute('loading');
    img.setAttribute('loading', 'eager');
    img.setAttribute('decoding', 'sync');

    let rawSrc = img.getAttribute('src') || '';
    
    // 1. Try matching with live image Base64 map (instant, zero network request)
    let b64 = imageBase64Map.get(img.src) || imageBase64Map.get(rawSrc) || imageBase64Map.get(`idx_${idx}`);
    if (b64) {
      img.setAttribute('src', b64);
      return;
    }

    // 2. Try media store lookup
    let resolved = resolveMediaUrl(rawSrc);
    if (resolved && resolved.startsWith('data:image/')) {
      img.setAttribute('src', resolved);
      return;
    }

    // 3. Fall back to absolute URL
    let fullUrl = rawSrc;
    if (resolved && !resolved.startsWith('http') && !resolved.startsWith('data:')) {
      if (resolved.startsWith('/')) {
        fullUrl = new URL(resolved, window.location.origin).href;
      } else {
        fullUrl = new URL('/' + resolved, window.location.origin).href;
      }
    } else if (resolved) {
      fullUrl = resolved;
    }
    img.setAttribute('src', fullUrl);
  });

  // Clean up interactive elements in captions (remove zoom icon and "(click image to zoom)")
  const captions = tempDiv.querySelectorAll('figcaption, .markdown-image-caption');
  captions.forEach(cap => {
    cap.querySelectorAll('svg, button, a').forEach(el => el.remove());
    let txt = cap.textContent || '';
    txt = txt.replace(/—\s*\(click image to zoom\)/gi, '')
             .replace(/\(click image to zoom\)/gi, '')
             .replace(/—\s*\(click to enlarge\)/gi, '')
             .trim();
    cap.textContent = txt;
  });

  // Handle YouTube embeds: convert iframe to clean print box
  const iframes = tempDiv.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    const src = iframe.getAttribute('src') || '';
    const videoCallout = document.createElement('div');
    videoCallout.className = 'pdf-video-box';
    videoCallout.innerHTML = `
      <div style="padding: 10px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin: 16px 0; font-size: 9pt;">
        <strong>🎬 Video Resource:</strong> <a href="${src}" style="color: #0284c7; text-decoration: underline;">Watch video briefing online</a>
      </div>
    `;
    iframe.parentNode?.replaceChild(videoCallout, iframe);
  });

  const sanitizedBodyHtml = tempDiv.innerHTML;

  // 3. Assemble Complete High-Fidelity Printable HTML Document
  const docHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <base href="${window.location.origin}/">
  <title>${title} - Rohit Curiosity</title>
  
  <!-- Math Stylesheet (KaTeX) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
  
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

    @page {
      size: A4 portrait;
      margin: 18mm 16mm 18mm 16mm;
      @bottom-right {
        content: "Page " counter(page);
        font-size: 8pt;
        color: #64748b;
        font-family: 'JetBrains Mono', monospace;
      }
      @bottom-left {
        content: "rohitcuriosity.com • Rohit Gajare, CFA, FRM, RAI";
        font-size: 8pt;
        color: #64748b;
        font-family: 'Plus Jakarta Sans', sans-serif;
      }
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.65;
      font-size: 10pt;
      margin: 0;
      padding: 0;
    }

    /* Header & Branding */
    .pdf-header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 14px;
      margin-bottom: 22px;
    }

    .pdf-top-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }

    .pdf-logo {
      font-size: 13pt;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #0f172a;
    }

    .pdf-tagline {
      font-size: 7.5pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #0284c7;
      margin-top: 2px;
    }

    .pdf-author-badge {
      text-align: right;
      font-size: 8pt;
      line-height: 1.3;
      color: #334155;
    }

    .pdf-author-badge strong {
      font-size: 9pt;
      color: #0f172a;
    }

    .pdf-category {
      display: inline-block;
      font-size: 7pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #0284c7;
      background: #e0f2fe;
      padding: 2px 8px;
      border-radius: 4px;
      margin-bottom: 8px;
    }

    .pdf-title {
      font-size: 18pt;
      font-weight: 800;
      line-height: 1.25;
      color: #0f172a;
      margin: 6px 0 10px 0;
      letter-spacing: -0.015em;
    }

    .pdf-meta {
      font-size: 8pt;
      color: #64748b;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 12px;
    }

    .pdf-meta a {
      color: #0284c7;
      text-decoration: none;
    }

    .pdf-abstract {
      background: #f8fafc;
      border-left: 3.5px solid #0284c7;
      border-top: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
      border-radius: 0 6px 6px 0;
      padding: 10px 14px;
      margin-top: 12px;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .pdf-abstract-label {
      font-size: 7pt;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #0284c7;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .pdf-abstract p {
      margin: 0;
      font-size: 9pt;
      font-style: italic;
      color: #334155;
      line-height: 1.5;
    }

    .pdf-tags {
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .pdf-tag-pill {
      font-size: 7pt;
      font-family: 'JetBrains Mono', monospace;
      background: #f1f5f9;
      color: #475569;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    /* Cover Hero Image */
    .pdf-cover-container {
      width: 100%;
      margin: 16px 0 22px 0;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .pdf-cover-image {
      width: 100%;
      max-height: 320px;
      object-fit: contain;
      display: block;
      margin: 0 auto;
      background: #ffffff;
    }

    /* Markdown Article Images & Figures */
    figure, .markdown-image-wrapper {
      margin: 18px 0;
      text-align: center;
      page-break-inside: avoid;
      break-inside: avoid;
      display: block;
      width: 100%;
    }

    figure img, .markdown-image-wrapper img, .pdf-body img {
      max-width: 100% !important;
      height: auto !important;
      max-height: 480px;
      object-fit: contain;
      display: block;
      margin: 0 auto;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      page-break-inside: avoid;
      break-inside: avoid;
    }

    figcaption, .markdown-image-caption {
      margin-top: 8px;
      font-size: 8pt;
      font-weight: 600;
      font-style: italic;
      color: #64748b;
      text-align: center;
      page-break-before: avoid;
      break-before: avoid;
      display: block;
    }

    /* Body Typography */
    .pdf-body {
      color: #1e293b;
    }

    h1, h2, h3, h4, h5, h6 {
      color: #0f172a;
      page-break-after: avoid;
      break-after: avoid;
      margin-top: 1.5em;
      margin-bottom: 0.6em;
    }

    h1 {
      font-size: 14pt;
      font-weight: 800;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 4px;
    }

    h2 {
      font-size: 12pt;
      font-weight: 700;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 3px;
    }

    h3 {
      font-size: 11pt;
      font-weight: 700;
      color: #0369a1;
    }

    h4 {
      font-size: 10pt;
      font-weight: 700;
    }

    p {
      margin: 0 0 1em 0;
      text-align: justify;
      hyphens: auto;
    }

    ul, ol {
      margin: 0.5em 0 1em 1.5em;
      padding: 0;
    }

    li {
      margin-bottom: 0.4em;
    }

    blockquote {
      border-left: 3px solid #0284c7;
      margin: 1.2em 0;
      padding: 8px 16px;
      background: #f8fafc;
      color: #334155;
      font-style: italic;
      border-radius: 0 6px 6px 0;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 8.5pt;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      text-align: left;
      padding: 6px 8px;
      border: 1px solid #cbd5e1;
    }

    td {
      padding: 5px 8px;
      border: 1px solid #e2e8f0;
      vertical-align: top;
    }

    tbody tr:nth-child(even) {
      background: #f8fafc;
    }

    /* Code Blocks */
    pre {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px 12px;
      overflow-x: auto;
      font-family: 'JetBrains Mono', Consolas, monospace;
      font-size: 8pt;
      line-height: 1.45;
      margin: 12px 0;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    code {
      font-family: 'JetBrains Mono', Consolas, monospace;
      font-size: 8.5pt;
      background: #f1f5f9;
      color: #0369a1;
      padding: 1px 4px;
      border-radius: 3px;
    }

    pre code {
      background: transparent;
      padding: 0;
      color: #0f172a;
    }

    /* KaTeX Math */
    .katex-display {
      margin: 12px 0;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .katex {
      font-size: 1.05em;
    }

    /* Footer Note */
    .pdf-footer-note {
      margin-top: 30px;
      padding-top: 12px;
      border-top: 1px solid #cbd5e1;
      font-size: 7.5pt;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .pdf-footer-note a {
      color: #0284c7;
      text-decoration: none;
    }
  </style>
</head>
<body>

  <!-- EXECUTIVE PUBLICATION HEADER -->
  <div class="pdf-header">
    <div class="pdf-top-row">
      <div>
        <div class="pdf-logo">ROHIT CURIOSITY</div>
        <div class="pdf-tagline">Quantitative Finance • Risk Intelligence & AI Governance</div>
      </div>
      <div class="pdf-author-badge">
        <strong>${author}</strong><br>
        <span>rohitcuriosity.com</span>
      </div>
    </div>

    <div class="pdf-category">${category}</div>
    <div class="pdf-title">${title}</div>

    <div class="pdf-meta">
      <span><strong>Published:</strong> ${date}</span>
      ${readTime ? `<span>• <strong>Reading Time:</strong> ${readTime}</span>` : ''}
      ${client ? `<span>• <strong>Focus:</strong> ${client}</span>` : ''}
      <span>• <strong>Source:</strong> <a href="${canonicalUrl}">${canonicalUrl}</a></span>
    </div>

    ${summary ? `
      <div class="pdf-abstract">
        <div class="pdf-abstract-label">EXECUTIVE SUMMARY</div>
        <p>${summary}</p>
      </div>
    ` : ''}

    ${technologies && technologies.length > 0 ? `
      <div class="pdf-tags">
        ${technologies.map(t => `<span class="pdf-tag-pill">#${t}</span>`).join('')}
      </div>
    ` : ''}
  </div>

  <!-- COVER HERO IMAGE -->
  ${coverImageUrl ? `
    <div class="pdf-cover-container">
      <img src="${coverImageUrl}" alt="${title}" class="pdf-cover-image" />
    </div>
  ` : ''}

  <!-- ARTICLE / PROJECT BODY CONTENT -->
  <div class="pdf-body">
    ${sanitizedBodyHtml}
  </div>

  <!-- PUBLICATION FOOTER -->
  <div class="pdf-footer-note">
    <span>© ${new Date().getFullYear()} Rohit Gajare (CFA, FRM, RAI) • Published on rohitcuriosity.com</span>
    <span>Archival Document & Briefing Note</span>
  </div>

</body>
</html>`;

  // 4. Inject offscreen iframe with full viewport dimensions to trigger native Print dialog
  const printFrame = document.createElement('iframe');
  printFrame.style.position = 'fixed';
  printFrame.style.left = '-9999px';
  printFrame.style.top = '0';
  printFrame.style.width = '1024px';
  printFrame.style.height = '1024px';
  printFrame.style.border = '0';
  printFrame.style.visibility = 'hidden';
  document.body.appendChild(printFrame);

  const frameDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
  if (!frameDoc) {
    document.body.removeChild(printFrame);
    return;
  }

  frameDoc.open();
  frameDoc.write(docHtml);
  frameDoc.close();

  // Trigger print dialog once images and fonts are loaded
  const triggerPrint = () => {
    try {
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();
    } catch (err) {
      console.error('Error invoking print:', err);
    } finally {
      // Clean up iframe after printing dialog closes
      setTimeout(() => {
        if (document.body.contains(printFrame)) {
          document.body.removeChild(printFrame);
        }
      }, 60000);
    }
  };

  const frameImages = Array.from(frameDoc.querySelectorAll('img'));
  // Ensure broken or missing images gracefully disappear rather than showing blank/black containers
  frameImages.forEach(img => {
    img.addEventListener('error', () => {
      const coverBox = img.closest('.pdf-cover-container');
      if (coverBox) coverBox.style.display = 'none';
      const fig = img.closest('figure, .markdown-image-wrapper');
      if (fig) fig.style.display = 'none';
      img.style.display = 'none';
    });
  });
  if (frameImages.length === 0) {
    setTimeout(triggerPrint, 350);
  } else {
    let printed = false;
    const executePrint = () => {
      if (!printed) {
        printed = true;
        setTimeout(triggerPrint, 300);
      }
    };

    const imagePromises = frameImages.map(img => {
      if (img.src && img.src.startsWith('data:')) {
        return Promise.resolve();
      }
      if (img.decode) {
        return img.decode().catch(() => {});
      }
      if (img.complete && img.naturalWidth > 0) {
        return Promise.resolve();
      }
      return new Promise(resolve => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      });
    });

    Promise.all(imagePromises).then(executePrint);

    // Safety fallback timeout in case an image hangs
    setTimeout(executePrint, 3500);
  }
}
