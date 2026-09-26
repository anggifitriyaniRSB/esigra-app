import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Platform from "@/components/Platform";
import Workflow from "@/components/Workflow";
import ProductShowcase from "@/components/ProductShowcase";
import Safety from "@/components/Safety";
import Evidence from "@/components/Evidence";
import Pilot from "@/components/Pilot";
import Metrics from "@/components/Metrics";
import Ecosystem from "@/components/Ecosystem";
import Roadmap from "@/components/Roadmap";
import Team from "@/components/Team";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-forest focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-ivory"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Problem />
        <Platform />
        <Workflow />
        <ProductShowcase />
        <Safety />
        <Evidence />
        <Pilot />
        <Metrics />
        <Ecosystem />
        <Roadmap />
        <Team />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
