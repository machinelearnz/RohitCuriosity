import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle, 
  MessageSquare, 
  Sparkles, 
  MapPin, 
  Clock, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContactSection({ isDark }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [transmissionId, setTransmissionId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const newTxId = `TX-${Math.floor(10000 + Math.random() * 90000)}`;

    setTimeout(() => {
      // Save transmission to localStorage so Admin Content Studio can view it in Inbox
      try {
        const existingMessages = JSON.parse(localStorage.getItem('rohit_contact_messages') || '[]');
        const newMessage = {
          id: `msg_${Date.now()}`,
          txId: newTxId,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          timestamp: new Date().toISOString(),
          status: 'unread'
        };
        localStorage.setItem('rohit_contact_messages', JSON.stringify([newMessage, ...existingMessages]));
      } catch (err) {
        console.error('Error saving contact message:', err);
      }

      setTransmissionId(newTxId);
      setLoading(false);
      setSubmitted(true);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log(err);
      }
    }, 500);
  };

  const mailtoLink = `mailto:work@rohitcuriosity.com?subject=${encodeURIComponent(
    `[${transmissionId || 'Transmission'}] ${formData.inquiryType} - from ${formData.name || 'Website Visitor'}`
  )}&body=${encodeURIComponent(
    `Name: ${formData.name}\nEmail: ${formData.email}\nInquiry Scope: ${formData.inquiryType}\nReference ID: ${transmissionId}\n\nMessage:\n${formData.message}`
  )}`;

  return (
    <section id="contact" className="py-24 relative">
      {/* Background Accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-96 bg-brand-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Direct Transmissions</span>
          </div>
          <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight mb-2 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Let’s Build Something <span className="text-brand-400">Exceptional</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className={`p-8 rounded-3xl border ${
              isDark ? 'bg-slate-900/60 border-slate-800 shadow-card-dark' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Advisory & Collaboration
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed mb-6 font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                I look forward to hearing & collaborating with you.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">General Communication</span>
                    <a href="mailto:hello@rohitcuriosity.com" className="text-sm font-semibold text-brand-400 hover:underline">
                      hello@rohitcuriosity.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Business & Partnerships</span>
                    <a href="mailto:work@rohitcuriosity.com" className="text-sm font-semibold text-amber-400 hover:underline">
                      work@rohitcuriosity.com
                    </a>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className={`p-8 sm:p-10 rounded-3xl border ${
              isDark ? 'bg-slate-900/70 border-slate-800 shadow-card-dark' : 'bg-white border-slate-200 shadow-md'
            }`}>
              
              {submitted ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Message Transmitted & Logged!
                    </h3>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono bg-brand-500/10 text-brand-400 border border-brand-500/30 mt-2">
                      <span>Reference ID:</span>
                      <strong className="text-white">{transmissionId}</strong>
                    </div>
                  </div>
                  <p className={`text-xs sm:text-sm max-w-md mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Thank you for reaching out, <span className="font-semibold text-brand-400">{formData.name}</span>. Your transmission has been logged into the Admin Inbox for review.
                  </p>
                  
                  <div className="pt-4 flex items-center justify-center">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          email: '',
                          inquiryType: 'Venture Advisory',
                          budget: '$10k - $25k',
                          message: ''
                        });
                      }}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-400 text-white shadow-glow-brand transition-all"
                    >
                      Send Another Transmission
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Alex Vance"
                        className={`w-full px-4 py-3 rounded-xl text-sm transition-all outline-none focus:ring-2 focus:ring-brand-400 ${
                          isDark ? 'bg-slate-950/80 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@fund.com"
                        className={`w-full px-4 py-3 rounded-xl text-sm transition-all outline-none focus:ring-2 focus:ring-brand-400 ${
                          isDark ? 'bg-slate-950/80 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>



                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Brief Message & Details *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Outline your strategic goals, timeline, or key questions..."
                      className={`w-full px-4 py-3 rounded-xl text-sm transition-all outline-none focus:ring-2 focus:ring-brand-400 ${
                        isDark ? 'bg-slate-950/80 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-brand-500 to-blue-600 hover:from-brand-400 hover:to-blue-500 text-white shadow-glow-brand transition-all disabled:opacity-50 transform hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
