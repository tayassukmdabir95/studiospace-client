
import HeroSlider from "@/components/home/HeroSlider";
import FeaturedStudios from "@/components/home/FeaturedStudios";
import StudioCategories from "@/components/home/StudioCategories";
import HowItWorks from "@/components/home/HowItWorks";
import CreatorSupport from "@/components/home/CreatorSupport";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <FeaturedStudios />
      <StudioCategories />
      <HowItWorks />
      <CreatorSupport />
    </>
  );
}
