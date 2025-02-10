
import { useLayoutEffect, useRef, useState } from "react";
import * as Yup from 'yup';
import useGetDeviceType from "@/hooks/useGetDeviceType";
// import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";

export const useEnquireForm = (style) => {
  const { isDesktop, width } = useGetDeviceType();
  const strapiUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = process.env.NEXT_PUBLIC_API_KEY;
  // const [recaptchaToken, setRecaptchaToken] = useState(null);
  // const { executeRecaptcha } = useGoogleReCaptcha()
  const contactUs = async (values, actions) => {
    if (!executeRecaptcha) {
      console.log('Please complete the reCAPTCHA');
      return;
    }
    // const gRecaptchaToken = await executeRecaptcha('inquirySubmit')

    // const response = await axios({
    //   method: "post",
    //   url: "/api/recaptchaSubmit",
    //   data: {
    //     gRecaptchaToken,
    //   },
    //   headers: {
    //     Accept: "application/json, text/plain, */*",
    //     "Content-Type": "application/json",
    //   },
    // });

    if (response?.data?.success === true) {
      console.log(`Success with score: ${response?.data?.score}`);
      try {
        const res = await fetch(`${strapiUrl}/api/messages`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ data: values }),
        });

        try {
          const res1 = await fetch(`/api/contact`, {
            method: 'POST',
            body: JSON.stringify({ ...values }),
          });
          console.log("res", await res1.json());
          if (res1.status) {
            handleSubmit(values, actions);
          }
        } catch (error) {
          console.log(error || 'failed to fetch');
        }
        console.log("res", await res.json());
        if (res.status) {
          handleSubmit(values, actions);
        }
      } catch (error) {
        console.log(error || 'failed to fetch');
      }
    } else {
      console.log(`Failure with score: ${response?.data?.score}`);
    }



  }

  const main = useRef(null);

  const [hasSubmitted, setHasSubmitted] = useState(false)

  //enquiry form

  const initialValues = {
    name: '',
    email: '',
    // type: '',
    phone: '',
    message: '',
  };
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').max(30, 'Name must be at most 30 characters'),
    email: Yup.string().email('Invalid email').required('Email is required').max(50, 'Invalid email'),
    phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required('Phone number  is required').max(13, 'Phone number is not valid'),
    // type: Yup.string().required('Type is required'),
    message: Yup.string().required('Message is required').max(200),
  });

  const handleSubmit = (values, { resetForm }) => {
    setHasSubmitted(true)
    resetForm();
    setTimeout(() => {
      setHasSubmitted(false)
    }, 5000);
  };


  return {
    main,
    initialValues,
    validationSchema,
    handleSubmit,
    hasSubmitted,
    // setRecaptchaToken,
    contactUs,
    width
  };
};
