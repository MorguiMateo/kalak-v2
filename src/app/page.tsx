import { Guarda } from "@/components/brand/Guarda";
import { Benefits } from "@/components/home/Benefits";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";
import { Hero } from "@/components/home/Hero";
import { Ingredients } from "@/components/home/Ingredients";
import { Statement } from "@/components/home/Statement";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Guarda />
      <Statement />
      <Benefits />
      <Ingredients />
      <Faq />
      <FinalCta />
    </>
  );
}
