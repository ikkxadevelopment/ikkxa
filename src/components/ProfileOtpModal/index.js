import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale, useTranslations } from "next-intl";
import { useProfileOtpModal } from "./useProfileOtpModal";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { Skeleton } from "../ui/skeleton";

export function ProfileOtpMoadal({data}) {
  const t = useTranslations("Index");
  const lang = useLocale()
  const [locale, country] = lang.split("-");
  const {
    session,
    setIsOpen,
    isOpen,
    isOtpSent,
    sendOtp,
    otpValue, 
    inValid, 
    handleSubmit,
    otpHandler,
    phoneValue,
    handlePhoneChange,
    formik,
    emailValue,
    accountInfo
  } = useProfileOtpModal({data});

  return (
    <>
      <div className="md:p-6 md:bg-white md:rounded md:border md:border-stone-200 mb-4">
        <h3 className="text-black text-lg font-semibold mb-5 leading-relaxed">
          {t('AccountInformation')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 xl:gap-8">
          {!data?<>
            <div>
        <Skeleton className="h-[14px] mb-1 w-[50px]" />
        <Skeleton className="h-9 w-[100%]" />
        </div>
        <div>
        <Skeleton className="h-[14px] mb-1 w-[50px]" />
        <Skeleton className="h-9 w-[100%]" />
        </div>
          </>:<>
          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="email" className="mb-0">{t('Email')}</Label>
              {!data?.data?.email ?
                <button disabled={formik.isSubmitting} className=" text-teal-500 text-sm font-semibold inline-block underline leading-none tracking-wide text-nowrap" onClick={() => formik.handleSubmit()}>
                  {formik.isSubmitting || !data  ? `${t('Loading')}...` : `${t("add")}`}  
                </button>
                : ""
              }
            </div>
            <Input
              type="email"
              id="email"
              value={formik.values.email}
              // value={`${data?.data?.email}`}
              placeholder={t('EnterEmailHere')}
              disabled={data?.data?.email}
              onChange={(e) =>
                handlePhoneChange(e.target.value, "email")

              }
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-600 text-xs mt-1">{formik.errors.email}</div>
            )}
          </div>

          <div>
            <div className="flex justify-between mb-2">

              <Label htmlFor="name" className="mb-0">{t('Phone')}</Label>
              {!data?.data?.phone ?
                <button disabled={formik.isSubmitting} className=" text-teal-500 text-sm font-semibold inline-block underline leading-none tracking-wide text-nowrap" onClick={() => sendOtp()}>
                  {formik.isSubmitting || !data ? `${t('Loading')}...` : `${t("add")}`} 
                </button>
                : ""
              }
            </div>
            <PhoneInput
              international
              countryCallingCodeEditable={false}
              defaultCountry={country}
              countries={["AE", "SA"]} 
              value={formik.values.phone}
              disabled={data?.data?.phone}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              onChange={(value) =>
                handlePhoneChange(value, "phone")
              }
            />
            {formik.touched.phone || formik.errors.phone && (
              <div className="text-red-600 text-xs mt-1">{formik.errors.phone}</div>
            )}
          </div>
          </>}
         
        
        </div>

        {isOpen &&
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="h-screen md:h-auto sm:max-w-[410px] p-0 rounded-1">
              <div className="px-4 lg:p-10 pt-5">
                {session?.status === "authenticated" && isOtpSent &&
                  <div className="">
                    <div className="mb-8">
                      <h3 className="text-black text-2xl font-semibold mb-1">
                        {t('VerifyOTP')}
                      </h3>
                      <p className="text-zinc-500 text-base">
                        {t('otpTitle')}{" "}
                        {accountInfo?.email !== ""
                            ? emailValue
                            : phoneValue}
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="mb-5">
                        <InputOTP
                          maxLength={6}
                          value={otpValue}
                          onChange={(value) => { otpHandler(value)}}
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

                        {inValid && (
                          <p className="text-red-700 text-xs mt-2">
                            {t('InvalidOTP')}
                          </p>
                        )}
                      </div>
                      <button disabled={otpValue?.length !== 6} className="btn btn-lg btn-primary w-full" onClick={() => handleSubmit()} >
                        {/* {t('VerifyOTP')} */}
                        {formik.isSubmitting ? `${t('Loading')}...` : `${t('VerifyOTP')}`} 
                      </button>
                    </div>
                  </div>
                }
              </div>
            </DialogContent>
          </Dialog>
        }
      </div>
    </>
  );
}
