import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GroupFooter, GroupNav } from "../../group-site";
import { magazineIssues, EditorialCredits } from "../issues";
import "../magazine.css";

type IssueParams = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return magazineIssues.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: IssueParams): Promise<Metadata> {
  const { slug } = await params;
  const issue = magazineIssues.find(item => item.slug === slug);
  return issue ? { title: `${issue.number} — ${issue.title} | INCLUSÉA Magazine`, description: issue.description } : {};
}

export default async function IssuePage({ params }: IssueParams) {
  const { slug } = await params;
  const issue = magazineIssues.find(item => item.slug === slug);
  if (!issue) notFound();
  return <div className="group-site inclusea-site">
    <GroupNav active="/magazine" />
    <main className="inclusea-reader">
      <div className="inclusea-reader-intro">
        <Link className="group-textlink" href="/magazine">All issues</Link>
        <span className="group-kicker">INCLUSÉA Magazine · {issue.number}</span>
        <h1>{issue.title}</h1>
        <p>{issue.pages.length} pages · Digital edition</p>
      </div>
      <nav className="inclusea-page-nav" aria-label="Go to magazine page">
        {issue.pages.map((page, i) => <a key={page.src} href={`#page-${i + 1}`}>Page {i + 1}</a>)}
      </nav>
      <div className="inclusea-reader-pages">
        {issue.pages.map((page, i) => <figure id={`page-${i + 1}`} key={page.src} className="inclusea-reader-page">
          <img src={page.src} alt={page.alt} width={1086} height={1448} loading={i === 0 ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : "auto"} />
          <figcaption>Page {i + 1} of {issue.pages.length}</figcaption>
        </figure>)}
      </div>
      <div className="inclusea-reader-end">
        <h2>Editorial credits</h2>
        <EditorialCredits issue={issue}/>
        <Link className="group-button" href="/magazine">Back to magazine</Link>
      </div>
    </main>
    <GroupFooter />
  </div>;
}
