import React, { useState } from "react";
import { Menu, X } from "lucide-react";

// --- DATA ARRAYS ---
const marqueeHeadlines = [
  "TXSC 26-0591: Emergency motion denied, case proceeds",
  "Bexar County DA office responds to subpoena request",
  "Judge Huddle recusal motion filed — ruling pending",
  "New court filing: Plaintiff's supplemental brief submitted",
  "Llano County records request partially fulfilled after 60-day delay",
  "AG opinion sought on clerk's refusal to certify documents",
];

const investigations = [
  {
    title: "Judicial Override: How TXSC 26-0591 Broke Its Own Rules",
    deck: "Court procedural violations and ex parte communications documented in the case record.",
    location: "TXSC COURT",
    status: "DEVELOPING",
  },
  {
    title: "The Llano County Document Retention Scandal",
    deck: "County officials failed to preserve public records in violation of state retention law.",
    location: "LLANO COUNTY, TX",
    status: "DEVELOPING",
  },
  {
    title: "AG Opinion Watch: Clerk Certification Refusal",
    deck: "Texas AG's office examining whether county clerk's refusal constitutes obstruction.",
    location: "AUSTIN, TX",
    status: "DEVELOPING",
  },
  {
    title: "Report: Third-Party Surveillance Complaint Filed",
    deck: "Federal complaint alleges improper monitoring of journalist communications.",
    location: "FEDERAL",
    status: "PUBLISHED",
  },
];

const courtDocuments = [
  {
    type: "MOTION",
    title: "Emergency Motion to Recuse",
    case: "TXSC No. 26-0591",
    date: "2026-06-12",
  },
  {
    type: "BRIEF",
    title: "Plaintiff's Supplemental Brief re: Procedural Defects",
    case: "TXSC No. 26-0591",
    date: "2026-06-08",
  },
  {
    type: "ORDER",
    title: "Order Denying Emergency Relief — Judge Huddle",
    case: "Bexar Co. DC-2024-9821",
    date: "2026-06-01",
  },
  {
    type: "SUBPOENA",
    title: "Subpoena Duces Tecum — Bexar DA Office",
    case: "TXSC No. 26-0591",
    date: "2026-05-28",
  },
];

const liveUpdates = [
  { time: "14:32 CDT", day: "today", text: "TXSC clerk acknowledges receipt of supplemental brief. No action taken." },
  { time: "11:17 CDT", day: "today", text: "Bexar DA office counsel requests 30-day extension on subpoena compliance." },
  { time: "09:41 CDT", day: "today", text: "Judge Huddle issues administrative order: no comment on pending recusal motion." },
  { time: "16:55", day: "Yesterday", text: "New document indexed: Plaintiff's proposed findings of fact filed." },
  { time: "08:22", day: "Yesterday", text: "Source confirms AG opinion request formally submitted." },
];

const indexedDocuments = [
  { id: "GJ-2026-001", title: "Emergency Motion to Recuse — Judge Huddle", caseRef: "TXSC 26-0591" },
  { id: "GJ-2026-002", title: "Plaintiff's Supplemental Brief (Procedural Defects)", caseRef: "TXSC 26-0591" },
  { id: "GJ-2026-003", title: "Order Denying Emergency Relief", caseRef: "Bexar Co. DC-2024-9821" },
  { id: "GJ-2026-004", title: "Subpoena Duces Tecum — DA Office", caseRef: "TXSC 26-0591" },
  { id: "GJ-2026-005", title: "Plaintiff's Proposed Findings of Fact", caseRef: "TXSC 26-0591" },
  { id: "GJ-2026-006", title: "Notice of Third-Party Surveillance Complaint", caseRef: "Federal" },
  { id: "GJ-2026-007", title: "Llano County Records Request — Partial Production", caseRef: "Public Records" },
  { id: "GJ-2026-008", title: "AG Opinion Request — Clerk Certification Refusal", caseRef: "AG No. 2026-0412" },
];

// --- STYLES ---
const customStyles = `
  html { scroll-behavior: smooth; }
  body {
    background-color: #0a0a0a;
    color: #f0ede8;
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
  }
  
  .font-playfair { font-family: 'Playfair Display', serif; }
  .font-mono { font-family: 'IBM Plex Mono', monospace; }
  .font-inter { font-family: 'Inter', sans-serif; }

  .bg-base { background-color: #0a0a0a; }
  .bg-card { background-color: #111111; }
  .bg-document { background-color: #0d0d0d; }
  
  .text-primary { color: #b5352a; }
  .bg-primary { background-color: #b5352a; }
  
  .text-gold { color: #c9953a; }
  .bg-gold { background-color: #c9953a; }
  
  .text-white-warm { color: #f0ede8; }
  .text-muted { color: #7a7570; }
  .text-dim { color: #4a4542; }

  .border-subtle { border-color: rgba(240, 237, 232, 0.08); }
  
  /* Marquee Animation */
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .animate-marquee {
    display: inline-block;
    white-space: nowrap;
    animation: marquee 30s linear infinite;
  }
  .marquee-container {
    overflow: hidden;
    white-space: nowrap;
    display: flex;
    flex-wrap: nowrap;
  }

  /* Pulse Animation */
  @keyframes pulse-dot {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(181, 53, 42, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 4px rgba(181, 53, 42, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(181, 53, 42, 0); }
  }
  .pulse-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #b5352a;
    display: inline-block;
    animation: pulse-dot 2s infinite;
  }

  /* Grid background */
  .grid-bg {
    background-image: 
      repeating-linear-gradient(rgba(240, 237, 232, 0.03) 0 1px, transparent 1px 100%),
      repeating-linear-gradient(90deg, rgba(240, 237, 232, 0.03) 0 1px, transparent 1px 100%);
    background-size: 40px 40px;
  }
`;

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="min-h-screen bg-base text-white-warm flex flex-col">
        
        {/* 1. TOP BAR */}
        <div className="bg-document border-b border-subtle py-2 px-4 md:px-8 flex justify-between items-center text-muted font-mono" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
          <div>OMNIVERSAL MEDIA NETWORK</div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white-warm transition-colors">𝕏</a>
            <a href="#" className="hover:text-white-warm transition-colors">S</a>
            <a href="#" className="hover:text-white-warm transition-colors">⊞</a>
          </div>
        </div>

        {/* 2. NAV */}
        <nav className="sticky top-0 z-50 border-b border-subtle backdrop-blur-md px-4 md:px-8 py-4 flex items-center justify-between" style={{ backgroundColor: 'rgba(10,10,10,0.95)' }}>
          <div className="font-playfair font-bold text-[20px] whitespace-nowrap">
            <span className="text-white-warm">GUERRILLA</span>{" "}
            <span className="text-primary">JOURNALISM</span>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center font-inter text-[12px] uppercase text-muted" style={{ letterSpacing: '0.15em' }}>
            <a href="#investigations" className="hover:text-white-warm transition-colors">Investigations</a>
            <a href="#documents" className="hover:text-white-warm transition-colors">Reports</a>
            <a href="#index" className="hover:text-white-warm transition-colors">Documents</a>
            <a href="#live" className="hover:text-white-warm transition-colors">Live Feed</a>
            <a href="#about" className="hover:text-white-warm transition-colors">About</a>
          </div>

          <div className="hidden md:block">
            <button className="bg-primary text-white-warm font-inter font-bold text-[11px] uppercase px-4 py-2 hover:opacity-90 transition-opacity" style={{ letterSpacing: '0.1em' }}>
              SUBSCRIBE
            </button>
          </div>

          <button className="md:hidden text-white-warm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-card border-b border-subtle absolute top-full left-0 w-full z-40 p-4 flex flex-col space-y-4 font-inter text-[12px] uppercase text-muted" style={{ letterSpacing: '0.15em' }}>
            <a href="#investigations" onClick={() => setMobileMenuOpen(false)}>Investigations</a>
            <a href="#documents" onClick={() => setMobileMenuOpen(false)}>Reports</a>
            <a href="#index" onClick={() => setMobileMenuOpen(false)}>Documents</a>
            <a href="#live" onClick={() => setMobileMenuOpen(false)}>Live Feed</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
            <button className="bg-primary text-white-warm font-bold text-[11px] px-4 py-2 mt-4 self-start">
              SUBSCRIBE
            </button>
          </div>
        )}

        {/* 3. HERO */}
        <section className="relative w-full min-h-[100dvh] bg-base grid-bg flex flex-col justify-center px-4 md:px-8 py-20">
          <div className="absolute top-8 right-4 md:right-8 flex items-center space-x-2 px-3 py-1 border rounded-none" style={{ backgroundColor: 'rgba(181,53,42,0.15)', borderColor: 'rgba(181,53,42,0.3)' }}>
            <span className="pulse-dot"></span>
            <span className="font-mono text-[11px] text-primary">LIVE</span>
          </div>

          <div className="max-w-4xl">
            <h1 className="font-playfair text-[48px] md:text-[64px] lg:text-[80px] text-white-warm leading-tight mb-6">
              Where the Record Speaks for Itself
            </h1>
            <p className="font-inter text-[18px] text-muted max-w-[540px] mb-10 leading-relaxed">
              Independent investigative journalism. Court records. Public documents. The truth in its own words.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-primary text-white-warm font-inter text-sm px-6 py-3 hover:opacity-90 transition-opacity">
                Latest Investigation →
              </button>
              <button className="bg-transparent border text-white-warm font-inter text-sm px-6 py-3 hover:bg-white/5 transition-colors" style={{ borderColor: 'rgba(240,237,232,0.2)' }}>
                Document Index →
              </button>
            </div>
          </div>
        </section>

        {/* 4. BREAKING/LIVE FEED STRIP */}
        <div id="live" className="w-full bg-gold py-2 flex items-center relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center px-3" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
            <span className="font-mono font-bold text-[10px] text-white-warm">DEVELOPING</span>
          </div>
          <div className="marquee-container w-full ml-28">
            <div className="animate-marquee font-mono text-[12px] text-white-warm flex space-x-4">
              {marqueeHeadlines.map((h, i) => (
                <span key={i} className="flex items-center">
                  <span>{h}</span>
                  <span className="mx-4">◆</span>
                </span>
              ))}
              {marqueeHeadlines.map((h, i) => (
                <span key={`dup-${i}`} className="flex items-center">
                  <span>{h}</span>
                  <span className="mx-4">◆</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 5. FEATURED INVESTIGATION CARD */}
        <section id="investigations" className="w-full px-4 md:px-8 py-12 bg-base">
          <div className="bg-card w-full border-t-[3px] p-8 md:p-12 lg:p-16 relative" style={{ borderTopColor: '#b5352a' }}>
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8 space-y-4 md:space-y-0">
              <span className="font-mono text-[10px] text-muted uppercase" style={{ letterSpacing: '0.2em' }}>
                FEATURED INVESTIGATION
              </span>
              <div className="flex items-center space-x-2 px-3 py-1 border rounded-none" style={{ backgroundColor: 'rgba(181,53,42,0.15)', borderColor: 'rgba(181,53,42,0.3)' }}>
                <span className="pulse-dot"></span>
                <span className="font-mono text-[11px] text-primary">DEVELOPING</span>
              </div>
            </div>

            <h2 className="font-playfair italic text-[36px] md:text-[42px] lg:text-[52px] text-white-warm mb-6 leading-tight">
              The Court That Wouldn't Stop
            </h2>
            
            <p className="font-inter text-[16px] text-muted max-w-[640px] mb-8 leading-relaxed">
              A multi-year investigation into judicial misconduct, improper procedure, and obstruction across the Texas Supreme Court and Bexar County courts. Case No. TXSC 26-0591 — still active.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <div className="px-3 py-1 border font-mono text-[11px] text-gold flex space-x-2 items-center" style={{ backgroundColor: 'rgba(201,149,58,0.15)', borderColor: 'rgba(201,149,58,0.3)' }}>
                <span>TXSC No. 26-0591</span>
                <span className="opacity-50">|</span>
                <span>PENDING</span>
              </div>
              <div className="px-3 py-1 border font-mono text-[11px] text-gold flex space-x-2 items-center" style={{ backgroundColor: 'rgba(201,149,58,0.15)', borderColor: 'rgba(201,149,58,0.3)' }}>
                <span>Bexar Co.</span>
                <span className="opacity-50">|</span>
                <span>ACTIVE</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-subtle pt-6 mt-auto">
              <a href="#" className="font-inter text-primary text-sm font-medium hover:underline mb-4 sm:mb-0">
                Read Investigation →
              </a>
              <span className="font-mono text-[10px] text-dim uppercase" style={{ letterSpacing: '0.2em' }}>
                LLANO & BEXAR COUNTY, TX
              </span>
            </div>
          </div>
        </section>

        {/* 6. FEED GRID (3 columns) */}
        <section className="px-4 md:px-8 py-12 bg-base">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Col 1: INVESTIGATIONS */}
            <div>
              <div className="font-mono text-[11px] text-muted uppercase pb-3 border-b border-subtle relative mb-6" style={{ letterSpacing: '0.2em' }}>
                INVESTIGATIONS
                <div className="absolute bottom-[-1px] left-0 w-12 h-[1px] bg-primary"></div>
              </div>
              <div className="space-y-6">
                {investigations.map((item, idx) => (
                  <div key={idx} className="pb-6 border-b border-subtle last:border-0">
                    <h3 className="font-playfair text-[18px] text-white-warm mb-2">{item.title}</h3>
                    <p className="font-inter text-[13px] text-muted mb-4 line-clamp-2">{item.deck}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-dim">{item.location}</span>
                      <span className="font-mono text-[9px] px-2 py-0.5 border border-subtle text-muted">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Col 2: COURT DOCUMENTS */}
            <div id="documents">
              <div className="font-mono text-[11px] text-muted uppercase pb-3 border-b border-subtle relative mb-6" style={{ letterSpacing: '0.2em' }}>
                COURT DOCUMENTS
                <div className="absolute bottom-[-1px] left-0 w-12 h-[1px] bg-gold"></div>
              </div>
              <div className="space-y-4">
                {courtDocuments.map((doc, idx) => (
                  <div key={idx} className="p-4 bg-card border-l-[2px] hover:bg-[#151515] transition-colors cursor-pointer" style={{ borderLeftColor: '#c9953a' }}>
                    <div className="font-mono text-[10px] text-gold mb-2">{doc.type}</div>
                    <h4 className="font-inter text-[14px] text-white-warm mb-3">{doc.title}</h4>
                    <div className="flex justify-between items-center font-mono text-[10px] text-muted">
                      <span>{doc.case}</span>
                      <span>{doc.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Col 3: LIVE UPDATES */}
            <div>
              <div className="font-mono text-[11px] text-muted uppercase pb-3 border-b border-subtle relative mb-6" style={{ letterSpacing: '0.2em' }}>
                LIVE UPDATES
                <div className="absolute bottom-[-1px] left-0 w-12 h-[1px] bg-primary"></div>
              </div>
              <div className="space-y-0">
                {liveUpdates.map((update, idx) => (
                  <div key={idx} className="pb-4 pt-4 border-b border-subtle first:pt-0 last:border-0 flex flex-col space-y-2">
                    <div className="font-mono text-[10px] text-gold">[{update.day === 'today' ? update.time : `${update.day} ${update.time}`}]</div>
                    <div className="font-inter text-[13px] text-white-warm leading-relaxed">{update.text}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* 7. DOCUMENT REPOSITORY SECTION */}
        <section id="index" className="w-full bg-document py-16 px-4 md:px-8 border-t border-subtle">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-subtle">
              <h2 className="font-mono text-[14px] text-muted uppercase" style={{ letterSpacing: '0.3em' }}>DOCUMENT INDEX</h2>
              <span className="font-mono text-[10px] text-dim px-2 py-1 border border-subtle">GJ-INDEX-2026</span>
            </div>
            
            <div className="flex flex-col">
              {indexedDocuments.map((doc) => (
                <div key={doc.id} className="flex flex-col md:flex-row md:items-center py-4 border-b border-subtle hover:bg-white/5 transition-colors px-2 -mx-2">
                  <div className="font-mono text-[12px] text-gold w-32 shrink-0 mb-1 md:mb-0">{doc.id}</div>
                  <div className="font-mono text-[13px] text-white-warm flex-grow mb-1 md:mb-0 pr-4">{doc.title}</div>
                  <div className="font-mono text-[11px] text-dim w-48 shrink-0 mb-2 md:mb-0">{doc.caseRef}</div>
                  <a href="#" className="font-inter text-[11px] font-semibold text-primary hover:underline shrink-0">VIEW →</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. PUBLICATION MISSION SECTION */}
        <section id="about" className="w-full bg-base py-16 px-4 md:px-8 flex justify-center">
          <div className="max-w-3xl w-full border-l-[4px] pl-6 md:pl-10" style={{ borderLeftColor: '#b5352a' }}>
            <h2 className="font-playfair italic text-[28px] md:text-[32px] text-white-warm mb-8">
              We Publish the Record. You Decide.
            </h2>
            <div className="font-inter text-[16px] text-muted leading-[1.8] space-y-6 mb-10">
              <p>
                Guerrilla Journalism exists because the public record is not always public. Court filings disappear. Documents get 'lost.' Clerks refuse to certify. We obtain, preserve, and publish the primary source.
              </p>
              <p>
                Every investigation begins with a document. Every document is publicly available under the law. Our reporters do not rely on anonymous sources or leaked materials — we work from the record itself, as it was filed, stamped, and entered.
              </p>
              <p>
                This work is protected by the First Amendment. Our publication is independent. We accept no advertising. We are not affiliated with any political party, law firm, or government entity. Our allegiance is to the record.
              </p>
            </div>
            <div className="font-mono text-[10px] text-dim">
              First Amendment | Press Freedom | Public Records
            </div>
          </div>
        </section>

        {/* 9. SUBSCRIBE SECTION */}
        <section className="w-full bg-card py-16 px-4 md:px-8 border-t border-subtle flex flex-col items-center text-center">
          <h2 className="font-playfair text-[24px] md:text-[28px] text-white-warm mb-3">
            Get Investigations Delivered Before the Press Release
          </h2>
          <p className="font-inter text-[14px] text-muted mb-8 max-w-md">
            Substack newsletter. No ads. No paywalls on primary documents. Just the record.
          </p>
          
          <form className="flex w-full max-w-md mb-4" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Email address" 
              className="flex-grow bg-transparent border text-white-warm px-4 py-3 font-inter outline-none focus:border-primary transition-colors"
              style={{ borderColor: 'rgba(240,237,232,0.2)' }}
              required
            />
            <button type="submit" className="bg-primary text-white-warm font-mono text-[12px] px-6 py-3 hover:opacity-90 transition-opacity">
              SUBSCRIBE
            </button>
          </form>
          
          <div className="font-inter text-[12px] text-dim">
            Published on Substack. Unsubscribe anytime.
          </div>
        </section>

        {/* 10. FOOTER */}
        <footer className="w-full bg-document py-12 px-4 md:px-8 border-t border-subtle">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10 md:gap-4 mb-12">
            
            <div className="flex flex-col space-y-2">
              <div className="font-playfair font-bold text-[18px]">
                <span className="text-white-warm">GUERRILLA</span>{" "}
                <span className="text-primary">JOURNALISM</span>
              </div>
              <div className="font-mono text-[11px] text-dim">An Omniversal Media Publication</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
              <div className="flex flex-col space-y-3 font-inter text-[13px] text-muted">
                <span className="font-mono text-[10px] text-dim mb-1">PUBLICATION</span>
                <a href="#" className="hover:text-white-warm transition-colors">guerrillajournalism.com</a>
                <a href="#" className="hover:text-white-warm transition-colors">omniversalmedia.press</a>
              </div>
              <div className="flex flex-col space-y-3 font-inter text-[13px] text-muted">
                <span className="font-mono text-[10px] text-dim mb-1">LEGAL</span>
                <a href="#" className="hover:text-white-warm transition-colors">legal@omniversalmedia.llc</a>
              </div>
              <div className="flex flex-col space-y-3 font-inter text-[13px] text-muted">
                <span className="font-mono text-[10px] text-dim mb-1">EDITORIAL</span>
                <a href="#" className="hover:text-white-warm transition-colors">Submit a Tip</a>
                <a href="#" className="hover:text-white-warm transition-colors">Document Request</a>
                <a href="#" className="hover:text-white-warm transition-colors">Press Inquiry</a>
              </div>
            </div>
            
          </div>

          <div className="max-w-6xl mx-auto border-t border-subtle pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <p className="font-inter text-[12px] text-dim max-w-[640px] leading-relaxed">
              Guerrilla Journalism is an independent publication of Omniversal Media LLC. All documents published herein are obtained through legal means including public records requests, court filings, and other publicly available sources. Nothing on this site constitutes legal advice. Omniversal Media LLC is not a law firm.
            </p>
            <div className="font-mono text-[10px] text-dim shrink-0">
              © 2026 Omniversal Media LLC. All rights reserved.
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
