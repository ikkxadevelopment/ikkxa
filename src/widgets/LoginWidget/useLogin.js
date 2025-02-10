"use client"

import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";
import { OTP_SENT } from "@/constants/apiRoutes";
import { useLocale } from "next-intl";
import getBaseUrl from "@/hooks/getBaseUrl";


export const useLogin = ({ }) => {
    const router = useRouter();
    const session = useSession();
    const lang = useLocale();
    const [locale, country] = lang.split("-");



    const [isOtpSent, setIsOtpSent] = useState(false);
    const [inValid, setInvalid] = useState(false);
    const [expired, setExpired] = useState(false);

   

    const validationSchema = Yup.object().shape({
        countryCode: Yup.string().required("Country code is required"),
        phoneNumber: Yup.string()
        .required('Phone number is required')
        .min(8, 'Phone number must be at least 8 characters')
        .test('is-valid-phone', 'Phone number is not valid', (value) => {
          if (!value) return false;
          const phoneRegex = /^\+?[1-9]\d{1,14}$/; 
          return phoneRegex.test(value);
        }),
        otp: Yup.string().when('isOtpSent', {
            is: true,
            then: Yup.string().required("OTP is required").min(6, "OTP must be 6 digits")
        }),
    });

    const sendOtp = async (values) => {
        try {
            const baseUrl = getBaseUrl(country)
            const response = await axios.post(`${baseUrl}${OTP_SENT}`, {
                country_code: values.countryCode,
                phone_number: values.phoneNumber,
            });

            if (response.data.status === "ok" && response.data.resend_count>0) {
                setIsOtpSent(true);
            } else if(response.data.resend_count===0) {
                setExpired(true)
            } else {
                alert('Error sending OTP');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error sending OTP');
        }
    };

    const handleSubmit = async (values) => {
        try {
            const result = await signIn('credentials', {
                redirect: false,
                country_code: values.countryCode,
                phone_number: values.phoneNumber,
                otp: values.otp,
            });

            if (result.error) {
                setInvalid(true);
            } else {
                console.log('successs during sign-in:', result.data);
                // window.location.href = '/chat'
                router.push('/chat');
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
        session,
        validationSchema,
        inValid, 
        setIsOtpSent,
        expired
    };
};
