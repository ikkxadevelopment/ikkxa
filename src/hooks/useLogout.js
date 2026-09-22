import { useSWRConfig } from 'swr';
import { signOut } from 'next-auth/react';

export function useLogout() {
  const { mutate, cache } = useSWRConfig();

  const handleLogOut = async () => {
    try {
      cache.clear(); // Clear the SWR cache
      // The confirmed order (and its Tabby pre-score) belongs to this account and
      // country's backend; don't carry it into the next session.
      try {
        localStorage.removeItem('checkoutDataState');
      } catch (e) {}
      await signOut(); // Perform the sign-out using NextAuth
      mutate(() => true, undefined, { revalidate: false }); // Disable revalidation
      window.location.href = '/'; // Redirect to the home page
    } catch (error) {
      console.error('Sign-out failed:', error);
    }
  };

  return {
    handleLogOut};
}
