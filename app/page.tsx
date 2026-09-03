import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFFDF9] text-[#4A2A1B]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#fff7df,transparent_45%),linear-gradient(180deg,#fffdf9,#fff7e8)] px-6 py-14 sm:px-10 lg:px-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#A06A1B]">Spondon Sharod Samman 2026</p>
            <h1 className="font-serif text-5xl font-bold leading-tight sm:text-6xl">Honouring the Spirit of Durga Puja</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#6D5549]">
              A celebration of creativity, culture and community — bringing together pujo committees, artists, partners and people.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <Image src="/spondon-hero.png" alt="Spondon Sharod Samman" width={720} height={720} className="h-auto w-full max-w-xl object-contain" priority />
          </div>
        </div>
      </section>

      {/* About */}
      <section className="px-6 py-16 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-4xl font-bold">About Spondon</h2>
          <p className="mt-6 text-lg leading-8 text-[#6D5549]">
            Spondon Sharod Samman celebrates the passion, imagination and collective effort behind Durga Puja. The platform recognises excellence while connecting communities, creators and supporters around the festival.
          </p>
        </div>
      </section>

      {/* Brand Ambassadors */}
      <section className="bg-white px-6 py-16 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-serif text-4xl font-bold">Brand Ambassadors</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AmbassadorCard name="Mou Baidya" image="/images/ambassadors/mou-baidya.jpg" />
            <AmbassadorCard name="Anwesha Ghosh" image="/images/ambassadors/anwesha-ghosh.jpg" />
            <AmbassadorCard name="Sudipa Sarkar" image="/images/ambassadors/sudipa-sarkar.jpg" />
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="bg-[#FFF7DD] px-6 py-16 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-serif text-4xl font-bold">Partners</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <PartnerCard label="Associate Partner" name="Bong Series" image="/images/bong-series.jpg" />
            <PartnerCard label="Powered By" name="পাঁচফোড়ন" image="/panchforon.jpg" />
            <PartnerCard label="Wardrobe Partner" name="Minu Fashions" image="/minu-fashions.jpg" />
            <PartnerCard label="Associate Partner" name="Panache Production Pvt Ltd" image="/panache.jpg" />
            <PartnerCard label="Media Partner" name="Bong Series" image="/images/bong-series.jpg" />
            <PartnerCard label="Media Partner" name="Saradin Bangla" image="/saradin-bangla.png" />
          </div>
        </div>
      </section>

      <footer className="bg-[#3A2115] px-6 py-8 text-center text-sm text-white/90">
        <p>© 2026 Spondon Sharod Samman</p>
        <p className="mt-3 text-[#F3C85B]">Digital Experience by Indian Festival AI &amp; Innovation Lab</p>
      </footer>
    </main>
  );
}

function AmbassadorCard({ name, image }: { name: string; image: string }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-[#E8DDD5] bg-[#FFFDFB] shadow-sm">
      <Image src={image} alt={name} width={900} height={900} className="aspect-square w-full object-cover" />
      <div className="p-5 text-center">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="mt-1 text-sm text-[#8A6D60]">AIFFA Brand Ambassador</p>
      </div>
    </article>
  );
}

function PartnerCard({ label, name, image }: { label: string; name: string; image: string }) {
  return (
    <article className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-[#E8DDD5] bg-white p-6 text-center shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#A06A1B]">{label}</p>
      <Image src={image} alt={name} width={420} height={220} className="mt-5 h-32 w-full object-contain" />
      <h3 className="mt-4 text-lg font-semibold text-[#6D5549]">{name}</h3>
    </article>
  );
}
