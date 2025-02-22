"use client";
import { useLoginWidget } from "./useLoginWidget";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "../Link";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useState } from "react";
import Image from "@/components/Image";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useLocale, useTranslations } from "next-intl";
import useGetDeviceType from "@/hooks/useGetDeviceType";

export default function LoginWidget({ }) {
  const t = useTranslations("Index");
  const lang = useLocale()
  const [locale, country] = lang.split("-");
  const { width } = useGetDeviceType();
  const [isResent, setIsResent] = useState(false)
  const {
    sendOtp,
    handleSubmit,
    signOut,
    isOtpSent,
    session,
    validationSchema,
    inValid,
    setIsOpen,
    setIsPhone,
    isPhone,
    isOpen,
    expired,
    setIsOtpSent,
    setInvalid
  } = useLoginWidget({});

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const [phoneValue, setPhoneValue] = useState("");
  const [otpValue, setOtpValue] = useState(""); // Store OTP value locally

  const handlePhoneChange = (value, setFieldValue) => {
    setPhoneValue(value);

    if (value) {
      const phoneNumberObj = parsePhoneNumberFromString(value);
      if (phoneNumberObj) {
        setFieldValue("countryCode", `+${phoneNumberObj.countryCallingCode}`);
        setFieldValue("phoneNumber", phoneNumberObj.nationalNumber);
      }
    } else {
      setFieldValue("countryCode", "");
      setFieldValue("phoneNumber", "");
    }
  };

  const isOtpValid = otpValue.length === 6; // Check if OTP length is 6


  return (
    <div className="bg-white">
      <Formik
        initialValues={{
          countryCode: "+91",
          phoneNumber: "",
          otp: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (!isOtpSent || isResent) {
            setSubmitting(true)
            sendOtp(values, setSubmitting);
            setIsResent(false)
          } else {
            handleSubmit(values,setSubmitting);
          }
          // setSubmitting(false); // Reset submitting state
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          setFieldValue,
          errors,
          touched,
          isSubmitting,
        }) => (
          <Form >
            {/* onSubmit={handleSubmit} */}
            {width < 992 && (
              <div className="px-4 py-[10px] lg:p-10 bg-white border-b border-black border-opacity-5">
                <div className="aspect-[126/52] w-[84px] md:w-[126px] relative me-5 lg:hidden">
                  <Image
                    src={"/images/logo.png"}
                    fill
                    className="object-fit-cover"
                    alt="logo"
                  />
                </div>
              </div>
            )}

            <div className="px-4 lg:p-10 pt-5">
              {!isOtpSent ? (
                <div className="">
                  <div className="text-start mb-7">
                    <p className="text-black text-sm font-medium">
                      {t('WelcomeBack')}!
                    </p>
                    <h3 className="text-black text-2xl font-semibold">
                      {t('signInHeader')}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div>
                        <div className="p-0.5 bg-gray-200 rounded-3xl justify-start items-start inline-flex mb-7">
                          <div
                            className={`px-6 py-1.5 cursor-pointer rounded-3xl text-xs font-medium ${isPhone
                              ? "bg-black text-white"
                              : "bg-gray-200 text-black"
                              }`}
                            onClick={() => setIsPhone(true)}
                          >
                            {t('Phone')}
                          </div>
                          <div
                            className={`px-6 py-1.5 cursor-pointer rounded-3xl text-xs font-medium ${isPhone
                              ? "bg-gray-200 text-black"
                              : "bg-black text-white"
                              }`}
                            onClick={() => setIsPhone(false)}
                          >
                            {t('Email')}
                          </div>
                        </div>
                      </div>
                      {isPhone ? (
                        <>
                          <Label htmlFor="name">{t('Phone')}</Label>
                          <PhoneInput
                            international
                            countryCallingCodeEditable={false}
                            defaultCountry={country}
                            // isSupportedCountry={["sa"]}
                            countries={["AE", "SA"]} 
                            value={phoneValue}
                            onChange={(value) =>
                              handlePhoneChange(value, setFieldValue)
                            }
                            style={{direction:"ltr"}}
                            className={`mt-1 block w-full p-3 text-start rounded-md border ${errors.phoneNumber && touched.phoneNumber
                              ? "border-red-500"
                              : "border-gray-300"
                              }`}
                          />
                        </>
                      ) : (
                        <>
                          <Label htmlFor="email">{t('Email')}</Label>
                          <Input
                            id="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            required
                            className={`mt-1 block w-full p-3 rounded-md border ${errors.email && touched.email
                              ? "border-red-500"
                              : "border-gray-300"
                              }`}
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-red-600 text-xs mt-2"
                          />
                        </>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="btn btn-lg btn-primary w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? `${t('Loading')}...` : `${t('SendOTP')}`}
                    </button>
                    {/* <button
                      onClick={handleGoogleSignIn}
                      className="btn btn-lg border w-full flex justify-center items-center"
                      type="button"
                    >
                      <span className="me-2 text-xl">
                        <FcGoogle />
                      </span>
                      {t('SignInWithGoogle')}
                    </button> */}
                    <div className="text-center">
                      <p className="text-xs mt-5 text-[#565656]">
                        {t('ByContinuing')}{" "}
                        <Link href="/">{t('TermsOfService')}</Link> {t('and')}{" "}
                        <Link href="/">{t('PrivacyPolicy')}</Link>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="">
                  <div className="mb-8">
                    <h3 className="text-black text-2xl font-semibold mb-1">
                      {t('VerifyOTP')}
                    </h3>
                    <p className="text-zinc-500 text-base">
                      {t('otpTitle')}{" "}
                      {isPhone
                        ? values?.countryCode + values?.phoneNumber
                        : values?.email}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="mb-5">
                      <InputOTP
                        maxLength={6}
                        value={otpValue}
                        onChange={(value) => {
                          setOtpValue(value); // Update OTP value in state
                          setInvalid(false)
                          handleChange({
                            target: { name: "otp", value },
                          });
                        }}
                      >
                        <InputOTPGroup className="justify-between gap-2 mb-0">
                          {[...Array(6)].map((_, index) => (
                            <InputOTPSlot
                              className="text-2xl h-[50px]"
                              key={index}
                              index={index}
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                      <ErrorMessage
                        name="otp"
                        component="div"
                        className="text-red-600 text-xs"
                      />
                      {inValid && (
                        <p className="text-red-700 text-xs mt-2">
                          {t('InvalidOTP')}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="btn btn-lg btn-primary w-full"
                      disabled={isSubmitting||(!isOtpValid)} // Disable if OTP is not valid or submitting
                    >
                      {isSubmitting && isOtpValid ? `${t('Loading')}...` : "Verify OTP"}
                    </button>
                    <div className="text-center">
                      <p className="text-xs mt-5 text-[#565656]">
                        {t('ResentOTPTitle')}{" "}
                        <button
                          type="submit"
                          className="text-teal-500 font-medium underline ml-2 cursor-pointer"
                          onClick={() => setIsResent(true)}
                          // disabled={isSubmitting} 
                        >
                          {t('ResendOTP')}
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
