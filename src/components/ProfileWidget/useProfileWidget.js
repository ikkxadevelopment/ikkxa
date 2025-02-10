"use client";

import { UPDATE_PROFILE } from "@/constants/apiRoutes";
import useGetDeviceType from "@/hooks/useGetDeviceType";
import { axiosPostWithToken } from "@/lib/getHome";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useSWRConfig } from "swr";
import * as Yup from "yup";

export const useProfileWidget = ({data}) => {    
    const t = useTranslations('Index')
    const { mutate } = useSWRConfig();
    const lang = useLocale();
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const { width } = useGetDeviceType();
  
    // Form validation schema
    const validationSchema = Yup.object({
      first_name: Yup.string().required(`${t('FirstNameIsRequired')}`),
      last_name: Yup.string().required(`${t('LastNameIsRequired')}`),
      gender: Yup.string().required(`${t('GenderIsRequired')}`),
      date_of_birth: Yup.date()
        .nullable()
        .test(
          "is-valid-date",
          "Invalid Date of Birth",
          (value) => value === null || value instanceof Date // Allow null or valid date objects
        )
        .required(`${t('DateOfBirthIsRequired')}`),
    });
  
    // Formik initial values
    const initialValues = {
      first_name: data?.data?.first_name || "",
      last_name: data?.data?.last_name || "",
      gender: data?.data?.gender || "",
      date_of_birth:
        data?.data?.date_of_birth === "0000-00-00"
          ? null
          : data?.data?.date_of_birth,
    };
  
    // Handle form submission
    const handleFormSubmit = async (values) => {
      setLoading(true);
      const data = {
        first_name: values.first_name,
        last_name: values.last_name,
        gender: values.gender,
        date_of_birth: values.date_of_birth,
      };
  
      try {
        const result = await axiosPostWithToken(UPDATE_PROFILE, data, lang); 
        setResponse(result); 
        mutate(`${PROFILE_DETAILS}`);
      } catch (error) {
        console.error("Error updating profile:", error);
      } finally {
        setLoading(false); // Stop loading state
      }
    };

    return {
        validationSchema,
        initialValues,
        handleFormSubmit,
        loading
    }
}