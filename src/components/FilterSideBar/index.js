"use client";
import { useTranslations } from "next-intl";
import FilterCheckBox from "../FilterCheckBox";
import FilterPriceRange from "../FilterPriceRange";
import FilterSubcategoryCheckBox from "../FilterSubcategoryCheckBox";

export default function FilterSideBar({ data,setSliderValue, catId,isFilterChecked,sliderValue, handleFilterChange,handleAttributeChange, filters, handlePriceChange }) {
  const t = useTranslations("Index");
  return (
    <div className="">
      <h2 className="text-md font-semibold">{t('FILTERS')}</h2>
      <FilterPriceRange setSliderValue={setSliderValue} sliderValue={sliderValue} filter={filters}  handleFilterChange={handleFilterChange} handlePriceChange={handlePriceChange} />
      
      {data?.results?.categories?.map((item, i) => {
        return <FilterSubcategoryCheckBox key={i} data={item} isFilterChecked={isFilterChecked} handleAttributeChange={handleAttributeChange}/>;
      })}


      {data?.results?.attributes?.map((item, i) => {
        return <FilterCheckBox key={i} data={item} isFilterChecked={isFilterChecked} handleAttributeChange={handleAttributeChange}/>;
      })}
    </div>
  );
}
