import useSWR, { useSWRConfig} from 'swr';
import { FILTER } from '@/constants/apiRoutes';
import { useLocale } from 'next-intl';

const useCategories = ({slug}) => {
  const lang = useLocale();
  const [locale, country] = lang.split('-');
  const { data, error } = useSWR(`${FILTER}?slug=${slug}&lang=${locale}`);

  return {
    categories: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useCategories;