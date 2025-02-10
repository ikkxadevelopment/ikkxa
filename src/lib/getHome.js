import {
  FILTER,
  HOME,
  SINGLE_PRODUCT,
  ADD_CART,
  DELETE_CART,
  GET_CART,
  UPDATE_CART,
  ADD_WISHLIST,
  GLOBAL,
  CATEGORIES,
  CMS,
  FOOTER_DATA,
  STORE_DATA,
  SITE_MAP,
  META_DATA,
  MENU_DATA,
} from "@/constants/apiRoutes";
import getBaseUrl from "@/hooks/getBaseUrl";
import { deleteFetcher, apiFetcher } from "@/utils/fetcher";
import strapiFetch from "@/utils/strapiFetch";
import axios from "axios";
import { getSession } from "next-auth/react";

const options = {
  method: "GET",
  // headers: {
  //     accept: 'application/json',
  //     Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
  // },
  next: {
    revalidate: 0,
    cache: "no-store",
  },
};

const getPostOptions = (method, token = null) => {
  const options = {
    method: method, //['POST' or 'PUT' or 'GET' or 'DELETE' ]
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Only add the Authorization header if the token is provided
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  return options;
};

const getDaleteOptions = (token = null) => {
  const options = {
    method: "DLETE",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  // Only add the Authorization header if the token is provided
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  return options;
};

// export async function getCategories(lang, country) {
//   const baseUrl = country === "SA" ? process.env.NEXT_PUBLIC_API_BASE_URL_SA : process.env.NEXT_PUBLIC_API_BASE_URL_AE;
//   const url = `${HOME}lang=${lang}`;
//   const urlParamsObject = {
//     page: 3,
//   };
//   const data = await strapiFetch(url, urlParamsObject, options, country);
//   return data;
// }

export async function getHomeProducts(lang, country) {

  const url = `${HOME}lang=${lang}`;
  const urlParamsObject = null;
  const data = await strapiFetch(url, urlParamsObject, options, country);
  return data;
}

export async function getGlobal(lang, country) {
  // const baseUrl = country === "SA" ? process.env.NEXT_PUBLIC_API_BASE_URL_SA : process.env.NEXT_PUBLIC_API_BASE_URL_AE;
  const url = `${GLOBAL}${lang}`;
  const urlParamsObject = null;
  const data = await strapiFetch(url, urlParamsObject, options, country);
  return data;
}

export async function getStoreDetail(lang, country) {
  // const baseUrl = country === "SA" ? process.env.NEXT_PUBLIC_API_BASE_URL_SA : process.env.NEXT_PUBLIC_API_BASE_URL_AE;
  const url = `${STORE_DATA}${lang}`;
  
  const urlParamsObject = null;
  const data = await strapiFetch(url, urlParamsObject, options, country);
  return data;
}


export async function getSitemap(lang, country) {
  // const baseUrl = country === "SA" ? process.env.NEXT_PUBLIC_API_BASE_URL_SA : process.env.NEXT_PUBLIC_API_BASE_URL_AE;
  const url = `${SITE_MAP}${lang}`;
  
  const urlParamsObject = null;
  const data = await strapiFetch(url, urlParamsObject, options, country);
  return data;
}



export async function getAllCategories(lang, country) {
  // const baseUrl = country === "SA" ? process.env.NEXT_PUBLIC_API_BASE_URL_SA : process.env.NEXT_PUBLIC_API_BASE_URL_AE;
  const url = `${CATEGORIES}${lang}`;
  const urlParamsObject = null;
  const data = await strapiFetch(url, urlParamsObject, options, country);
  return data;
}
export async function getCms(slug,lang, country) {
  // const baseUrl = country === "SA" ? process.env.NEXT_PUBLIC_API_BASE_URL_SA : process.env.NEXT_PUBLIC_API_BASE_URL_AE;
  const url = `${CMS}/${slug}?lang=${lang}`;
  const urlParamsObject = null;
  const data = await strapiFetch(url, urlParamsObject, options, country);
  return data;
}

export async function getFooter(lang, country) {
  // const baseUrl = country === "SA" ? process.env.NEXT_PUBLIC_API_BASE_URL_SA : process.env.NEXT_PUBLIC_API_BASE_URL_AE;
  const url = `${FOOTER_DATA}?lang=${lang}`;
  const urlParamsObject = null;
  const data = await strapiFetch(url, urlParamsObject, options, country);
  return data;
}

export async function getMenuData(lang, country) {
  // const baseUrl = country === "SA" ? process.env.NEXT_PUBLIC_API_BASE_URL_SA : process.env.NEXT_PUBLIC_API_BASE_URL_AE;
  const url = `${MENU_DATA}?lang=${lang}`;
  const urlParamsObject = null;
  const data = await strapiFetch(url, urlParamsObject, options, country);
  return data;
}


export async function getMetaData(url) {
  // const baseUrl = country === "SA" ? process.env.NEXT_PUBLIC_API_BASE_URL_SA : process.env.NEXT_PUBLIC_API_BASE_URL_AE;
  const slug = `${META_DATA}${url}`;
  const urlParamsObject = null;
  const data = await strapiFetch(slug, urlParamsObject, options);
  return data;
}

// export async function getFilter(slug, country) {
//   const baseUrl = country === "SA" ? process.env.NEXT_PUBLIC_API_BASE_URL_SA : process.env.NEXT_PUBLIC_API_BASE_URL_AE;
//   const url = `${FILTER}?slug=${slug}`;
//   const urlParamsObject = {};
//   const data = await strapiFetch(url, urlParamsObject, options, country);
//   if (data.status === "fulfilled") {
//     const result = data.result;
//     console.log(result);
//     return result;
//     // Do something with result
//   } else {
//     console.error("Error:");
//   }
// }

export async function getSingleProduct(slug, lang, country) {
  // const baseUrl = country === "SA" ? process.env.NEXT_PUBLIC_API_BASE_URL_SA : process.env.NEXT_PUBLIC_API_BASE_URL_AE;
  const url = `${SINGLE_PRODUCT}/${slug}?lang=${lang}`;
  const urlParamsObject = null;
  const data = await strapiFetch(url, urlParamsObject, options, country);
  return data;
}


// export async function addCartItem(id, quantity, token) {
//   const formData = {
//     product_id: id,
//     quantity: quantity,
//     token: true,
//   };

//   const url = `${ADD_CART}`;
//   const postOptions = getPostOptions("POST", token); // Token is needed
//   const data = await apiFetcher(url, formData, postOptions, country='SA');
//   return data;
// }

export async function removeCartItem(id, token, trx_id, country) {
  const formData = {
    "trx_id": trx_id
  }
  const url = `${DELETE_CART}/${id}`;
  const data = await deleteFetcher(url, { token: token }, formData, country);
  return data;
}

export async function updateCartItemQty(id, formData, token, country) {
  const url = `${UPDATE_CART}/${id}`;
  const postOptions = getPostOptions("POST", token); // Token is needed
  const data = await apiFetcher(url, formData, postOptions, country);
  return data;
}

// export async function getCart(token) {

//     const url = `${GET_CART}`;
//     const postOptions = getPostOptions("GET", token); // Token is needed
//     const data = await apiFetcher(url, null, postOptions);
//     return data;
// }

// export async function addToWishlist(id, token) {
//   const url = `${ADD_WISHLIST}/${id}`;

//   const postOptions = getPostOptions("GET", token); // Token is needed
//   const data = await apiFetcher(url, null, postOptions, 'SA');
//   return data;
// }

export const axiosPostWithToken = async (url, data, lang) => {
  try {
    const session = await getSession();
    const token = session?.accessToken;
    const [locale, country] = lang.split('-');
    const baseUrl = getBaseUrl(country);
      
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in Authorization header
        "Content-Type": "application/json", // Set content type
      },
    };

    const response = await axios.post(
      `${baseUrl}${url}`,
      data,
      config
    );

    return response.data;
  } catch (error) {
    console.error("Error making POST request:", error);
    throw error;
  }
};

export const axiosPostBlob = async (url, data, lang) => {
  try {
    const session = await getSession();

    const token = session?.accessToken;
    const [locale, country] = lang.split('-');
    const baseUrl = getBaseUrl(country);
    const config = {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`, // Include token in Authorization header
        "Content-Type": "application/json", // Set content type
      },
    };

    const response = await axios.post(
      `${baseUrl}${url}`,
      data,
      config
    );

    return response.data;
  } catch (error) {
    console.error("Error making POST request:", error);
    throw error;
  }
};


// export const axiosDeleteWithToken = async (url, lang) => {
//   try {
//     const session = await getSession();

//     const token = session?.accessToken;
//     const [locale, country] = lang.split('-');
//     const baseUrl = country === "SA" ? process.env.NEXT_PUBLIC_API_BASE_URL_SA : process.env.NEXT_PUBLIC_API_BASE_URL_AE;

//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`, // Include token in Authorization header
//         "Content-Type": "application/json", // Set content type
//       },
//     };

//     const response = await axios.delete(
//       `${process.env.NEXT_PUBLIC_BASE_URL}${url}`,
//       config
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Error making POST request:", error);
//     throw error;
//   }
// };
