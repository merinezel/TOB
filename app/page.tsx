"use client";
import { useLanguage } from "@/components/LanguageProvider";
import TobHero from "@/components/hero/TobHero";
import BrandName from "@/components/hero/BrandName";
import { projects, services, servicesEn, site } from "@/data/site";

// Desktop (xl) values are the reference's 1536px grid expressed in vw.
const pads = ["xl:!pl-[2.34vw]", "xl:!pl-[3.9vw]", "xl:!pl-[3.78vw]", "xl:!pl-[3.9vw]"];

export default function Home() {
  const en = useLanguage().language === "en";
  const displayedServices = en ? servicesEn : services;
  return (
    <main>
      <TobHero>
      <section className="tobs-stage relative overflow-hidden bg-cream">
        <section id="slider" data-brand-stage className="brand-stage" aria-label="The Other Brands">
          <h2 data-brand-destination className="brand-destination" aria-label="the other brands"><BrandName /></h2>
        </section>
        <div className="content-bands">
        {/* SERVICES — four editorial columns, hairlines above and below. Hover swap kept. */}
        <div id="hizmetler" className="mx-5 mt-0 border-y border-ink/20 xl:mx-[2.3vw] xl:mt-0 xl:h-[11.9vw]">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[361fr_372fr_378fr_358fr]">
            {displayedServices.map((s, i) => (
              <div
                key={s.no}
                className={`fade-in group relative block border-t border-ink/20 py-6 pr-12 first:border-t-0 sm:pl-5 sm:[&:nth-child(-n+2)]:border-t-0 sm:odd:border-l-0 sm:odd:pl-0 sm:even:border-l xl:!border-l-0 xl:!border-t-0 xl:mt-[1.1vw] xl:h-[8.9vw] xl:py-0 xl:pr-[1vw] xl:before:absolute xl:before:left-0 xl:before:top-0 xl:before:h-full xl:before:w-px xl:before:bg-ink/25 ${pads[i]}`}
                style={{ animationDelay: `${1.05 + i * 0.12}s` }}
              >
                <p className="flex items-center text-[13px] font-medium xl:-mt-[0.2vw] xl:text-[clamp(12px,0.85vw,15px)]">
                  <span className="mr-0 inline-block h-2 w-0 rounded-full bg-tobs transition-all duration-500 group-hover:mr-2 group-hover:w-2" />
                  {s.no}
                </p>
                <h2 className="relative mt-1 overflow-hidden py-[0.05em] text-[28px] leading-none xl:mt-0 xl:text-[clamp(24px,1.95vw,36px)]">
                  <span className="block font-ui font-bold tracking-[-0.035em] transition-transform duration-700 ease-[cubic-bezier(.19,1,.22,1)] group-hover:-translate-y-[115%]">
                    {s.title}
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-[0.05em] block translate-y-[115%] font-editorial font-medium italic text-tobs transition-transform duration-700 ease-[cubic-bezier(.19,1,.22,1)] group-hover:translate-y-0"
                  >
                    {s.title}
                  </span>
                </h2>
                <p className="mt-2 max-w-[280px] text-[15px] leading-[1.4] text-ink/85 xl:mt-[0.1vw] xl:max-w-[17vw] xl:text-[clamp(14px,1.04vw,18px)]">
                  {s.text.split("|").map((l, k) => (
                    <span key={k}>
                      {k > 0 && <br className="hidden xl:block" />}
                      {k > 0 && <span className="xl:hidden"> </span>}
                      {l}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>


        {/* PROJECTS — Ethem Dede and the other brands follow the service row. */}
        <div id="work" className="mx-5 mt-10 pb-10 xl:mx-[2.3vw] xl:mt-[1.9vw] xl:pb-[2.1vw]">
          <div className="grid gap-8 xl:grid-cols-[26.3vw_1fr] xl:gap-0">
          <div id="hakkimizda" className="fade-in relative xl:flex xl:flex-col xl:justify-center xl:pb-[3.75vw] xl:pr-[2vw]" style={{ animationDelay: "1.5s" }}>
            <h2 className="mt-4 text-[38px] font-medium leading-[1] tracking-[-0.03em] xl:ml-[2.7vw] xl:mt-0 xl:text-[clamp(30px,2.85vw,50px)]">
              {en ? "Different " : "Farklı "}<em className="font-editorial text-[1.08em] font-medium italic tracking-[-0.01em]">{en ? "worlds," : "dünyalar,"}</em>
              <br />
              {en ? "one approach." : "aynı yaklaşım."}
            </h2>
            <p className="mt-3 max-w-[340px] text-[15px] leading-[1.4] text-ink/85 xl:ml-[2.7vw] xl:mt-[0.5vw] xl:text-[clamp(14px,1.04vw,18px)]">
              {en ? "We share the same creative perspective" : "Farklı sektörlerdeki markalarımızla,"}<br className="hidden xl:block" /> {en ? "with brands across different industries." : "aynı yaratıcı bakış açısını paylaşıyoruz."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6 xl:gap-[2.4vw]">
            {projects.map((p, i) => {
              const inner = (
                <>
                  <span className="relative block aspect-[4/3] overflow-hidden bg-ink/5">
                    {/* supplied asset, imagery only */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ objectPosition: p.focus }}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.025]"
                    />
                  </span>
                  <span className="mt-3 flex items-end justify-between gap-4 xl:mt-[0.9vw]">
                    <span className="project-name font-editorial text-[clamp(38px,3vw,58px)] font-medium leading-[0.95] tracking-[-0.035em]">{p.name}</span>
                    <svg
                      aria-hidden
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      className={`mb-[0.35em] w-5 shrink-0 transition-transform duration-500 xl:w-[1.25vw] ${p.href ? "group-hover:-translate-y-0.5 group-hover:translate-x-0.5" : "opacity-30"}`}
                    >
                      <path d="M2 14L14 2M5 2h9v9" />
                    </svg>
                  </span>
                </>
              );
              const cls = "fade-in group block";
              const style = { animationDelay: `${1.6 + i * 0.12}s` };
              return p.href ? (
                <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>
                  {inner}
                </a>
              ) : (
                <div key={p.name} className={cls} style={style} aria-label={`${p.name} — ${en ? "website coming soon" : "site yakında"}`}>
                  {inner}
                </div>
              );
            })}
          </div>
          </div>
        </div>

        </div>

        {/* CONTACT — one clear call to action, opens mail */}
        <div
          id="iletisim"
          className="mx-5 flex flex-col items-center gap-5 border-t border-ink/20 py-8 text-center sm:flex-row sm:text-left sm:items-center sm:justify-between xl:mx-[2.3vw] xl:py-[1.6vw]"
        >
          <p className="text-[13px] text-ink/60 xl:text-[clamp(12px,0.85vw,15px)]">{en ? "Brand & digital agency for small businesses" : "KOBİ’ler ve küçük işletmeler için marka & dijital ajans"}</p>
          <a
            href={`mailto:${site.email}?subject=${encodeURIComponent(en ? "Let’s grow our brand" : "Markamızı büyütelim")}`}
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-tobs px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.06em] text-cream transition hover:bg-ink xl:px-[2vw] xl:py-[0.95vw] xl:text-[clamp(12px,0.85vw,15px)]"
          >
            {en ? "Let’s grow your brand" : "Markanızı büyütelim"}
            <svg aria-hidden viewBox="0 0 32 12" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-6 transition-transform duration-500 group-hover:translate-x-1">
              <path d="M0 6h30M25 1l5 5-5 5" />
            </svg>
          </a>
          <p className="text-[12px] text-ink/50">© {new Date().getFullYear()} We Are TOB.</p>
        </div>
      </section>
      </TobHero>
    </main>
  );
}
