"use client"
import { OFFER_CATEGORIES_SLIDER, BANNER_SLIDER,CATEGORIES_SLIDER, PRODUCTS_SLIDER, OFFER_SLIDER, BUDGET_SLIDER, OFFER_BANNERS, CATEGORIES_SUB_SLIDER, OFFER_ENDING } from "@/constants/resources";
import BannerSlider from "@/widgets/BannerSlider";
import BudgetWidget from "@/widgets/BudgetWidget";
import CategoriesSlider from "@/widgets/CategoriesSlider";
import OfferBanner from "@/widgets/OfferBanner";
import OfferCategoriesSlider from "@/widgets/OfferCategoriesSlider";
import ProductsSlider from "@/widgets/ProductsSlider";
import DefaultComponent from "./DefaultComponent";
import OfferSlider from "@/widgets/OfferSlider";
import CategoriesSubSlider from "@/widgets/CategoriesSubSlider";


const setComponent = (widget) => {
  const components = {
    [OFFER_CATEGORIES_SLIDER]: OfferCategoriesSlider,
    [BANNER_SLIDER]: BannerSlider,
    [CATEGORIES_SLIDER]: CategoriesSlider,
    [CATEGORIES_SUB_SLIDER]: CategoriesSubSlider,
    [PRODUCTS_SLIDER]: ProductsSlider,
    [OFFER_ENDING]: ProductsSlider,
    [OFFER_SLIDER]: OfferBanner,
    [BUDGET_SLIDER]: BudgetWidget,
    [OFFER_BANNERS]:OfferSlider,
    default: DefaultComponent,
  };
  return components[widget.component_name] || components["default"];
};
const Block = ({
  widget,
  slug,
}) => {
  const Widget = setComponent(widget);
  return (
    <Widget
      data={widget}
      // {...widget}
      slug={slug}
    />
  );
};

export default Block;
