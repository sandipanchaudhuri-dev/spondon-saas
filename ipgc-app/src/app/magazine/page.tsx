import type { Metadata } from "next";
import Link from "next/link";
import { GroupFooter, GroupNav } from "../group-site";
import { magazineIssues, EditorialCredits } from "./issues";
import "./magazine.css";

export const metadata: Metadata = { title: "INCLUSÉA Magazine | IPGC", description: "The fashion and lifestyle magazine of IPGC. Explore Issue I — Debut Shoot." };

export default function Page() {
  return <div className="group-site inclusea-site">
    <GroupNav active="/magazine" />
    <main>
      <section className="inclusea-masthead">
        <span className="group-kicker">An IPGC publication</span>
        <h1>INCLUSÉA<sup>®</sup></h1>
        <p className="inclusea-masthead-label">Fashion &amp; Lifestyle Magazine</p>
      </section>
      <section className="inclusea-library" aria-label="Magazine issues">
        {magazineIssues.map(issue => <article className="inclusea-edition" key={issue.slug}>
          <Link href={`/magazine/${issue.slug}`} className="inclusea-cover" aria-label={`Read ${issue.number}: ${issue.title}`}>
            <img src={issue.pages[0].src} alt={issue.pages[0].alt} width={1086} height={1448} fetchPriority="high" />
          </Link>
          <div className="inclusea-edition-copy">
            <span className="group-kicker">{issue.number} · {issue.pages.length} pages</span>
            <h2>{issue.title}</h2>
            <p className="inclusea-description">{issue.description}</p>
            <EditorialCredits issue={issue}/>
            <Link className="group-button" href={`/magazine/${issue.slug}`}>Read the issue</Link>
          </div>
        </article>)}
      </section>
      <section className="group-enquiry">
        <div><span className="group-kicker">Editorial &amp; partnerships</span><h2>Connect with INCLUSÉA</h2><p>Editorial contributions, photography, advertising and collaborations.</p></div>
        <a className="group-button" href="mailto:magazine@ipgc.in">Email the editorial team</a>
      </section>
    </main>
    <GroupFooter />
  </div>;
}
