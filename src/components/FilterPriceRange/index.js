"use client";
import { useEffect, useState } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import "./slider.css";
import { useTranslations } from "next-intl";

export default function FilterPriceRange({
  filter,
  handleFilterChange,
  setSliderValue,
  handlePriceChange,
  sliderValue
}) {
  const t = useTranslations("Index");

  return (
    <div className="border-b  py-3 pe-4">
      <h2 className="text-base font-semibold mb-4">Price</h2>
      <div className="">
        {filter !== undefined && (
          <RangeSlider
            id="range-slider"
            className="range-slider"
            thumbClassName="range-slider-thumb"
            trackClassName="range-slider-track"
            activeTrackClassName="range-slider-track"
            min={0}
            max={799}
            onInput={handlePriceChange}
            value={sliderValue}
            defaultValue={sliderValue}
          />
        )}
        <div className="flex justify-between mt-4">
          <input
            type="number"
            name="minPrice"
            min={0}
            className="px-2.5 py-1.5 border border-neutral-300  text-neutral-700 text-xs font-medium w-[70px] text-center"
            value={sliderValue[0]}
            onChange={(e) => {
              const newValue = Math.min(Number(e.target.value), sliderValue[1]); // Ensure min <= max
              setSliderValue([newValue, sliderValue[1]]);
              handlePriceChange([newValue, sliderValue[1]]);
            }}
            placeholder={t('MinPrice')}
          />
          <input
            type="number"
            name="maxPrice"
            min={0}
             className="px-2.5 py-1.5 border border-neutral-300  text-neutral-700 text-xs font-medium w-[70px] text-center"
            value={sliderValue[1]}
            onChange={(e) => {
              const newValue = Math.max(Number(e.target.value), sliderValue[0]); // Ensure max >= min
              setSliderValue([sliderValue[0], newValue]);
              handlePriceChange([sliderValue[0], newValue]);
            }}
            placeholder={t("MaxPrice")}
          />
        </div>
  
      </div>
    </div>
  );
}
