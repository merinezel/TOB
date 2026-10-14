// The message under the wordmark, and the scroll cue pinned to the bottom of the hero.
export function HeroCopy() {
  return (
    <div id="hakkimizda" data-hero-copy className="tob-copy absolute inset-x-0 z-20 px-5 text-center">
      <div data-enter className="tob-enter">
        <p data-hero-slogan aria-hidden className="mx-auto max-w-[16ch] font-ui text-[26px] font-bold leading-[1.08] tracking-[-0.035em] text-ink sm:max-w-none sm:text-[clamp(28px,calc(2.5*var(--u)),46px)]">
          Küçük işletmeler için
          <br />
          büyük marka fikirleri.
        </p>
        <p data-hero-services className="mt-[20px] flex flex-wrap items-center justify-center gap-x-3 font-ui text-[15px] font-normal text-ink sm:gap-x-[0.9em] sm:text-[clamp(15px,calc(1.12*var(--u)),21px)]">
          {["Brand", "Web", "Social", "Marketing"].map((s, i) => (
            <span key={s} className="flex items-center gap-x-3 sm:gap-x-[0.9em]">
              {i > 0 && <span aria-hidden className="text-ink/40">·</span>}
              {s}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

export function ScrollIndicator() {
  return (
    <div data-hero-scroll className="absolute inset-x-0 bottom-[max(20px,calc(1svh+14px))] z-20 flex justify-center">
      <div data-enter className="tob-enter flex flex-col items-center gap-2 font-ui text-[13px] font-medium text-ink">
        Scroll
        <span aria-hidden className="tob-scroll-line block h-8 w-px bg-ink/70" />
      </div>
    </div>
  );
}
