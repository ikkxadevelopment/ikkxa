
import getBaseUrl from "@/hooks/getBaseUrl";
import qs from "qs";
const strapiFetch = async (slug, urlParamsObject, options, country) => {
      const baseUrl = getBaseUrl(country);
    const queryString = qs.stringify(urlParamsObject);
    // const res = await fetch(
    //     `${process.env.NEXT_PUBLIC_BASE_URL}${slug}${queryString ? `?${queryString}` : ""}`,
    //     { ...options }
    // );
    const res = await fetch(
        `${baseUrl}${slug}${queryString ? `?${queryString}` : ""}`,
        { ...options }
    );

    // console.log(`${process.env.NEXT_PUBLIC_BASE_URL}${slug}${queryString ? `?${queryString}` : ""}`,"link");

    if (!res.ok) {
        return undefined;
    }

    return res.json();
};

export default strapiFetch;

