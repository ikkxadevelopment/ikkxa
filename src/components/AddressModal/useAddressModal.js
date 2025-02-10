// import { useState } from "react";

// export function useAddressModal(){
//     const [countries, setcCountries] = useState([]);
//     const [states, setSates] = useState([]);
//     const [cities, setCities] = useState([]);

//     return {
//         countries,
//         states,
//         cities
//     }
// }

import useSWR, { useSWRConfig } from "swr";
import axios from "axios";
import { axiosPostWithToken } from "@/lib/getHome";
import { ADD_ADDRESS, ALL_ADDRESSES, CITY_BY_STATE, COUNTRY_LIST, DEFAULT_ADDRESS, EDIT_ADDRESS, STATE_BY_COUNTRY } from "@/constants/apiRoutes";
import { useState } from "react";
import { useLocale } from "next-intl";

export function useAddressModal(countryId, stateId, setIsDefault, isDefault, id) {
  // const [isOpen, setIsOpen] = useState(true);
  const { mutate } = useSWRConfig();
  const lang = useLocale();
  const { data: countriesData, error: countriesError } = useSWR(`${COUNTRY_LIST}`);

  const { data: statesData, error: statesError } = useSWR(
    countryId ? `${STATE_BY_COUNTRY}/${countryId}` : null
  );

  const { data: citiesData, error: citiesError } = useSWR(
    stateId ? `${CITY_BY_STATE}/${stateId}` : null
  );
 

  const handleAddress = async (values, mode, setIsOpen) => {
    try {
      let result
      if(mode==="edit") {
        console.log("is edit");
        result = await axiosPostWithToken(`${ADD_ADDRESS}/${id}`, values, lang);
      } else {
        console.log("is add");
        result = await axiosPostWithToken(ADD_ADDRESS, values, lang);
      }
      if (result.success) {
        await mutate(`${ALL_ADDRESSES}`)
        setIsOpen(false)
      }
    } catch (error) {
      console.log(error);
    }
    // if(mode === 'add'){
    //   const result = await axiosPostWithToken(ADD_ADDRESS, values); 
    //   console.log("results of address",result);
    // } else {
    //   const result = await axiosPostWithToken(EDIT_ADDRESS, values); 
    //   console.log("results of address",result);
    // }

  };

  const defaultHandler = async () => {
    setIsDefault(true)
    try {
      const url = `${DEFAULT_ADDRESS}/${id}`
      const result = await axiosPostWithToken(url, null, lang);
      if (result.success) {
        await mutate(`${ALL_ADDRESSES}`)
        setIsDefault(true)
        setIsOpen(false)
      }
    } catch (error) {
      console.log(error);
      setIsDefault(false)
    }
  };

  return {
    countries: countriesData?.results?.countries || [],
    states: statesData?.results?.states || [],
    cities: citiesData?.results?.cities || [],
    countriesError,
    statesError,
    citiesError,
    handleAddress,
    // isOpen,
    // setIsOpen,
    defaultHandler
  };
}
