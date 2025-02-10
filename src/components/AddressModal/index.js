// import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddressModal } from "./useAddressModal";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useLocale, useTranslations } from "next-intl";

export function AddressModal({ data, mode, isOpen, setIsOpen }) {
  const t = useTranslations("Index");
  const lang = useLocale()
  const [locale, country] = lang.split("-");
  // const [isOpen, setIsOpen] = useState(false);
  const [countryId, setCountryId] = useState(data?.address_ids?.country_id || null);
  const [stateId, setStateId] = useState(data?.address_ids?.state_id || null);
  const [isDefault, setIsDefault] = useState(data?.default_shipping !== 0)
  const id = data?.id
  const { countries, states, cities, handleAddress, defaultHandler } = useAddressModal(countryId, stateId, setIsDefault, isDefault, id);

  // Yup validation schema
  const AddressSchema = Yup.object().shape({
    name: Yup.string().required(`${t("NameIsRequired")}`),
    email: Yup.string().required(`${t("EmailIsRequired")}`),
    // phone_no: Yup.string().required("Mobile number is required"),
    country_id: Yup.string().required(`${t('CountryIsRequired')}`),
    state_id: Yup.string().required(`${t('StateIsRequired')}`),
    city_id: Yup.string().required(`${t("CityIsRequired")}`),
    street: Yup.string().required(`${t("StreetIsRequired")}`),
    postal_code: Yup.string().required(`${t('PostCodeIsRequired')}`),
    // building: Yup.string().required("City is required"),
    // type: Yup.string().required("City is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: data?.name || "",
      email: data?.email || "",
      phone_no: data?.phone_no || "",
      country_id: data?.address_ids?.country_id || "",
      state_id: data?.address_ids?.state_id || "",
      city_id: data?.address_ids?.city_id || "",
      building: data?.building || "",
      street: data?.street || "",
      type: data?.type || "",
      postal_code: data?.postal_code || "",
      default: data?.default_shipping || 0,
    },
    validationSchema: AddressSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      // Ensure all fields are validated before submission
      const errors = await formik.validateForm();
      if (Object.keys(errors).length > 0) {
        formik.setTouched(
          Object.keys(errors).reduce((acc, field) => {
            acc[field] = true;
            return acc;
          }, {})
        );
        return; // Do not submit if there are validation errors
      }
  
      handleAddress(values, mode, setIsOpen );
    },
  });
  

  // const handlePhoneChange = (value, field) => {
  //   console.log(value,"valuevaluevaluevalue");
  //   formik.setFieldValue(field, value);
  //   // Ensure value is a valid string
  //   if (typeof value === 'string' && value.trim() !== '') {
  //     const phoneNumberObj = parsePhoneNumberFromString(value.replace(/[^0-9]/g, ''));
  //     if (phoneNumberObj) {
  //       formik.setFieldValue(field, phoneNumberObj.nationalNumber);
  //     } else {
  //       formik.setFieldValue(field, '');
  //     }
  //   } else {
  //     formik.setFieldValue(field, '');
  //   }
  // };

  useEffect(() => {
    if (data?.address_ids?.country_id) {
      setCountryId(data.address_ids.country_id);
    }
    if (data?.address_ids?.state_id) {
      setStateId(data.address_ids.state_id);
    }
  }, [data]);

  return (
    <Dialog
      open={isOpen}
      className="bg-red-400"
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          formik.resetForm();
        }
      }}
    >
      {/* <DialogTrigger asChild>
       <button className="btn btn-outline-secondary btn-sm">
           {mode === "edit" ? "Edit" : "Add Address"}
        </button>
      </DialogTrigger> */}
      <DialogContent className="h-screen md:h-auto sm:max-w-[640px] p-10 rounded-none lg:rounded-none lg:p-10 ">
        <DialogHeader>
          <h3 className="text-black text-xl font-semibold">
            {mode === "edit" ? "Edit Address" : `${t('AddAddress')}`}
          </h3>
          <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="name">{t('Name')}*</Label>
              <Input
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="col-span-3"
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500">{formik.errors.name}</div>
              ) : null}
            </div>
            <div>
              <Label htmlFor="email">{t('Email')}*</Label>
              <Input
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="col-span-3"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500">{formik.errors.email}</div>
              ) : null}
            </div>
            <div className="col-span-2">
              <Label htmlFor="mobile">{t('MobileNumber')}*</Label>
              <PhoneInput
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                international
              countries={["AE", "SA"]} 
                countryCallingCodeEditable={false}
                defaultCountry={country}
                value={formik.values.phone_no}
                disabled={data?.data?.phone}
                onChange={(value) => formik.setFieldValue("phone_no", value)}
                // onChange={(value) => handlePhoneChange(value, 'phone_no')}
                onBlur={formik.handleBlur}
                // onChange={(value) =>
                //   handlePhoneChange(value, "phone")
                // }
              />
              {formik.touched.phone_no && formik.errors.phone_no ? (
                <div className="text-red-500">{formik.errors.phone_no}</div>
              ) : null}
            </div>


            <div className="col-span-2">
              <Label htmlFor="building_no">{t('Building')} {t('Number')} / {t('Name')}</Label>
              <Input
                id="building"
                name="building"
                value={formik.values.building}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder=""
                className="col-span-3"
              />

            </div>
            <div className="col-span-2">
              <Label htmlFor="street" >{t('Street')} {t('Name')} / {t('Area')}*</Label>
              <Input
                id="street"
                name="street"
                value={formik.values.street}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder=""
                className="col-span-3"
              />
              {formik.touched.street && formik.errors.street ? (
                <div className="text-red-500">{formik.errors.street}</div>
              ) : null}
            </div>
            {/* Country Select */}
            <div>
              <Label htmlFor="country">{t('Country')}*</Label>
              <select
                id="country"
                name="country_id"
                value={formik.values.country_id}
                onChange={(e) => {
                  formik.handleChange(e);
                  setCountryId(e.target.value); // Load states based on selected country
                  formik.setFieldValue('stateId', ''); // Reset state and city when country changes
                  formik.setFieldValue('cityId', '');
                }}
                onBlur={formik.handleBlur}
                className="w-full"
              >
                <option value="">{t('SelectCountry')}</option>
                {countries && countries?.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
              {formik.touched.country_id && formik.errors.country_id ? (
                <div className="text-red-500">{formik.errors.country_id}</div>
              ) : null}
            </div>

            {/* State Select */}
            <div>
              <Label htmlFor="state">{t('State')}*</Label>
              <select
                id="state"
                name="state_id"
                value={formik.values.state_id}
                onChange={(e) => {
                  formik.handleChange(e);
                  setStateId(e.target.value); // Load cities based on selected state
                  formik.setFieldValue('cityId', ''); // Reset city when state changes
                }}
                onBlur={formik.handleBlur}
                className="w-full"
                disabled={!countryId}
              >
                <option value="">{t('SelectState')}</option>
                {states?.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
              {formik.touched.state_id && formik.errors.state_id ? (
                <div className="text-red-500">{formik.errors.state_id}</div>
              ) : null}
            </div>

            {/* City Select */}
            <div>
              <Label htmlFor="city">{t('City')}*</Label>
              <select
                id="city"
                name="city_id"
                value={formik.values.city_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full"
                disabled={!stateId}
              >
                <option value="">{t('SelectCity')}</option>
                {cities?.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
              {formik.touched.city_id && formik.errors.city_id ? (
                <div className="text-red-500">{formik.errors.city_id}</div>
              ) : null}
            </div>

            {/* Postal Code */}
            <div>
              <Label htmlFor="lastName">{t('PostalCode')}*</Label>
              <Input
                id="postal_code"
                name="postal_code"
                value={formik.values.postal_code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="col-span-3"
              />
              {formik.touched.postal_code && formik.errors.postal_code ? (
                <div className="text-red-500">{formik.errors.postal_code}</div>
              ) : null}
            </div>


            <div className="mb-4">
              <RadioGroup defaultValue={formik.values.type} onValueChange={(value) => formik.setFieldValue('type', value)} name="type" className="flex" >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="home" id="r1" />
                  <Label className="mb-0" htmlFor="r1">{t('Home')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="work" id="r2" />
                  <Label className="mb-0" htmlFor="r2">{t('Work')}</Label>
                </div>
              </RadioGroup>

            </div>
            <div>

            </div>

          </div>

          <div className="flex justify-between items-center">
           
            {/* {mode === "edit" &&
              <button
                className="btn btn-primary btn-lg"
                onClick={()=> defaultHandler(data?.id)}
              >
                Default
              </button>
            } */}
            <div className="flex items-center">
              <Switch id="default"
                name="default"
                // value={"on"}
                defaultChecked={data?.default_shipping}
                value={formik.values.default === 1 ? true : false}
                onCheckedChange={(value) => formik.setFieldValue('default', value === true ? 1 : 0)}
              />

              <Label htmlFor="default" className="ms-2 mb-0">{t('MakeThisAsDefault')}</Label>
            </div>


            <button
              type="submit"
              className="btn btn-primary btn-lg lg:min-w-40 "
            >
              {mode === "edit" ? `${t('EditAddress')}` : `${t("AddAddress")}`}
            </button>
            

            {/*             
            <div className="flex items-center">
              <Switch id="defa"
                checked={isDefault}
                disabled={isDefault}
                onCheckedChange={() => defaultHandler(data?.id)} 
                />
              <Label htmlFor="defa" className="ms-2 mb-0">Make this as default</Label>
            </div> */}

          </div>
        </form>
        </DialogHeader>
     
      </DialogContent>
    </Dialog>
  );
}