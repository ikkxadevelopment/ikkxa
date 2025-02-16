import { isComponentPresentState } from "@/recoil/atoms";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

const useHeaderSecond = () => {
  const setIsComponentPresent = useSetRecoilState(isComponentPresentState);

  useEffect(() => {
    setIsComponentPresent(true);
    return () => setIsComponentPresent(false);
  }, [setIsComponentPresent]);
};

export default useHeaderSecond;