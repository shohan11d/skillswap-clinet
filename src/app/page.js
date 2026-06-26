import HeroBanner from "@/components/HeroBanner";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import PlatformStats from "@/components/PlatformStats";
import Image from "next/image";
import FeaturedTasks from "@/components/FeaturedTasks";
import TopFreelancers from "@/components/TopFreelancers";

export default function Home() {
  return (
    <div className="">
      <HeroBanner />
      <FeaturedTasks/>
      <TopFreelancers/>
      <HowItWorks />
      <PlatformStats />
      <Footer/>
    </div>
  );
}
