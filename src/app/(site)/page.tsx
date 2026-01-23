import Hero from "@/components/features/Hero";
import Process from "@/components/features/Process";
import FeaturedTours from "@/components/features/FeaturedTours";
import PopularDestinations from "@/components/features/PopularDestinations";
import WhyChooseUs from "@/components/features/WhyChooseUs";
import Stats from "@/components/features/Stats";
import Testimonials from "@/components/features/Testimonials";
import Newsletter from "@/components/features/Newsletter";
import CustomBookingCTA from "@/components/features/CustomBookingCTA";

export default function Home() {
  return (
    <div className="bg-background overflow-hidden selection:bg-primary/30 selection:text-white">
      <Hero />
      <Testimonials />

      {/* Divider or spacing could go here, but sections have their own padding */}

      <Process />
      <FeaturedTours />
      <PopularDestinations />
      <WhyChooseUs />
      <Stats />
      <CustomBookingCTA />
      <Newsletter />
    </div>
  );
}


