import Link from "next/link";

const ambassadors = [
  ["Mou Baidya", "Spondon Brand Ambassador", "/amb-mou.jpg"],
  ["Anwesha Ghosh", "Spondon Sharod Samman Brand Ambassador", "/amb-anwesha.jpg"],
  ["Sudipa Sarkar", "AIFFA Brand Ambassador", "/amb-sudipa.jpg"],
];

const partners = [
  ["পাঁচফোড়ন", "Powered By", "/panchforon.jpg"],
  ["Bong Series", "Associate Partner", "/bong-series.jpg"],
  ["Minu Fashions", "Wardrobe Partner", "/minu.jpg"],
  ["Panache Production Pvt Ltd", "Associate Partner", "/panache.jpg"],
  ["Sera Bangla TV", "Media Partner", "/serabangla.jpg"],
];

export default function Home() {
  return <main className="site-shell">
    <header className="public-header">
      <Link className="brand-lockup" href="/"><img src="/spondon-sharod-somman-2026.png" alt="Spondon"/><span><strong>Spondon</strong><small>Sharod Samman 2026</small></span></Link>
      <div className="header-actions"><div className="aiffa-member"><span>Affiliated by</span><img src="/aiffa.jpg" alt="AIFFA"/></div><Link className="button header-cta" href="/register">Register Your Pujo</Link></div>
    </header>
    <section className="brand-hero"><img src="/spondon-hero.png" alt="Spondon Sharod Samman 2026"/></section>
    <section className="home-callout"><div><span className="eyebrow">Spondon Sharod Samman 2026</span><h1>Register your Pujo.</h1><p>Registration is now open for Pujo committees participating in Spondon Sharod Samman 2026.</p></div><Link className="button" href="/register">Register Your Pujo →</Link></section>
    <section className="steps">{[["01","Register","Share committee, contact, theme and artist details."],["02","Review","Spondon reviews and confirms the season registration."],["03","Participate","Banner distribution and on-ground programme activity are tracked separately."]].map(([n,t,d])=><article key={n}><b>{n}</b><h3>{t}</h3><p>{d}</p></article>)}</section>
    <section className="ambassadors"><span className="eyebrow">Faces of Spondon</span><h2>Brand Ambassadors</h2><div className="ambassador-grid">{ambassadors.map(([name,role,img])=><article key={name}><img src={img} alt={name}/><div><h3>{name}</h3><p>{role}</p></div></article>)}</div></section>
    <section className="partner-strip"><h2>Partners</h2><div className="partner-grid">{partners.map(([name,role,img])=><article key={name}><span>{role}</span><div><img src={img} alt={name}/></div><strong>{name}</strong></article>)}</div></section>
    <footer className="public-footer"><span>© 2026 Spondon Sharod Samman</span><a href="https://indianfestival.co.in/" target="_blank" rel="noreferrer">Digital Experience by Indian Festival AI &amp; Innovation Lab</a></footer>
  </main>;
}
