import { FILTER, FILTER_PRODUCTS } from "@/constants/apiRoutes";
import qs from "qs";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback, useDebounce } from "use-debounce";
import useSWRInfinite from "swr/infinite";
import { useLocale } from "next-intl";
// import { usePathname, useRouter } from "@/i18n/routing";
// import { useSearchParams } from "next/navigation";

// const fetcher = (url) => axios.get(url).then((res) => res.data);

const useProducts = ({ slug }) => {
  const pathname=usePathname()
  const lang = useLocale();
  const [locale, country] = lang.split('-');
  const isSearchPage = pathname?.includes("search")
  const isAllProducts = pathname?.includes("products")
  const router = useRouter();
  const [sliderValue, setSliderValue] = useState([0, 899]);
  const [filters, setFilters] = useState({
    ...(isSearchPage  ? { q: "" } : {  }),
    sort: "newest",
    minPrice: 0,
    maxPrice: 899,
    attribute_value_id: [],
    child_category:[],
    type:""
  });
  const [tempFilters, setTempFilters] = useState(filters);
  const [debouncedMinPrice] = useDebounce(filters.minPrice, 300);
  const [debouncedMaxPrice] = useDebounce(filters.maxPrice, 300);
  const searchParams = useSearchParams();
  const initialFilters = {
    ...(isSearchPage  ? { q: "" } : { }),
    sort: "newest",
    minPrice: 0,
    maxPrice: 899,
    attribute_value_id: [],
    child_category:[],
    type:""
  };

  const createQueryParams = (filters) => {
    const searchParams = new URLSearchParams();

    if (filters?.sort !== initialFilters.sort) {
      searchParams.set("sort", filters?.sort);
    }
    if (filters?.minPrice !== initialFilters.minPrice) {
      searchParams.set("priceMin", filters?.minPrice);
    }
    if (filters?.maxPrice !== initialFilters.maxPrice) {
      searchParams.set("priceMax", filters?.maxPrice);
    }
    if (filters?.q !=="" && isSearchPage) {
      searchParams.set("q", filters?.q);
    }
    if (filters?.attribute_value_id?.length > 0) {
      filters.attribute_value_id.forEach((id) => {
        searchParams.append("product_category", id);
      });
    }
    if (filters?.child_category?.length > 0) {
      filters.child_category.forEach((id) => {
        searchParams.append("sub_category", id);
      });
    }
    if (filters?.type) {
      searchParams.set("type", filters?.type);
    }


    return searchParams.toString();
  };

  useEffect(() => {
    const queryParams = createQueryParams(filters);
    router.push(`${window.location.pathname}?${queryParams}`, undefined, {
      shallow: true,
    });
  }, [filters, router]);

  const updateFiltersFromQuery = () => {
    const newFilters = { ...filters };
    const sort = searchParams.get("sort");
    const minPrice = searchParams.get("priceMin");
    const maxPrice = searchParams.get("priceMax");
    const attributeValues = searchParams.getAll("product_category");
    const childValues = searchParams.getAll("sub_category");
    const type = searchParams.get("type"); 
    const q=searchParams.getAll("q")
    if (sort) newFilters.sort = sort;
    if (minPrice && maxPrice) {
      newFilters.minPrice = parseInt(minPrice);
      newFilters.maxPrice = parseInt(maxPrice);
    }

    if (attributeValues?.length > 0) {
      newFilters.attribute_value_id = attributeValues.map((id) =>
        parseInt(id, 10)
      );
    } else {
      newFilters.attribute_value_id = [];
    }

    if (childValues?.length > 0) {
      newFilters.child_category = childValues.map((id) =>
        parseInt(id, 10)
      );
    } else {
      newFilters.child_category = [];
    }
    if(q){
      newFilters.q = q;
    }
    if (type) {  // Add this check
      newFilters.type = type;
    }


    setFilters(newFilters);
    setSliderValue([newFilters.minPrice, newFilters.maxPrice]);
  };

  useEffect(() => {
    updateFiltersFromQuery();
  }, [searchParams]);

  const handleClearAll = () => {
    setFilters({
      sort: "newest",
      minPrice: 0,
      maxPrice: 899,
      attribute_value_id: [],
      child_category: [],
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSortMobile = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      sort: value, // Directly updates the "sort" field with the selected value
    }));
  };

  // const handleAttributeChange = (attributeId) => {
  //   console.log(attributeId, "attributeId");
  //   setFilters((prevFilters) => {
  //     const updatedAttributes = prevFilters.attribute_value_id.includes(
  //       attributeId
  //     )
  //       ? prevFilters.attribute_value_id.filter((id) => id !== attributeId)
  //       : [...prevFilters.attribute_value_id, attributeId];
  //     return {
  //       ...prevFilters,
  //       attribute_value_id: updatedAttributes,
  //     };
  //   });
  // };

  const handleAttributeChange = (key, id) => {
    setFilters((prevFilters) => {
      const updatedValues = prevFilters[key].includes(id)
        ? prevFilters[key].filter((item) => item !== id)
        : [...prevFilters[key], id];
      return {
        ...prevFilters,
        [key]: updatedValues,
      };
    });
  };


  const handlePriceChange = useDebouncedCallback((value) => {
    if (value) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        minPrice: value[0],
        maxPrice: value[1],
        page: 1,
      }));
    }
  }, 300);

  const handleSliderChange = (value) => {
    setSliderValue(value);
    handlePriceChange(value);
  };
  const handleMobileFilterChange = (key, value) => {
    setTempFilters((prevFilters) => {
      const updatedAttributes = prevFilters[key].includes(value)
        ? prevFilters[key].filter((id) => id !== value)
        : [...prevFilters[key], value];
      return {
        ...prevFilters,
        [key]: updatedAttributes,
      };
    });
  };

  const isFilterChecked = (key, id) => {
    return filters[key]?.includes(id);
  };

  // Apply mobile filters
  // const applyMobileFilters = () => {
  //   setFilters(tempFilters);
  // };

  const applyMobileFilters = (minPrice, maxPrice) => {
    // setFilters((prevFilters) => ({
    //   ...tempFilters,
    //   minPrice: minPrice,
    //   maxPrice: maxPrice,
    // }));
    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters, 
        ...tempFilters, 
      };
  
      if (minPrice !== '' && minPrice != null) {
        updatedFilters.minPrice = minPrice;
      }
  
      if (maxPrice !== '' && maxPrice != null) {
        updatedFilters.maxPrice = maxPrice;
      }
  
      return updatedFilters;
    });
  };

  // const { data, error } = useSWR(`${FILTER_PRODUCTS}?${query}`);
  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData?.results?.products?.data?.length)
      return null;
    const query = qs.stringify(
      {
        ...(isSearchPage  ? { key: String(filters.q) } : { slug }),
        sort: filters.sort,
        paginate: 24,
        page: pageIndex + 1,
        price: `{"min":${debouncedMinPrice},"max":${debouncedMaxPrice}}`,
        attribute_value_id: filters.attribute_value_id,
        child_category: filters.child_category,
        type: filters.type,
        route: isSearchPage||isAllProducts ? "all.products" :"product.by.category",
      },
      { encodeValuesOnly: true, arrayFomat: "brackets" }
    );
    return `${FILTER_PRODUCTS}?${query}&lang=${locale}`;
  };

  const { data, error, size, setSize, isValidating } = useSWRInfinite(getKey);
  const isLoadingMore =
  isValidating &&
  data &&
  typeof data[size - 1] === "undefined";

  const allProducts = data
    ? data.flatMap((page) => page?.results?.products?.data || [])
    : [];

  const loadMore = () => {
    setSize(size + 1);
  };

  return {
    products: data,
    allProducts,
    handleFilterChange,
    sliderValue,
    handleSliderChange,
    handleAttributeChange,
    handleMobileFilterChange,
    applyMobileFilters,
    handleClearAll,
    isFilterChecked,
    handlePriceChange,
    handleSortMobile,
    setSliderValue,
    filters,
    loadMore,
    isLoadingMore,
    isLoadingProducts: !error && !data,
    isError: error,
    isSearchPage,
    isAllProducts
  };
};

export default useProducts;
