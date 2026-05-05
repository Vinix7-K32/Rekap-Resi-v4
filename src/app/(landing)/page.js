import LandingCTA from "@/components/landing/LandingCTA";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingHero from "@/components/landing/LandingHero";
import LandingHowItWorks from "@/components/landing/LandingHowItWorks";
import LandingMarketplaces from "@/components/landing/LandingMarketplaces";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingStats from "@/components/landing/LandingStats";
import LandingTestimonials from "@/components/landing/LandingTestimonials";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingStats />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingMarketplaces />
        <LandingTestimonials />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
