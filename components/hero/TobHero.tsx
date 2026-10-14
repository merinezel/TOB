import type { ReactNode } from "react";
import ReferenceHero from "./ReferenceHero";

export default function TobHero({ children }: { children: ReactNode }) {
  return <ReferenceHero>{children}</ReferenceHero>;
}
