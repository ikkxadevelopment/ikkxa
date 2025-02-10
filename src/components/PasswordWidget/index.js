"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

export default function PasswordWidget() {
  const t = useTranslations("Index");
  return (
    <>
     

      <div className="p-6 bg-white rounded border border-stone-200">
        <h3 className=" text-black text-lg font-semibold mb-5 leading-relaxed">
        {t('ChangePassword')}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-9">
          <div className="">
            <Label htmlFor="currentPassword">{t('CurrentPassword')}</Label>
            <Input type="email" id="currentPassword" placeholder={t('EnterHere')} />
          </div>
          <div></div>

          <div className="">
            <Label htmlFor="NewPassword">{t('NewPassword')}</Label>
            <Input type="email" id="NewPassword" placeholder={t('EnterHere')} />
          </div>

          <div className="">
            <Label htmlFor="ConfirmPassword">{t('ConfirmPassword')}</Label>
            <Input type="email" id="ConfirmPassword" placeholder={t('EnterHere')} />
          </div>
        </div>

        <button className="btn btn-primary btn-lg w-48" disabled>
          {t('Change')}
        </button>
      </div>
    </>
  );
}
