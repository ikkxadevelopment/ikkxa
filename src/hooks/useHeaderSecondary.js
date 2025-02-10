import { headerState } from '@/recoil/atoms';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

const useHeaderSecondary = (isVisible = true) => {
  const setHeader = useSetRecoilState(headerState);

  useEffect(() => {
    setHeader(isVisible);

    return () => {
      setHeader(false);
    };
  }, [setHeader, isVisible]);
};

export default useHeaderSecondary;
