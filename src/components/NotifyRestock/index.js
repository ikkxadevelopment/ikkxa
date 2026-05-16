"use client";
import { useState, useEffect } from "react";
import { BellRing } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userDetail } from "@/recoil/atoms";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { NOTIFY_RESTOCK } from "@/constants/apiRoutes";
import getBaseUrl from "@/hooks/getBaseUrl";

const COUNTRY_CODES = [
  { code: "+966", label: "🇸🇦 +966", country: "SA" },
  { code: "+971", label: "🇦🇪 +971", country: "AE" },
];

export default function NotifyRestock({ productId, outOfStockVariants }) {
  const t = useTranslations("Index");
  const lang = useLocale();
  const [, country] = lang.split("-");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const userDetails = useRecoilValue(userDetail);

  const defaultCountryCode =
    COUNTRY_CODES.find((c) => c.country === country)?.code || "+966";

  const schema = Yup.object({
    variant_id: Yup.string().required(t("NotifyVariantRequired")),
    email: Yup.string().when("method", {
      is: (methods) => methods?.includes("mail"),
      then: (s) => s.email(t("NotifyEmailInvalid")).required(t("NotifyEmailRequired")),
    }),
    mobile: Yup.string().when("method", {
      is: (methods) => methods?.includes("whatsapp") || methods?.includes("sms"),
      then: (s) => s.required(t("NotifyPhoneRequired")),
    }),
    method: Yup.array()
      .of(Yup.string().oneOf(["mail", "whatsapp", "sms"]))
      .min(1, t("NotifyMethodRequired")),
  });

  const formik = useFormik({
    initialValues: {
      variant_id: outOfStockVariants?.[0]?.id?.toString() || "",
      email: userDetails?.email || "",
      country_code: defaultCountryCode,
      mobile: userDetails?.phone?.replace(/^\+\d+/, "") || "",
      method: ["mail"],
    },
    validationSchema: schema,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const baseUrl = getBaseUrl(country);
        const needsPhone =
          values.method.includes("whatsapp") || values.method.includes("sms");

        await axios.post(`${baseUrl}${NOTIFY_RESTOCK}`, {
          product_id: productId,
          variant_ids: parseInt(values.variant_id),
          email: values.method.includes("mail") ? values.email : undefined,
          country_code: needsPhone ? values.country_code : undefined,
          mobile: needsPhone ? values.mobile : undefined,
          method: values.method,
        });

        toast({ description: t("NotifySuccess") });
        resetForm();
        setOpen(false);
      } catch {
        toast({ description: t("NotifyError"), variant: "destructive" });
      } finally {
        setLoading(false);
      }
    },
  });

  // Re-sync account details each time the dialog opens
  useEffect(() => {
    if (open) {
      if (userDetails?.email) formik.setFieldValue("email", userDetails.email);
      if (userDetails?.phone) {
        const stripped = userDetails.phone.replace(/^\+\d+/, "");
        formik.setFieldValue("mobile", stripped);
      }
    }
  }, [open]);

  const toggleMethod = (value) => {
    const current = formik.values.method;
    const updated = current.includes(value)
      ? current.filter((m) => m !== value)
      : [...current, value];
    formik.setFieldValue("method", updated);
  };

  const needsPhone =
    formik.values.method.includes("whatsapp") ||
    formik.values.method.includes("sms");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-sm text-primary font-medium mt-3 hover:underline"
      >
        <BellRing className="w-4 h-4" />
        {t("NotifyMeWhenAvailable")}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BellRing className="w-5 h-5" />
              {t("NotifyMeWhenAvailable")}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={formik.handleSubmit} className="space-y-4 pt-2">
            {/* Variant select */}
            {outOfStockVariants.length > 1 && (
              <div>
                <Label>{t("NotifySelectVariant")}</Label>
                <select
                  name="variant_id"
                  value={formik.values.variant_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {outOfStockVariants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
                {formik.touched.variant_id && formik.errors.variant_id && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.variant_id}</p>
                )}
              </div>
            )}

            {/* Notification method */}
            <div>
              <Label>{t("NotifyMethod")}</Label>
              <div className="flex gap-4 mt-2">
                {[
                  { value: "mail", label: t("NotifyViaEmail") },
                  { value: "whatsapp", label: "WhatsApp" },
                ].map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formik.values.method.includes(value)}
                      onCheckedChange={() => toggleMethod(value)}
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
              {formik.touched.method && formik.errors.method && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.method}</p>
              )}
            </div>

            {/* Email */}
            {formik.values.method.includes("mail") && (
              <div>
                <Label htmlFor="notify-email">{t("Email")}*</Label>
                <Input
                  id="notify-email"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="you@example.com"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
                )}
              </div>
            )}

            {/* Country code + mobile */}
            {needsPhone && (
              <div>
                <Label>{t("MobileNumber")}*</Label>
                <div className="flex gap-2 mt-1">
                  <select
                    name="country_code"
                    value={formik.values.country_code}
                    onChange={formik.handleChange}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm w-28 shrink-0"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <Input
                    name="mobile"
                    type="tel"
                    inputMode="numeric"
                    value={formik.values.mobile}
                    onChange={(e) =>
                      formik.setFieldValue("mobile", e.target.value.replace(/\D/g, ""))
                    }
                    onBlur={formik.handleBlur}
                    placeholder="500000000"
                    className="flex-1"
                  />
                </div>
                {formik.touched.mobile && formik.errors.mobile && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.mobile}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-full"
            >
              {loading ? t("NotifySubmitting") : t("NotifySubmit")}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
