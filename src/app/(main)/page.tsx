import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Values } from "@/components/sections/Values";
import { Menu } from "@/components/sections/Menu";
import { PreLaunchCTA } from "@/components/sections/PreLaunchCTA";
import { Gallery } from "@/components/sections/Gallery";
import { Events } from "@/components/sections/Events";
import { Instagram } from "@/components/sections/Instagram";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Values />
      <Menu />
      <PreLaunchCTA />
      <Gallery />
      <Events />
      <Instagram />
    </>
  );
}
