"use client"

import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";
import { OTP_SENT } from "@/constants/apiRoutes";
import { useRecoilState } from "recoil";
import { loginIsOpen } from "@/recoil/atoms";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/routing";


export const useLoginWidget = ({ }) => {
    const router = useRouter();
    const session = useSession();
    const pathname=usePathname()
    const [isPhone, setIsPhone] = useState(true);
    const [isOpen, setIsOpen] =  useRecoilState(loginIsOpen);

    const [isOtpSent, setIsOtpSent] = useState(false);
    const [inValid, setInvalid] = useState(false);
    const [expired, setExpired] = useState(false);
    const lang = useLocale();
    const [locale, country] = lang.split('-');
    const baseUrl = country === "SA" ? process.env.NEXT_PUBLIC_API_BASE_URL_SA : process.env.NEXT_PUBLIC_API_BASE_URL_AE;
   
   
    const validationSchema = Yup.object().shape({
        // countryCode: Yup.string().required("Country code is required"),
        countryCode: Yup.string().when("isPhone", {
            is: true,
            then: Yup.string().required("Country code is required"),
          }),
        phoneNumber: Yup.string().when("isPhone", {
            is: true,
            then: Yup.string()
              .required("Phone number is required")
              .min(8, "Phone number must be at least 8 characters")
              .test('is-valid-phone', 'Phone number is not valid', (value) => {
                if (!value) return false;
                const phoneRegex = /^\+?[1-9]\d{1,14}$/; 
                return phoneRegex.test(value);
              }),
          }),
          email: Yup.string()
    .email("Invalid email")
    .when("isPhone", {
      is: false, // Only validate when isPhone is false
      then: Yup.string().required("Email is required"),
    }),
        // phoneNumber: Yup.string()
        // .required('Phone number is required')
        // .min(8, 'Phone number must be at least 8 characters')
        // .test('is-valid-phone', 'Phone number is not valid', (value) => {
        //   if (!value) return false;
        //   const phoneRegex = /^\+?[1-9]\d{1,14}$/; 
        //   return phoneRegex.test(value);
        // }),
        otp: Yup.string().when('isOtpSent', {
            is: true,
            then: Yup.string().required("OTP is required").min(6, "OTP must be 6 digits")
        }),
    });

    const sendOtp = async (values, setSubmitting) => {
        try {
           
            const payload = isPhone
        ? { country_code: values.countryCode, phone: values.phoneNumber }
        : { email: values.email };


            const response = await axios.post(`${baseUrl}${OTP_SENT}`, payload);

          
            // && response.data.resend_count>0

            if (response.data.success === true ) {
                setIsOtpSent(true);
                
            } else if(response.data.resend_count===0) {
                setExpired(true)
            } else {
                alert('Error sending OTP');
            }
            setSubmitting(false);
        } catch (error) {
            console.error('Error:', error);
            
            setSubmitting(false);
            alert('Error sending OTP');
        }
    };

    const handleSubmit = async (values) => {
   
        let payload = {};
        const guestToken = localStorage.getItem("guestToken");
        const isQuestToken = guestToken ?? null
       
    if (isPhone) {
        // Phone OTP
        if (!values.phoneNumber) {
            alert("Phone and country code are required for phone OTP.");
            return;
        }
        payload = { country_code: values.countryCode, phone: values.phoneNumber, otp: values.otp, trx_id: isQuestToken};
    } else {
        // Email OTP
        if (!values.email) {
            alert("Email is required for email OTP.");
            return;
        }
        payload = { email: values.email, otp: values.otp, trx_id: isQuestToken };
    }

  

        try {
            const result = await signIn('credentials', {
                redirect: false,
                // country_code: values.countryCode,
                // phone: "+966111111111",
                // phone: values.phoneNumber,
                // otp: values.otp,
                ...payload,
            });

            if (result.error) {
                setInvalid(true);
            } else {
                console.log('successs during sign-in:', result);
                if(isQuestToken){
                    localStorage.removeItem("guestToken");
                }
                // window.location.href = '/chat'
                // router.push('/');
                console.log(pathname, pathname.includes("cart"),"in cart page");
                if(pathname.includes("cart")){
                    console.log("in cart page");
                } else {
                    // router.push('/');
                }
            }
        } catch (error) {
            console.error('Error during sign-in:', error);
            alert('Error during sign-in');
        }
    };

    return {
        sendOtp,
        handleSubmit,
        signOut,
        isOtpSent,
        isOpen, setIsOpen,
        session,
        validationSchema,
        inValid, 
        setIsPhone,
        isPhone,
        setIsOtpSent,
        expired
    };
};
