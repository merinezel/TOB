// The message under the wordmark, and the scroll cue pinned to the bottom of the hero.
export function HeroCopy() {
  return (
    <div id="hakkimizda" data-hero-copy className="tob-copy absolute inset-x-0 z-20 px-5 text-center">
      <div data-enter className="tob-enter">
        <p aria-hidden className="mx-auto max-w-[16ch] font-ui text-[26px] font-bold leading-[1.08] tracking-[-0.035em] text-ink sm:max-w-none sm:text-[clamp(28px,2.5vw,46px)]">
          Küçük işletmeler için
          <br />
          büyük marka fikirleri.
        </p>
        <p className="mt-5 flex flex-wrap items-center justify-center gap-x-3 font-ui text-[15px] font-medium text-ink sm:gap-x-[0.9em] sm:text-[clamp(15px,1.2vw,21px)]">
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
    <div data-hero-scroll className="absolute inset-x-0 bottom-[max(20px,3.2svh)] z-20 flex justify-center">
      <div data-enter className="tob-enter flex flex-col items-center gap-2 font-ui text-[13px] font-medium text-ink">
        Scroll
        <span aria-hidden className="tob-scroll-line block h-11 w-px bg-ink/70" />
      </div>
    </div>
  );
}
