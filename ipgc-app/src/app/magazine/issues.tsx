export const magazineIssues = [
  {
    slug: "issue-1",
    number: "Issue I",
    title: "Debut Shoot",
    description: "The debut fashion editorial of INCLUSÉA, featuring an exclusive wardrobe by Santanu Guha Thakurta — Kolkatanama.",
    wardrobe: "Santanu Guha Thakurta — Kolkatanama",
    models: ["Aditi Sarkar", "Aheli Nath", "Simran Chatterjee"],
    makeup: "Rashida Sultana",
    pages: [
      { src: "/brand/inclusea/issue-1/page-01.jpg", alt: "INCLUSÉA Issue I cover, Debut Shoot — full-length group portrait on a tree-lined path" },
      { src: "/brand/inclusea/issue-1/page-02.jpg", alt: "INCLUSÉA Issue I, page 2 — a second full-length group portrait in the garden" },
      { src: "/brand/inclusea/issue-1/page-03.jpg", alt: "INCLUSÉA Issue I, page 3 — a closer group portrait against green foliage" },
    ],
  },
];

export function EditorialCredits({ issue }: { issue: typeof magazineIssues[number] }) {
  return <dl className="inclusea-credits">
    <div><dt>Exclusive wardrobe</dt><dd>{issue.wardrobe}</dd></div>
    <div><dt>Models</dt><dd>{issue.models.join(" · ")}</dd></div>
    <div><dt>Makeup</dt><dd>{issue.makeup}</dd></div>
  </dl>;
}
