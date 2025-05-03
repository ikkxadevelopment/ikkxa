// import { useLocale } from "next-intl";

// export const getLocale = () => {
//     return useLocale();
// };

export const HOME = "home/page?page=1&";
export const FILTER = "home/filter_data";
export const ALL_CATEGORIES ="sidebar/categories"

export const FILTER_PRODUCTS = "home/filtered_products"
export const SINGLE_PRODUCT = "home/product-details"
export const CATEGORIES ="home/categories?lang="
// export const GET_CART = "carts?token=true"

export const GET_CART = "carts?"
export const META_DATA = "meta-data?url="
export const MENU_DATA = "menu-data"
//auth
export const OTP_SENT = "get-register-login-otp";
export const OTP_VERIFY = "verify-register-login-otp";
export const REFRESH_TOKEN = "/auth/refresh_tokens";

//Post method
export const ADD_CART = "cart-store"
export const UPDATE_CART = "cart-update"

//Delete method
export const DELETE_CART = "cart-delete"

export const WISHLIST = "user/wishlists?"
// export const WISHLIST = () => {
//     const locale = getLocale();
//     return `user/wishlists?lang=${locale}`;
//   };

export const ALL_ADDRESSES = "user/shipping-addresses"
export const ADD_ADDRESS = "user/shipping-addresses"
export const EDIT_ADDRESS = ""
export const DELETE_ADDRESS = "user/delete-shipping-addresses"
export const DEFAULT_ADDRESS = "default/user-address/shipping"

export const ALL_ORDERS ="user/orders"
export const TRACK_ORDER ="user/track-order"
export const TRACK_STATUS ="user/courier-track"
export const CANCEL_ORDER="user/cancel-order?id="
export const RETURN_ORDER="user/return-order?id="
export const ORDER_INVOICE="user/order-invoice"
export const ORDER_PRODUCT_CANCEL="user/order-product-cancel" 
export const ORDER_PRODUCT_RETURN="user/order-product-return"
export const ORDER_STATUS="user/orders?delivery_status="
export const RETURN_ORDER_LIST="user/returns?page="
export const REFUND_ORDER_LIST="user/refunds?page="

export const ADD_WISHLIST ="user/add-to-wishlist"
export const REMOVE_WISHLIST ="user/remove-wishlist-product"

export const UPDATE_PROFILE ="user/update-profile"
export const PROFILE_DETAILS ="user/profile"
export const EMAIL_PHONE_OTP ="user/change-email-phone"
export const UPDATE_EMAIL_PHONE ="user/update-email-phone"

export const COUNTRY_LIST = "get/country-list"
export const CITY_BY_STATE = "city/by-state"
export const STATE_BY_COUNTRY = "state/by-country" 

export const CONFIRM_ORDER ="user/confirm-order"
export const COD_ORDER ="user/complete-order"
export const TABBY_CHECKOUT = "tabby/pay"
export const TAMARA_CHECKOUT = "tamara/pay"
export const NGENIUS_CHECKOUT = "ngenius/pay"

export const COUPON_APPLY ="apply-coupon"
export const GET_COUPONS="user/coupons"
export const COUPON_REMOVE ="user/coupon-delete"
export const APPLIED_COUPON="applied-coupons"


export const SEARCH = "search/product"  

export const ORDER_CHECKOUT ="user/order-details"
export const MOYASAR_REDIRECT ="moyasar/redirect/complete"


export const GLOBAL ="system-data?lang="
export const STORE_DATA ="store-data?lang="
export const SITE_MAP ="site-map"
export const CMS ="home/others-page"
export const FOOTER_DATA ="footer-data"

export const SOCIAL_LOGIN="social-login"
export const BUY_NOW="user/buy-now"
export const CONTACT="save-contactus"

export const BLOG="blogs"