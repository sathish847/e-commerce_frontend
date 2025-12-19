import { Fragment, useState, useEffect } from "react";
import axios from "axios";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import CategoryFourSlider from "../../wrappers/category/CategoryFourSlider";

import TabProductFive from "../../wrappers/product/TabProductFive";
import CustomHeroSlider from "../../wrappers/hero-slider/CustomHeroSlider";

import BannerNineteen from "../../wrappers/banner/BannerNineteen";
import TabProductGeneric from "../../wrappers/product/TabProductGeneric";
import TabProductSkeleton from "../../components/product/TabProductSkeleton";
import HeroSliderFourteen from "../../wrappers/hero-slider/HeroSliderFourteen";

const HomeHandmade = () => {
  const [tabs, setTabs] = useState([]);
  const [tabsLoading, setTabsLoading] = useState(true);

  const tabConfig = {
    cups: { title: "Mugs & Cushions Collections", category: "mugs-cushions", limit: 8 },
    chocolates: { title: "Chocolate Collections", category: "chocolates", limit: 8 },
    flowers: { title: "Flower Collections", category: "flower", limit: 8 },
    cakes: { title: "Cake Collections", category: "cakes", limit: 8 }
  };

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        setTabsLoading(true);
        const response = await axios.get(`https://e-commerce-4-bsqw.onrender.com/api/public/tabs`);
        if (response.data.success) {
          const activeTabs = response.data.data
            .filter(tab => tab.status)
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map(tab => {
              const config = tabConfig[tab.name];
              return {
                ...tab,
                title: config ? config.title : tab.name.charAt(0).toUpperCase() + tab.name.slice(1) + " Collections",
                category: config ? config.category : tab.name,
                limit: config ? config.limit : 8
              };
            });
          setTabs(activeTabs);
        }
      } catch (error) {
        console.error('Error fetching tabs:', error);
      } finally {
        setTabsLoading(false);
      }
    };
    fetchTabs();
  }, []);

  return (
    <Fragment>
      <SEO
        titleTemplate="E-commerce"
        description="E-commerce"
      />
      <LayoutOne headerTop="visible">
        <HeroSliderFourteen />
        {/* hero slider */}
        <CustomHeroSlider />
        {/* category */}
        <CategoryFourSlider spaceTopClass="pt-0" spaceBottomClass="pb-30" />

         {/* new products */}
                <TabProductFive
                  spaceTopClass="pt-10"
                  spaceBottomClass="pb-70"
                  category="organic food"
                />

          {/* banner */}
                 <BannerNineteen spaceTopClass="pt-0" spaceBottomClass="pb-80" /> 

          {/* dynamic tab products */}
          {tabsLoading ? (
            // Show skeleton for expected number of tabs (assuming 4 based on tabConfig)
            Array.from({ length: 4 }, (_, index) => (
              <Fragment key={`skeleton-${index}`}>
                <TabProductSkeleton
                  spaceTopClass="pt-10"
                  spaceBottomClass="pb-70"
                  productCount={index === 2 || index === 3 ? 4 : 8} // flowers and cakes have limit 4
                />
              </Fragment>
            ))
          ) : (
            tabs.map((tab, index) => (
              <Fragment key={tab._id}>
                <TabProductGeneric
                  title={tab.title}
                  category={tab.category}
                  limit={tab.limit}
                  spaceTopClass="pt-10"
                  spaceBottomClass="pb-70"
                />
              </Fragment>
            ))
          )}

        
       
      </LayoutOne>
    </Fragment>
  );
};

export default HomeHandmade;
