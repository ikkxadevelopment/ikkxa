"use client"

import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { useState } from "react";
import { EMAIL_PHONE_OTP, PROFILE_DETAILS, UPDATE_EMAIL_PHONE } from "@/constants/apiRoutes";
import { axiosPostWithToken } from "@/lib/getHome";
import { mutate } from "swr";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useFormik } from "formik";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "next-intl";

export const useProfileOtpModal = ({data}) => {
    const router = useRouter();
    const { toast } = useToast()
    const session = useSession();
    const lang = useLocale();
    const [isPhone, setIsPhone] = useState(true);
    const [isOpen, setIsOpen] =  useState(false);

    const [isOtpSent, setIsOtpSent] = useState(false);
    const [inValid, setInvalid] = useState(false);
    const [expired, setExpired] = useState(false);
    const [otpValue, setOtpValue] = useState("");

    const [phoneValue, setPhoneValue] = useState(data?.data?.phone || "");
    const [emailValue, setEmailValue] = useState(data?.data?.email)
    const [accountInfo, setAccountInfo] = useState({
        "country_code": "",
        "phone": "",
        "email": "",
        "otp":""
    })

    const formatPhoneNumber = (phone) => {
        const trimmedPhone = (phone ?? '').trim();
        if(!trimmedPhone){
            return ''
        } 
        if (!trimmedPhone.startsWith("+")) {
          return `+${trimmedPhone}`;
        }
        return trimmedPhone;
    }

    const formik = useFormik({
        initialValues: {
          phone: formatPhoneNumber(data?.data?.phone) || '',
          email: data?.data?.email || '',
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
          phone: Yup.string()
            .required("Phone number is required")
            .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
          email: Yup.string()
            .email("Invalid email format")
            .required("Email address is required"),
        }),
        onSubmit: (values,{setSubmitting}) => {
          setSubmitting(true)
          sendOtp(); 
        },
    });

    const handlePhoneChange = (value, field) => {
        if(field === "phone"){
            setPhoneValue(value);
            formik.setFieldValue('phone', value);
            
            if (value) {
                const phoneNumberObj = parsePhoneNumberFromString(value);
                if (phoneNumberObj) {
                    setAccountInfo(prevState => ({
                        ...prevState,
                        country_code: `+${phoneNumberObj.countryCallingCode}`,
                        phone: phoneNumberObj.nationalNumber
                    }));
                }
            }
        } else {
            formik.setFieldValue('email', value)
            setEmailValue(value)
            setAccountInfo(prevState => ({
                ...prevState,
                email: value
            }));
        }        
    }

    const handleApiError = (error, field) => {
        console.error("Error Response:", error.response?.data?.data);
      
        if (!field) {
          console.error("Error: 'field' is undefined.");
          return;
        }
      
        const apiErrorMessage = error.response?.data?.message
          ? { [field]: error?.response?.data?.message }
          : { [field]: "Something went wrong. Please try again." };
      
        formik.setErrors(apiErrorMessage);
      };

    const sendOtp = async () => {
        const payload = accountInfo?.country_code && accountInfo?.phone 
        ? { country_code: accountInfo?.country_code, phone: accountInfo?.phone }
        : { email: accountInfo?.email };

        try {
            const response = await axiosPostWithToken(EMAIL_PHONE_OTP, payload, lang)
            if (response.success === true ) {
                setIsOpen(true)
                setIsOtpSent(true);
                // toast({ 
                //     title: response?.message,
                //     variant: "success",
                // })
            } else if(response.data.resend_count===0) {
                setExpired(true)
                toast({ 
                    title: response?.message,
                    variant: "destructive",
                    
                })
            } else {
                setIsOpen(false)
                let errorKey = payload?.email ? {email: response?.message} : {phone: response?.message}
                formik.setErrors(errorKey);
            }
            formik.setSubmitting(false);
        } catch (error) {
            setIsOpen(false)
            const errorKey = payload?.email ? "email" : "phone";
            formik.setErrors(error?.response?.data?.message);
            console.log(error?.response?.data?.message,"error?.response?.data?.message");
            handleApiError(error, errorKey);
        }
    };

    const handleSubmit = async () => {
        formik.setSubmitting(true);
        try {
            const response = await axiosPostWithToken(UPDATE_EMAIL_PHONE, accountInfo, lang)

            if (response.success === true) {
                setInvalid(false);
                setIsOpen(false)
                toast({ 
                    title: response?.message,
                    variant: "success",
                })
            } else {
                setInvalid(true);
                setOtpValue('')
                setIsOpen(false)
                mutate(`${PROFILE_DETAILS}`);
                toast({ 
                    title: response?.message,
                    variant: "destructive",
                })
                // window.location.href = '/chat'
            }
            formik.setSubmitting(false);
        } catch (error) {
            console.error('Error during sign-in:', error);
            setInvalid(true);
            setOtpValue('')
            formik.setSubmitting(false);
            formik.setErrors(error?.response?.data?.message);
            console.log(error?.response?.data?.message,"errro");
            toast({ 
                title: 'please try again',
                variant: "destructive",
                
            })
        }
    };
    const otpHandler = (value) => {
        setOtpValue(value);
        setAccountInfo({...accountInfo, 'otp': value})
    }

    return {
        sendOtp,
        handleSubmit,
        signOut,
        isOtpSent,
        isOpen, 
        setIsOpen,
        session,
        inValid, 
        setIsPhone,
        isPhone,
        setIsOtpSent,
        expired,
        otpValue, 
        setOtpValue,
        otpHandler,
        phoneValue,
        emailValue,
        setPhoneValue,
        setEmailValue,
        accountInfo,
        setAccountInfo,
        handlePhoneChange,
        formik
    };
};
