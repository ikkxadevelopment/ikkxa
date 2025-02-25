import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { axiosPostWithToken } from "@/lib/getHome";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useLocale, useTranslations } from "next-intl";
import { CONTACT } from '@/constants/apiRoutes';
import { useToast } from "@/hooks/use-toast";

export default function EnquireForm() {
  const lang = useLocale();
  const t = useTranslations("Index");

  const validationSchema = Yup.object({
    name: Yup.string().required(`${t("NameIsRequired")}`).min(2, `${t("NameTooShort")}`),
    email: Yup.string()
      .required(`${t("EmailIsRequired")}`)
      .email(`${t("InvalidEmail")}`),
    subject: Yup.string().required(`${t("SubjectIsRequired")}`),
    message: Yup.string().required(`${t("MessageIsRequired")}`).min(10, `${t("MessageTooShort")}`),
  });
  const { toast } = useToast()

  const handleSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      const result = await axiosPostWithToken(CONTACT, values, lang);
      if (result.status) {
        resetForm();
        toast({ 
          title: `${t("MessageSentSuccessfully")}`,
          variant: "success",
          
         })
      } else {
        setErrors({ apiError: result.message || t("FailedToSendMessage") });
      }
    } catch (error) {
      const apiErrorMessage =
        error.response?.data?.message || t("SomethingWentWrongPleaseTryAgain");
      setErrors({ apiError: apiErrorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Formik
        initialValues={{ name: "", email: "", subject: "", message: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form className="space-y-4">
            <div className="grid gap-2">
              <Field
                type="text"
                as={Input}
                name="name"
                id="name"
                placeholder={t("EnterYourName")}
                className="input"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-xs" />
            </div>
            <div className="grid gap-2">
              <Field
                type="email"
                as={Input}
                name="email"
                id="email"
                placeholder={t("EnterYourEmail")}
                className="input"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
            </div>
            <div className="grid gap-2">
              <Field
                type="text"
                as={Input}
                name="subject"
                id="subject"
                placeholder={t("EnterSubject")}
                className="input"
              />
              <ErrorMessage name="subject" component="div" className="text-red-500 text-xs" />
            </div>
            <div className="grid gap-2">
              <Field
                as={Textarea}
                name="message"
                id="message"
                placeholder={t("EnterYourMessage")}
                className="textarea"
              />
              <ErrorMessage name="message" component="div" className="text-red-500 text-xs" />
            </div>
            <div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("Sending") : t("Send")}
              </button>
              {errors.apiError && (
                <div className="text-red-500 text-xs mt-2">{errors.apiError}</div>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
