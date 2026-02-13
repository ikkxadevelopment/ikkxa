import getBaseUrl from "@/hooks/getBaseUrl";
import axios from "axios";
import { getSession, session } from "next-auth/react";
import nookies from 'nookies';

const BaseURL = process.env.NEXT_PUBLIC_BASE_URL

// const fetcher = async url => {
//     const res = await fetch(url)



//     // If the status code is not in the range 200-299,
//     // we still try to parse and throw it.
//     if (!res.ok) {
//       const error = new Error('An error occurred while fetching the data.')
//       // Attach extra info to the error object.
//       error.info = await res.json()
//       error.status = res.status
//       throw error
//     }

//     return res.json()
//   }

const fetcher = url => axios.get(url).then(res => res.data);

const fetcherWithToken = async (url, options = {}) => {
    // const { token } = options;
    const cookies = nookies.get(null);
    const locale = cookies['NEXT_LOCALE'];
    const country = locale.split('-')[1]

    const BaseURL = country === "SA" ? process.env.NEXT_PUBLIC_API_BASE_URL_SA : process.env.NEXT_PUBLIC_API_BASE_URL_AE;
    const session = await getSession();
    if (!session || !session.accessToken) {
        const res = await axios.get(`${BaseURL}${url}`);
        return res.data; // SWR will skip fetching data when this is returned
    }
    const token = session.accessToken;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
        const res = await axios.get(`${BaseURL}${url}`, { headers });
        return res.data;
    } catch (error) {
        console.error('Fetcher error:', error);
        throw error;
    }
};

const apiFetcher = async (url, data = null, options, country) => {
    const BaseURL = getBaseUrl(country);
    const method = options?.method?.toLowerCase();
    const headers = options?.headers;

    try {
        const res = await axios[method](`${BaseURL}${url}`, data !== null ? data : {}, { headers });
        return res.data;
    } catch (err) {
        console.error("Error in POST request:", err);
        return err.response.data;
    }
};

const deleteFetcher = async (url, options = {}, data = null, country) => {
    try {
        const BaseURL = getBaseUrl(country);
        const { token } = options;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.post(`${BaseURL}${url}`, data !== null ? data : {}, { headers });
        return res.data;
    } catch (err) {
        console.error("Error in POST request:", err);
        return err.response.data;
    }
};

// const updateFetcher = async (url, data = null, options = {}) => {
//     try {
//         const { token } = options;
//         const headers = token ? { Authorization: `Bearer ${token}` } : {};

//         const config = {
//             headers,
//             ...(data && { data }) // Only add `data` if it exists
//           };

//         const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}${url}`, config);
//         return res.data;
//     } catch (err) {
//         console.error("Error in POST request:", err);
//         return err.response.data;
//     }
// };

export default fetcher
export { apiFetcher, fetcherWithToken, deleteFetcher }