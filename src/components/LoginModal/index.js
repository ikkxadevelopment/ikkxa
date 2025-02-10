import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useTranslations } from "next-intl";
import useGetDeviceType from "@/hooks/useGetDeviceType";
import LoginWidget from "../LoginWidget";
import { useLoginWidget } from "../LoginWidget/useLoginWidget";

export function LoginModal() {
  const t = useTranslations("Index");
  const { width } = useGetDeviceType();
  const {
    signOut,
    session,
    setIsOpen,
    isOpen,
  } = useLoginWidget({});


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* <DialogTrigger asChild>
        <button className="btn btn-grad btn-lg" onClick={() => setIsOpen(true)}>
          {t("LOGIN")}
        </button>
      </DialogTrigger> */}
      <DialogContent className="h-screen md:h-auto sm:max-w-[410px] p-0 rounded-1">
        <div className="">
          <LoginWidget/>
          {/* {session?.status === "authenticated"  ? (
            <button onClick={signOut}>{t('Logout')}</button>
          ) : (
            <LoginWidget/>
          )} */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
