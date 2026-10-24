import { HomeHero } from "../components/home/HomeHero";
import { HomeCollections } from "../components/home/HomeCollections";
import { HomeFeaturedPlants } from "../components/home/HomeFeaturedPlants";
import { HomePlantCare } from "../components/home/HomePlantCare";

export function HomePage() {
  return (
    <div className="home-page">
      <HomeHero />
      <HomeCollections />
      <HomeFeaturedPlants />
      <HomePlantCare />
    </div>
  );
}
