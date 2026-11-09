/** IPGC Shyama Samman 2026 Top 15.
 * Names and publication set: final 7 Nov announcement (Jubak Brinda replaces Rajarhat Netaji Sangha).
 * Attributes: ipgc.registrations, production snapshot 8 Nov 2026.
 * Gallery assets are fetched at request time using a single server-side RPC; not embedded here.
 * No contact data, email addresses or private storage paths are published.
 * Public eligibility is enforced by the database gallery function and the private image proxy.
 */
export type Finalist = {
  slug: string; name: string; registration: string; area: string; address: string;
  established: number | null; theme: string | null; artist: string | null;
  idolArtist: string | null; maps: string | null;
};
export const finalists: readonly Finalist[] = [
{slug:"amra-kajan",name:"Amra Kajan",registration:"IPGC-SS-2026-00076",area:"Ramkrishna Upanibesh",address:"B-Block, Ramkrishna Upanibesh, Kolkata 700092 (landmark: Krishna Glass Factory)",established:1976,theme:"RUPKOLPO",artist:"SUDARSHAN HALDAR",idolArtist:"AVIJIT GHATAK",maps:null},
{slug:"amra-milan-tirtha",name:"Amra Milan Tirtha",registration:"IPGC-SS-2026-00057",area:"Behala",address:"259 Roy Bahadur Road Kolkata 700053",established:1997,theme:"MATRIPOT",artist:"Saurav Ghosh & Tapan Mondal",idolArtist:"Jayanta Dey",maps:"https://maps.app.goo.gl/LwjxsRb1G6GxR2dt7"},
{slug:"bapujinagar-krirangan",name:"Bapujinagar Krirangan Cultural Society",registration:"IPGC-SS-2026-00051",area:"Bapujinagar / Jadavpur",address:"Bapujinagar Krirangan, Bapujinagar, Kolkata 700092",established:2015,theme:"Arpan",artist:"Riju Kar",idolArtist:"Tapan Majhi",maps:null},
{slug:"barisha-santi-sangha",name:"Barisha Santi Sangha",registration:"IPGC-SS-2026-00033",area:"Behala",address:"BEHALA, Kolkata",established:null,theme:null,artist:null,idolArtist:null,maps:null},
{slug:"bijoygarh-6-pally",name:"Bijoygarh 6 Pally",registration:"IPGC-SS-2026-00040",area:"Jadavpur",address:"JADAVPUR, Kolkata",established:null,theme:null,artist:null,idolArtist:null,maps:null},
{slug:"girish-park-5-star",name:"Girish Park 5 Star Club",registration:"IPGC-SS-2026-00028",area:"Girish Park",address:"GIRISH PARK, Kolkata",established:null,theme:null,artist:null,idolArtist:null,maps:null},
{slug:"haowa-shokal",name:"Haowa Shokal",registration:"IPGC-SS-2026-00024",area:"Dunlop",address:"DUNLOP, Kolkata",established:null,theme:null,artist:null,idolArtist:null,maps:null},
{slug:"jubak-brinda",name:"Jubak Brinda",registration:"IPGC-SS-2026-00021",area:"Jadavpur",address:"JADAVPUR, Kolkata",established:null,theme:null,artist:null,idolArtist:null,maps:null},
{slug:"labony-sporting-club",name:"Labony Sporting Club",registration:"IPGC-SS-2026-00058",area:"Salt Lake",address:"LABONY ESTATE, 5, 1st Cross Rd, Block-J2, EB Block, Sector 1, Bidhannagar, Kolkata, West Bengal 700064",established:1975,theme:"Sabeki",artist:"Uttam Khanra",idolArtist:"Mohanbanshi Rudra Pal (Tapan Rudra Pal)",maps:"https://share.google/GchPcOQP7cfyl8Mvt"},
{slug:"narayantala-yubak-sangha",name:"Narayantala Yubak Sangha",registration:"IPGC-SS-2026-00046",area:"Baguiati",address:"NARAYANTALA EAST, COLLEGE MORE BUS STOP, BAGUIATI, P.O ASWININAGAR, KOLKATA 700159",established:1954,theme:"AKASH PRODIP",artist:"DIPANJAN DEY",idolArtist:"KRISHANU PAUL",maps:"https://maps.app.goo.gl/AkD27kQ7KmNFu6739"},
{slug:"sree-colony-mainak",name:"Sree Colony Mainak Club",registration:"IPGC-SS-2026-00052",area:"Regent Estate / Sree Colony",address:"167 REGENT ESTATE, KOLKATA 700092",established:1967,theme:"LOUKIK",artist:"SOMNATH TAMLI",idolArtist:"ABHIJIT GHATAK",maps:null},
{slug:"sree-colony-samaj-sangha",name:"Sree Colony Samaj Sangha",registration:"IPGC-SS-2026-00047",area:"Sree Colony / Regent Estate",address:"2/157 Sree Colony, Kolkata 700092",established:1960,theme:"CHHED",artist:"SUSHOVAN ROY",idolArtist:"DIPEN MONDOL",maps:null},
{slug:"sukantanagar-sporting",name:"Sukantanagar Sporting Club",registration:"IPGC-SS-2026-00027",area:"Sukantanagar",address:"SUKANTANAGAR, Kolkata",established:null,theme:null,artist:null,idolArtist:null,maps:null},
{slug:"tollygunge-avijatri",name:"Tollygunge Avijatri",registration:"IPGC-SS-2026-00019",area:"Tollygunge",address:"TOLLYGUNGE, Kolkata",established:null,theme:null,artist:null,idolArtist:null,maps:null},
{slug:"tribhuvan-club",name:"Tribhuvan Club",registration:"IPGC-SS-2026-00026",area:"Behala",address:"BEHALA, Kolkata",established:null,theme:null,artist:null,idolArtist:null,maps:null}
];
export const mapHref = (f:Finalist) => f.maps && /^https:\/\/(maps\.app\.goo\.gl|www\.google\.com\/maps|share\.google)\//.test(f.maps)
 ? f.maps : "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(f.address);

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
