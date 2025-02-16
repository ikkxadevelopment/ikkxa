import { atom } from "recoil";


const localStorageEffect = (key) => ({ setSelf, onSet }) => {
  if (typeof window !== 'undefined') {
    // Get the initial value from localStorage
    const savedValue = localStorage.getItem(key);

    if (savedValue !== null && savedValue !== undefined) {
      setSelf(JSON.parse(savedValue));  // Initialize state from localStorage
    }

    // Update localStorage whenever the Recoil state changes
    onSet((newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue));
      // console.log('Updated localStorage:', localStorage.getItem(key));  // Log after setting
    });
  }
};


export const getUniqueKey = () => {
  const time = new Date().getTime();
  return time;
};


export const cartCountState = atom({
  key: 'cartCount',
  default: 0,
  effects_UNSTABLE: [localStorageEffect('cartCount')],
});


export const headerClassAtom = atom({
  key: `header_${getUniqueKey()}`,
  default: "first",
});

export const loginIsOpen = atom({
  key: `r_${getUniqueKey()}`,
  default: false,
});

export const cartState = atom({
  key: 'cartState',
  default: [], 
  // effects_UNSTABLE: [localStorageEffect('cartState')],
});

export const selectedVariantState = atom({
  key: "selectedVariantState",
  default: [],
});

export const errorMessageProductCard = atom({
  key: 'errorMessagesState',
  default: {},
});
export const userDetail = atom({
  key: 'userDetails',
  default: {},
});


export const checkoutDataState = atom({
  key: 'checkoutDataState',
  default: null,
  effects: [localStorageEffect('checkoutDataState')],
  
});

export const trax_id = atom({
  key: 'trax_id',
  default: null,
  effects: [localStorageEffect('trax_id')],
  
});

export const couponAppliedState = atom({
  key: `couponAppliedState`,
  default: null, // Default value
  effects: [localStorageEffect('couponAppliedState')],
});


export const headerState = atom({
  key: `headeraa_${getUniqueKey()}`,
  default: false,
});

export const addressIsOpen = atom({
  key: `addr_${getUniqueKey()}`,
  default: false,
});

export const isComponentPresentState = atom({
  key: 'isComponentPresentState',
  default: false,
});