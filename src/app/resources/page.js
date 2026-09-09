"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import styles from "./resources.module.css";

const HELPLINES = [
  { name: "Childline India", number: "1098", desc: "24/7 helpline for children in distress", hours: "24 hours" },
  { name: "iCall", number: "9152987821", desc: "Psychosocial helpline by TISS", hours: "Mon-Sat, 8am-10pm" },
  { name: "Vandrevala Foundation", number: "1860-2662-345", desc: "Mental health support", hours: "24 hours" },
  { name: "NIMHANS", number: "080-46110007", desc: "National Institute of Mental Health", hours: "Mon-Sat, 9am-5pm" },
  { name: "Sneha India", number: "044-24640050", desc: "Emotional support and crisis intervention", hours: "24 hours" },
  { name: "Crisis Text Line", number: "Text HOME to 741741", desc: "Text-based crisis support", hours: "24 hours" },
];

const TYPES = [
  { title: "Verbal Bullying", desc: "Name-calling, insults, threats, and intimidation through words. It can happen in person, online, or through messages." },
  { title: "Physical Bullying", desc: "Hitting, pushing, kicking, or any form of physical aggression. Also includes damaging someone's belongings." },
  { title: "Cyberbullying", desc: "Harassment through digital platforms, social media, messages, gaming. Includes sharing private info without consent." },
  { title: "Social / Relational", desc: "Exclusion, spreading rumors, damaging reputation, silent treatment. Often the hardest to recognize and report." },
];

const FAQS = [
  { q: "Is my report really anonymous?", a: "Yes. We never collect your IP address, device info, or any identifying information. Your Report ID and passphrase are the only keys to access your report." },
  { q: "What happens after I submit a report?", a: "An admin reviews your report within 24-48 hours. You can track status changes using your Report ID and passphrase on the Track page." },
  { q: "Can anyone find out it was me?", a: "No. Even if you choose to sign in with Google, your identity is never linked to your report if you submit anonymously." },
  { q: "What if my report is about something happening right now?", a: "If you or someone else is in immediate danger, call 112 (Emergency) or your local police. This platform is for reporting, not emergency response." },
  { q: "Can I report on behalf of someone else?", a: "Absolutely. Bystander reports are encouraged. You can describe what you witnessed and the admin team will investigate." },
  { q: "How long is my data stored?", a: "Evidence files are purged 30 days after a case is resolved. Text data (your description, messages) is retained for records but anonymized." },
  { q: "Can I send messages to the admin?", a: "Yes. Once your report is submitted, you can use the Track page to send and receive messages with the admin team. Your identity remains protected." },
];

const ORGS = [
  { name: "StopBullying.gov", url: "https://www.stopbullying.gov", desc: "U.S. federal government resource" },
  { name: "Anti-Bullying Alliance", url: "https://anti-bullyingalliance.org.uk", desc: "UK-based coalition" },
  { name: "Cybersmile Foundation", url: "https://www.cybersmile.org", desc: "Digital wellbeing and cyberbullying support" },
  { name: "UNESCO Anti-Bullying", url: "https://en.unesco.org/themes/school-violence-and-bullying", desc: "International resources and research" },
];

export default function ResourcesPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.soul}>you are not alone in this</p>
          <h1 className={styles.heading}>Resources</h1>
          <p className={styles.desc}>
            Helplines, educational content, and organizations that can help. Reach out. Someone is always listening.
          </p>

          {/* ---- HELPLINES ---- */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Helplines</h2>
            <p className={styles.sectionDesc}>If you need to talk to someone right now.</p>
            <div className={styles.helplineGrid}>
              {HELPLINES.map((h, i) => (
                <div key={i} className={styles.helplineCard}>
                  <h3 className={styles.helplineName}>{h.name}</h3>
                  <p className={styles.helplineNumber}>{h.number}</p>
                  <p className={styles.helplineDesc}>{h.desc}</p>
                  <p className={styles.helplineHours}>{h.hours}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ---- TYPES OF BULLYING ---- */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Understanding Bullying</h2>
            <p className={styles.sectionDesc}>Recognizing it is the first step to stopping it.</p>
            <div className={styles.typesGrid}>
              {TYPES.map((t, i) => (
                <div key={i} className={styles.typeCard}>
                  <h3 className={styles.typeName}>{t.title}</h3>
                  <p className={styles.typeDesc}>{t.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ---- BYSTANDER TIPS ---- */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>What You Can Do</h2>
            <div className={styles.tipsList}>
              <div className={styles.tip}><span className={styles.tipNum}>01</span><p>Speak up when you see it happening. Silence protects the bully, not the victim.</p></div>
              <div className={styles.tip}><span className={styles.tipNum}>02</span><p>Document what you see. Dates, times, who was involved. Details matter.</p></div>
              <div className={styles.tip}><span className={styles.tipNum}>03</span><p>Report it. You can do it anonymously through this platform. The person being bullied may not feel safe enough to report themselves.</p></div>
              <div className={styles.tip}><span className={styles.tipNum}>04</span><p>Support the person being bullied. A simple "are you okay?" can change everything.</p></div>
              <div className={styles.tip}><span className={styles.tipNum}>05</span><p>Do not retaliate. Violence and counter-bullying only escalate the situation.</p></div>
            </div>
          </section>

          {/* ---- FAQ ---- */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Common Questions</h2>
            <div className={styles.faqList}>
              {FAQS.map((faq, i) => (
                <div key={i} className={styles.faqItem}>
                  <button
                    className={`${styles.faqQ} ${openFaq === i ? styles.faqQOpen : ""}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>{faq.q}</span>
                    <span className={styles.faqChevron}>{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && (
                    <div className={styles.faqA}>
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ---- ORGANIZATIONS ---- */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Organizations</h2>
            <p className={styles.sectionDesc}>Verified organizations working to end bullying.</p>
            <div className={styles.orgGrid}>
              {ORGS.map((o, i) => (
                <a key={i} href={o.url} target="_blank" rel="noopener noreferrer" className={styles.orgCard}>
                  <h3 className={styles.orgName}>{o.name}</h3>
                  <p className={styles.orgDesc}>{o.desc}</p>
                  <span className={styles.orgLink}>Visit →</span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
