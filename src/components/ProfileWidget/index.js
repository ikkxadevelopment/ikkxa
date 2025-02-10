"use client";
import useSWR, { useSWRConfig } from "swr";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Suspense, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as Yup from "yup";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRecoilState } from "recoil";
import { userDetail } from "@/recoil/atoms";
import { Field, Form, Formik } from "formik";
import { PROFILE_DETAILS, UPDATE_PROFILE } from "@/constants/apiRoutes";
import { axiosPostWithToken } from "@/lib/getHome";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import AppBack from "../AppBack";
import useGetDeviceType from "@/hooks/useGetDeviceType";
import { useProfileWidget } from "./useProfileWidget";
import { ProfileOtpMoadal } from "../ProfileOtpModal";
import { useTranslations } from "next-intl";

export default function ProfileWidget() {
  const t = useTranslations('Index')
  const { data, error } = useSWR(`${PROFILE_DETAILS}`);
  const { width } = useGetDeviceType();

  const {
    validationSchema,
    initialValues,
    handleFormSubmit,
    loading,
  } = useProfileWidget({ data })

  return (
    <>
      <AppBack route={"/account"} title={t('MyProfile')} />
        <ProfileOtpMoadal data={data} />
      {/* <div className="md:p-6 md:bg-white md:rounded md:border md:border-stone-200 mb-4">
        <h3 className="text-black text-lg font-semibold mb-5 leading-relaxed">
          Account Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 xl:gap-8">
          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="email" className="mb-0">Email address</Label>
              {!data?.data?.email ?
                <ProfileOtpMoadal data={accountInfo} setAccountInfo={setAccountInfo} />
                : ""
              }
            </div>
            <Input
              type="email"
              id="email"
              value={emailValue || data?.data?.email}
              // value={`${data?.data?.email}`}
              placeholder="Enter here"
              disabled={data?.data?.email}
              onChange={(e) =>
                handlePhoneChange(e.target.value, "email")

              }
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">

              <Label htmlFor="name" className="mb-0">Phone</Label>
              {!data?.data?.phone ?
                <ProfileOtpMoadal data={accountInfo} setAccountInfo={setAccountInfo} />
                : ""
              }
            </div>
            <PhoneInput
              international
              countryCallingCodeEditable={false}
              defaultCountry="SA"
              value={phoneValue || data?.data?.phone}
              disabled={data?.data?.phone}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              onChange={(value) =>
                handlePhoneChange(value, "phone")
              }
            />
            {/* <Label htmlFor="phone">Mobile</Label>
            <Input
              type="text"
              id="phone"
              value={`${data?.data?.phone}`}
              placeholder="Enter here"
              disabled={true}
            /> */}
          {/* </div> */}
        {/* </div> */}

      {/* </div> */}

      <div className="md:p-6 md:bg-white md:rounded md:border md:border-stone-200 md:mb-4">
        <h3 className="text-black text-lg font-semibold mb-5 leading-relaxed">
          {t('MyProfile')}
        </h3>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={handleFormSubmit} // Submit form and post data
        >
          {({ values, setFieldValue, errors, touched, isValid, dirty }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-9">
                <div>
                  <Label htmlFor="first_name">{t('FirstName')}</Label>
                  <Field
                    as={Input}
                    type="text"
                    id="first_name"
                    name="first_name"
                    placeholder={t('EnterHere')}
                    className={
                      errors.first_name && touched.first_name
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {errors.first_name && touched.first_name && (
                    <div className="text-red-500 text-sm">
                      {errors.first_name}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="last_name">{t('LastName')}</Label>
                  <Field
                    as={Input}
                    type="text"
                    id="last_name"
                    name="last_name"
                    placeholder={t('EnterHere')}
                    className={
                      errors.last_name && touched.last_name
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {errors.last_name && touched.last_name && (
                    <div className="text-red-500 text-sm">
                      {errors.last_name}
                    </div>
                  )}
                </div>



                <div>
                  <Label htmlFor="gender" className="mb-3">
                    {t('Gender')}
                  </Label>
                  <RadioGroup
                    className="flex items-center"
                    // defaultValue={values.gender}
                    value={values.gender}
                    onValueChange={(value) => setFieldValue("gender", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <Field as={RadioGroupItem} value="male" id="male" />
                      <Label className="mb-0" htmlFor="male">
                        {t('Male')}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Field as={RadioGroupItem} value="female" id="female" />
                      <Label className="mb-0" htmlFor="female">
                        {t('Female')}
                      </Label>
                    </div>
                  </RadioGroup>
                  {errors.gender && touched.gender && (
                    <div className="text-red-500 text-sm">{errors.gender}</div>
                  )}
                </div>

                {/* <div>
                  <Label htmlFor="gender">Gender</Label>
                  <RadioGroup id="gender" name="gender" 
                  className="flex items-center"
                    defaultValue="option-one">
                    <div className="flex items-center space-x-4">
                      <div>
                        <Field
                          as={RadioGroupItem}
                          type="radio"
                          id="male"
                          name="gender"
                          value="male"
                          className={
                            errors.gender && touched.gender
                              ? "border-red-500"
                              : ""
                          }
                        />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div>
                        <Field
                          as={RadioGroupItem}
                          type="radio"
                          id="female"
                          name="gender"
                          value="female"
                          className={
                            errors.gender && touched.gender
                              ? "border-red-500"
                              : ""
                          }
                        />
                        <Label htmlFor="female">Female</Label>
                      </div>
                    </div>
                  </RadioGroup>
                  {errors.gender && touched.gender && (
                    <div className="text-red-500 text-sm">{errors.gender}</div>
                  )}
                </div> */}

                <div>
                  <Label htmlFor="date_of_birth">{t('DateOfBirth')} </Label>

                  <Field
                    as={Input}
                    className="block"
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    value={values.date_of_birth}
                  />
                  {/* <Popover>
                    <PopoverTrigger asChild>
                      <button
                        variant={"outline"}
                        className={cn(
                          "flex items-center h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={values.date_of_birth}
                        onSelect={(selectedDate) => {
                          const formattedDate = format(
                            selectedDate,
                            "yyyy-MM-dd"
                          );
                          {
                            console.log(
                              selectedDate,
                              formattedDate,
                              "datedate"
                            );
                          }

                          setFieldValue("date_of_birth", formattedDate);
                          setDate(selectedDate);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover> */}
                  {errors.date_of_birth && touched.date_of_birth && (
                    <div className="text-red-500 text-sm">
                      {errors.date_of_birth}
                    </div>
                  )}
                </div>
              </div>
              {width >= 992 ? (
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-48"
                  disabled={!dirty}
                >
                  {loading ? `${t("Updating")}...` : `${t("Update")}`}
                </button>
              ) : (
                <div className="fixed  lg:hidden bottom-0 left-0 z-10 w-full bg-white shadow px-4 py-3">
                  <button
                    type="submit"
                    className={`btn  ${dirty ? "btn-grad" : "btn-primary"} btn-lg w-full`}
                    disabled={!dirty}
                  >
                    {loading ? `${t("Updating")}...` : `${t("Update")}`}
                  </button>
                </div>
              )}
            </Form>
          )}
        </Formik>

        {/* Optionally display response */}
        {/* {response && (
          <div className="mt-4">
            <p>Response: {JSON.stringify(response)}</p>
          </div>
        )} */}
      </div>
    </>
  );
}
