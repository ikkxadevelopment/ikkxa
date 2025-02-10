"use client"

import { useTranslations } from "next-intl";

export default function RevalidationPage() {
  const t = useTranslations("Index");
  const handleRevalidate = async () => {
    try {
      const response = await fetch("/api/revalidate", {
        method: "POST",
      });
      console.log(response,"response");

      if (response.ok) {
        const data = await response.json();
      } else {
        const errorData = await response.json();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <main className="pt-[72px]">
      <button onClick={handleRevalidate}>{t('RevalidatePaths')}</button>
    </main>
  );
}
