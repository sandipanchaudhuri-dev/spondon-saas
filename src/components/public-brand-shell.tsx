import Link from "next/link";

export function PublicHeader({home=false}:{home?:boolean}){
  return <header className="public-header">
    <Link className="brand-lockup" href="/"><img src="/spondon-sharod-somman-2026.png" alt="Spondon"/><span><strong>Spondon</strong><small>Sharod Samman 2026</small></span></Link>
    <div className="header-actions"><div className="aiffa-member"><span>Affiliated by</span><img src="/aiffa.jpg" alt="AIFFA"/></div>{home?<Link className="button header-cta" href="/register">Register Your Pujo</Link>:<Link className="button header-cta" href="/">Back home</Link>}</div>
  </header>;
}

export function PublicFooter(){
  return <footer className="public-footer"><span>© 2026 Spondon Sharod Samman</span><a href="https://indianfestival.co.in/" target="_blank" rel="noreferrer">Digital Experience by Indian Festival AI &amp; Innovation Lab</a></footer>;
}
