/** Stable public URLs for the approved Top 15.
 * All registered attributes are fetched from the live IPGC database.
 */
export type Finalist = Readonly<{slug:string;registration:string}>;
export const finalists:readonly Finalist[]=[
 {slug:"amra-kajan",registration:"IPGC-SS-2026-00076"},
 {slug:"amra-milan-tirtha",registration:"IPGC-SS-2026-00057"},
 {slug:"bapujinagar-krirangan",registration:"IPGC-SS-2026-00051"},
 {slug:"barisha-santi-sangha",registration:"IPGC-SS-2026-00033"},
 {slug:"bijoygarh-6-pally",registration:"IPGC-SS-2026-00040"},
 {slug:"girish-park-5-star",registration:"IPGC-SS-2026-00028"},
 {slug:"haowa-shokal",registration:"IPGC-SS-2026-00024"},
 {slug:"jubak-brinda",registration:"IPGC-SS-2026-00021"},
 {slug:"labony-sporting-club",registration:"IPGC-SS-2026-00058"},
 {slug:"narayantala-yubak-sangha",registration:"IPGC-SS-2026-00046"},
 {slug:"sree-colony-mainak",registration:"IPGC-SS-2026-00052"},
 {slug:"sree-colony-samaj-sangha",registration:"IPGC-SS-2026-00047"},
 {slug:"sukantanagar-sporting",registration:"IPGC-SS-2026-00027"},
 {slug:"tollygunge-avijatri",registration:"IPGC-SS-2026-00019"},
 {slug:"tribhuvan-club",registration:"IPGC-SS-2026-00026"},
];
/** Approved 2026 award labels, keyed to the canonical Top 15 profile slugs. */
export const finalistAwards: Readonly<Record<string,string>> = {
  "haowa-shokal": "শহরের সেরা ৫",
  "tribhuvan-club": "শহরের সেরা ৫",
  "barisha-santi-sangha": "শহরের সেরা ৫",
  "sree-colony-mainak": "শহরের সেরা ৫",
  "tollygunge-avijatri": "শহরের সেরা ৫",
  "bijoygarh-6-pally": "সেরা আলোক সজ্জা",
  "narayantala-yubak-sangha": "সেরা প্রতিমা",
  "sukantanagar-sporting": "সেরা মণ্ডপ সজ্জা",
  "bapujinagar-krirangan": "Indian Festival Discovery",
  "amra-milan-tirtha": "IPGC Discovery",
  "jubak-brinda": "IPGC Discovery",
  "labony-sporting-club": "IPGC President's Honour",
};
