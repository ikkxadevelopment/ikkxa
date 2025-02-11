"use client";
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { getCountries } from 'react-phone-number-input';

import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useLogin } from "./useLogin";
import { useState } from 'react';
import Image from '@/components/Image';
import { signIn } from 'next-auth/react';
import { FcGoogle } from "react-icons/fc";

export default function LoginWidget() {

    const { sendOtp, handleSubmit, signOut, isOtpSent, session, validationSchema, inValid, expired, setIsOtpSent } = useLogin({})


    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl: '/' });
    };

    const [phoneValue, setPhoneValue] = useState('');

    const handlePhoneChange = (value, setFieldValue) => {
        setPhoneValue(value);

        if (value) {
            const phoneNumberObj = parsePhoneNumberFromString(value);
            if (phoneNumberObj) {
                setFieldValue('countryCode', `+${phoneNumberObj.countryCallingCode}`);
                setFieldValue('phoneNumber', phoneNumberObj.nationalNumber);
            }
        } else {
            setFieldValue('countryCode', '');
            setFieldValue('phoneNumber', '');
        }
    };



    return (
        <section className="flex items-center">
            <div className="w-full">
                <div className="flex items-center space-x-3 bg-white">
                    <div className="flex-col-auto w-[50%]">
                        <div className="px-7">
                            <div className="mx-auto max-w-[450px]">

                                <div>
                                    {session?.status === "authenticated" ? (
                                        <button onClick={signOut}>Logout</button>
                                    ) : (

                                        <Formik
                                            initialValues={{
                                                countryCode: "+966",
                                                phoneNumber: "",
                                                otp: "",
                                            }}
                                            validationSchema={validationSchema}
                                            onSubmit={(values) => {
                                                if (!isOtpSent) {
                                                    sendOtp(values);
                                                } else {
                                                    handleSubmit(values);
                                                }
                                            }}
                                        >
                                            {({ values, handleChange, handleSubmit, setFieldValue, errors, touched }) => (
                                                <Form onSubmit={handleSubmit}>
                                                    {!isOtpSent ? (
                                                        <div className="">
                                                            <div className="text-center mb-8">
                                                                <div className='aspect-1/1 ratio max-w-20 mx-auto relative mb-6'>
                                                                    <Image src={`/assets/images/icons/logo_sm.png`} fill className="object-cover" alt="banner" />
                                                                </div>
                                                                <h2 className="text-3xl font-bold text-[#1A1D23] mb-2">Welcome back</h2>
                                                                <p>Enter your registered phone number to access sdf</p>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <div>
                                                                   
                                                                    <PhoneInput
                                                                        // international
                                                                        countryCallingCodeEditable={false}
                                                                        defaultCountry="SA"
                                                                      
                                                                        
                                                                        value={phoneValue}
                                                                        onChange={(value) => handlePhoneChange(value, setFieldValue)}
                                                                        className={`mt-1 block w-full p-3 rounded-md border ${(errors.phoneNumber && touched.phoneNumber) ? 'border-red-500' : 'border-gray-300'
                                                                            }`}
                                                                    />
                                                                    {expired && <div className="text-red-600 text-xs mt-2">Retry attempts over. Try after 1 hour</div>}
                                                                    {errors.phoneNumber && touched.phoneNumber ? (
                                                                        <div className="text-red-600 text-xs mt-2">{errors.phoneNumber}</div>
                                                                    ) : null}

                                                                    {/* <ErrorMessage name="countryCode" component="div" className="text-red-600 text-xs" /> */}
                                                                </div>

                                                                <button type="submit" className="btn btn-lg btn-primary w-full">{t('SendOTP')}</button>
                                                                {/* <button onClick={handleGoogleSignIn} role='button' className="btn btn-lg border w-full flex justify-center items-center">
                                                                    <span className='me-2 text-xl'><FcGoogle /></span>
                                                                    Sign in with Google
                                                                </button> */}
                                                                <div className="text-center">
                                                                    <p className='text-xs mt-5 text-[#565656]'>By continuing, you agree to Voizzit’s <Link href="/">Terms of Service</Link> and <Link href="/">Privacy Policy</Link></p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="">
                                                            <div className="text-center mb-8">
                                                                <div className='aspect-1/1 ratio max-w-20 mx-auto relative mb-6'>
                                                                    <Image src={`/assets/images/icons/logo_sm.png`} fill className="object-cover" alt="banner" />
                                                                </div>
                                                                <h2 className="text-3xl font-bold text-[#1A1D23] mb-2">Verify phone</h2>
                                                                <p>Code has been sent to  {values?.countryCode}&nbsp;{values?.phoneNumber}</p>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <InputOTP maxLength={6} value={values.otp} onChange={(value) => handleChange({ target: { name: 'otp', value } })}>
                                                                    <InputOTPGroup className="justify-between gap-2 mb-0">
                                                                        {[...Array(6)].map((_, index) => (
                                                                            <InputOTPSlot className="w-[60px] text-3xl h-[60px]" key={index} index={index} />
                                                                        ))}
                                                                    </InputOTPGroup>
                                                                </InputOTP>
                                                                <ErrorMessage name="otp" component="div" className="text-red-600 text-xs" />
                                                                {inValid && <p className="text-red-700 text-xs">Invalid OTP</p>}


                                                                <button type="submit" className="btn btn-lg btn-primary w-full">Verify OTP</button>
                                                                <div className="text-center">
                                                                    <p className='text-xs mt-5 text-[#565656]'>Didn&apos;t get OTP Code <button onClick={() => setIsOtpSent(false)}>Resend OTP</button> </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Form>
                                            )}
                                        </Formik>
                                    )}
                                </div>





                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-screen flex items-stretch">
                        <div className="bg-black w-full relative">
                            <Image src={`/assets/images/login-banner.png`} fill className="object-cover" alt="banner" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
