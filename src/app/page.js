import HeroBanner from "@/components/HeroBanner";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import PlatformStats from "@/components/PlatformStats";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <HeroBanner />
      <HowItWorks />
      <PlatformStats />
      <Footer/>
    </div>
  );
}
