export type Language = "tr" | "en";
const sections: Record<string, { id: string; tr: string; en: string }> = {
  home: { id: "tob", tr: "#tob", en: "#tob" },
  services: { id: "hizmetler", tr: "#hizmetler", en: "#services" },
  projects: { id: "work", tr: "#projeler", en: "#projects" },
  contact: { id: "iletisim", tr: "#iletisim", en: "#contact" },
  about: { id: "hakkimizda", tr: "#hakkimizda", en: "#about" },
};
export function sectionFromHash(hash: string) {
  if (hash === "#top") return sections.home;
  return Object.values(sections).find((s) => hash === s.tr || hash === s.en || hash === `#${s.id}`);
}
export function localizeHash(hash: string, language: Language) {
  return sectionFromHash(hash)?.[language] ?? hash;
}
export function languageFromHash(hash: string): Language | undefined {
  const section = sectionFromHash(hash);
  if (!section || section.tr === section.en) return;
  return hash === section.en ? "en" : hash === section.tr ? "tr" : undefined;
}
export function syncLanguageHash(language: Language) {
  const hash = localizeHash(location.hash, language);
  if (hash !== location.hash) history.replaceState(null, "", `${location.pathname}${location.search}${hash}`);
  window.dispatchEvent(new Event("tob:navigate"));
}
