"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import FilterSideBar from "@/components/FilterSideBar";
import useCategories from "./useCategories";
import useProducts from "./useProducts";
import CategoryInnerSlider from "./CategoryInnerSlider";
import { BsSliders, BsSortDown } from "react-icons/bs";
import {} from "react-icons/bs";
import MobileFilter from "./MobileFiter";
import useGetDeviceType from "@/hooks/useGetDeviceType";
import { ProductSkeleton } from "./ProductSkeleton";
import { CategorySkeleton } from "./CategorySkeleton";
import { MobileSort } from "./MobileSort";
import NoData from "./NoData";
import { useTranslations } from "next-intl";
import LoadMoreComponent from "./LoadMoreComponent";
import { Link } from "@/i18n/routing";
import { useEffect } from "react";
import { isComponentPresentState } from "@/recoil/atoms";
import { useRecoilState } from "recoil";
import useHeaderSecond from "@/hooks/useHeaderSecond";

export default function Products({ slug }) {
  const t = useTranslations("Index");
  const { categories, isLoading, isError } = useCategories({ slug });
  const { width } = useGetDeviceType();
  const {
    products,
    filters,
    allProducts,
    handleFilterChange,
    handleAttributeChange,
    loadMore,
    isLoadingMore,
    sliderValue,
    handleSliderChange,
    isLoadingProducts,
    handleMobileFilterChange,
    applyMobileFilters,
    isFilterChecked,
    handleClearAll,
    setSliderValue,
    handleSortMobile,
    isSearchPage,
    isAllProducts
  } = useProducts({ slug });
  const subCategory = categories?.results?.categories.find(
    (item) => item?.slug === slug
  );
  const searchTerm = filters?.q;

  const isLastData =
    products &&
    products[products?.length - 1]?.results?.products?.has_more_data;
  const nodata =
    products && products[products?.length - 1]?.results?.products?.total;

    useHeaderSecond()
    

  return (
    <section className=" pb-[60px]">
      <div className="container">
        <Breadcrumb className="mb-2 lg:mb-8 hidden lg:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{t('Home')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {products&&products[0]?.results?.parent!==null?
            <>
                <BreadcrumbItem>
            <Link href={`/categories/${products[0]?.results?.parent}`}>{products[0]?.results?.parent}</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            </>
            :""}

            <BreadcrumbItem>
              <BreadcrumbPage>
              {products&&products[0]?.results?.title}
              
              {/* {slug} */}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex">
          <div className="flex-col-auto lg:w-[260px] border-e hidden lg:block">
            {isLoading ? `${('Loading')}` : ""}
            {width >= 992 && (
              <FilterSideBar
                catId={products?.page?.id}
                filters={filters}
                data={categories}
                handleAttributeChange={handleAttributeChange}
                handlePriceChange={handleSliderChange}
                setSliderValue={setSliderValue}
                sliderValue={sliderValue}
                isFilterChecked={isFilterChecked}
              />
            )}
          </div>
          <div className="flex-col-auto w-full lg:w-[calc(100%-260px)]">
            {isLoading && !isSearchPage ? <CategorySkeleton /> : ""}
            {!isSearchPage && (
              <CategoryInnerSlider data={subCategory} slug={slug} />
            )}
            {/* products?.results?.page?.categories */}
            <div className="flex justify-between mb-4 border-b lg:px-4 py-3">
              <div className="">
                {isSearchPage ? (
                  <h2 className="text-sm lg:text-xl font-semibold">
                    {products&&products[0]?.results?.products?.total} {t('resultsFor')} {searchTerm}
                  </h2>
                ) : isAllProducts?
                <h2 className="text-sm lg:text-xl font-semibold">

{t('AllProducts')}
                  </h2>
                  :(
                  <h2 className="text-sm lg:text-xl font-semibold">

{products&&products[0]?.results?.title}
                    {/* {slug}  */}
                    {products?.products?.total}
                  </h2>
                )}
              </div>
              <div className="fixed bg-white bottom-0 left-0 w-full z-50 border-b py-1">
                {width < 992 && (
                  <div className="grid lg:hidden grid-cols-2">
                    <div>
                      <MobileFilter
                        data={categories}
                        handleMobileFilterChange={handleMobileFilterChange}
                        applyMobileFilters={applyMobileFilters}
                        isFilterChecked={isFilterChecked}
                        handleClearAll={handleClearAll}
                      />
                    </div>
                    <div>
                      <div>
                        <MobileSort
                          filters={filters}
                          handleSortMobile={handleSortMobile}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="hidden lg:block">
                <select
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="newest">{t('Newest')}</option>
                  <option value="oldest">{t('Oldest')}</option>
                  <option value="top_selling">{t('Topselling')}</option>
                  <option value="low_to_high">{t('Price')}: {t('LowtoHigh')}</option>
                  <option value="high_to_low">{t('Price')}: {t('HighToLow')}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-2 lg:gap-4 lg:px-4">
              {allProducts?.map((product, index) => {
                return (
                  <div className="" key={`${product?.id}${index}`}>
                    <ProductCard data={product} />
                  </div>
                );
              })}
            </div>
            {(isLoadingProducts || isLoadingMore) && <ProductSkeleton />}
            {nodata === 0 ? <NoData/>: ""}
            <LoadMoreComponent isLastData={isLastData} loadMore={loadMore} isLoadingMore={isLoadingMore}/>
            {/* {isLastData === true && (
              <div className="text-center mt-3">
                <button
                  className="btn btn-outline-secondary"
                  onClick={loadMore}
                >
                  {isLoadingMore ? `${('Loading')}` : `${('LoadMore')}`}
                </button>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </section>
  );
}
