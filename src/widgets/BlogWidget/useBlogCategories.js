import useSWR, { useSWRConfig} from 'swr';
import { BLOG_CATEGORY } from '@/constants/apiRoutes';
import { useLocale } from 'next-intl';
import { useState } from 'react';

const useBlogCategories = () => {
  const lang = useLocale();
  const [locale, country] = lang.split('-');
  const [blogCategories, setBlogCategories] = useState([])
  
  const url = BLOG_CATEGORY
  const { data, error } = useSWR(url, {
    onSuccess: (data) => {
      if (data) {
        const blogCategoriesResult = data?.results?.categories?.data
    console.log("blogCategories",blogCategoriesResult);

        setBlogCategories(blogCategoriesResult)
      }
    },
  });

  return {
    blogCategories, 
    setBlogCategories,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useBlogCategories;