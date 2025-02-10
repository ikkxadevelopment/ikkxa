import useSWR, { mutate } from 'swr';
import { useSession } from 'next-auth/react';
import fetcher, { fetcherWithToken } from '@/utils/fetcher';

const useSWRFetcher = (url, token) => {

    const session = useSession();
    const authToken = session?.data?.accessToken
        const { data, error , isLoading} = useSWR(
            authToken ? `${url}` : null,
            (url) => fetcherWithToken(url, { token: authToken })
        );
 
        return { data, error, mutate, isLoading };

};

export default useSWRFetcher;
