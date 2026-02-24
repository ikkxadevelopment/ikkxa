import useSWR, { mutate, useSWRConfig } from 'swr';
import { useRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { loginIsOpen, cartCountState, cartState, selectedVariantState, errorMessageProductCard, trax_id } from "@/recoil/atoms";
import { addCartItem, addToWishlist, removeCartItem, updateCartItemQty } from '@/lib/getHome';
import { useSession } from 'next-auth/react';
import { ADD_CART, ADD_WISHLIST, GET_CART } from '@/constants/apiRoutes';
import axios from 'axios';
import { apiFetcher } from '@/utils/fetcher';
import { fetcherWithToken } from "@/utils/fetcher";
import { useLocale, useTranslations } from 'next-intl';
import useGetDeviceType from '@/hooks/useGetDeviceType';
import { trackAddToCart } from '@/lib/metaPixel';

export const useCartWidget = () => {
  const session = useSession();
  const t = useTranslations("Index");
  const authToken = session?.data?.accessToken
  const { toast } = useToast()
  // const { data, error } = useSWR('/api/cart', fetcher);
  const [cart, setCart] = useRecoilState(cartState);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessages, setErrorMessages] = useRecoilState(errorMessageProductCard);
  const [selectedVariant, setSelectedVariant] = useRecoilState(selectedVariantState);

  const [variantOpen, setIsVariantOpen] = useState(false)


  const [openLogin, setOpenLogin] = useRecoilState(loginIsOpen);
  const [cartCount, setCartCount] = useRecoilState(cartCountState);
  const { mutate } = useSWRConfig();

  const { width } = useGetDeviceType();

  const lang = useLocale();
  const [locale, country] = lang.split('-');
  const getPostOptions = (method, token = null) => {
    const options = {
      method: method, //['POST' or 'PUT' or 'GET' or 'DELETE' ]
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Only add the Authorization header if the token is provided
    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    return options;
  };

  const fetchTrxId = () => {
    let trxId = null;
    const guestToken = localStorage.getItem("guestToken");
    if (session?.status === "unauthenticated") {
      if (!guestToken) {
        trxId = null;
      } else {
        trxId = guestToken;
      }
    } else if (session?.status === "authenticated") {
      trxId = null;
    }
    return trxId;
  }

  const getVariantByProductID = (productID) => {
    const product = selectedVariant.find(item => item.productID === productID);
    return product ? product.variant : null;
  }

  const findProductInSelectedVariant = (productId) => {
    return selectedVariant?.find(item => item.productID === productId);
  };


  const findProductInCart = (productId, variant) => {
    // Ensure cart is defined and is an array
    if (!Array.isArray(cart)) {
      console.error('cartState is not an array:', cart); // Debugging line
      return null; // or false
    }

    // Find the product in the cart
    const product = cart.find(item => item.product_id === productId && item.variant === variant);

    // Return the found product or null if not found
    return product || null; // or return false;
  };

  const isStockAvailable = (cartProduct, selectedProduct) => {
    return cartProduct.quantity < selectedProduct.stock;
  };

  const addCartItem = async (id, quantity, token, variant, variants_ids = null, trx_id) => {
    const formData = {
      'product_id': id,
      'quantity': quantity,
      'token': true,
      "trx_id": trx_id,
      'variants_name': variant,
      'variants_ids': variants_ids
    }
    const url = `${ADD_CART}`;
    const postOptions = getPostOptions("POST", token); // Token is needed
    const data = await apiFetcher(url, formData, postOptions, country);
    // await mutate(`${GET_CART}lang=${locale}&token=true`); 
    return data;
  }

  const addItem = async (item, variant = null, variant_id = null, count = 1) => {
    setIsLoading(true)
    try {
      let trxId = fetchTrxId()
      const res = await addCartItem(item, count, authToken, variant, variant_id, trxId);
      if (res.success) {
        trackAddToCart({
          content_name: item?.name,
          content_ids: [item?.id],
          content_type: 'product',
          value: item?.price,
          currency: item?.currency,
        });
        if (session?.status === "unauthenticated" && !trxId && res.data?.trx_id) {
          localStorage.setItem("guestToken", res.data.trx_id);
          console.log(item, "asasfee");




          mutate(`${GET_CART}lang=${locale}&trx_id=${res.data?.trx_id}`);
        } else {
          mutate(`${GET_CART}lang=${locale}&trx_id=${trxId}`);
        }



        setCartCount(cartCount + count)
        setIsOpen(true);
        if (width < 992) {
          setSelectedVariant([])
          setIsVariantOpen(false)
        }
        setErrorMessages({})
      } else {
        handleOutOfStock()
      }
      // }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false)
    }
  };


  const handleOutOfStock = () => {
    // Clear selected variants and error messages for small screens
    if (width < 992) {
      setSelectedVariant([]);
      setErrorMessages({});
      setIsVariantOpen(false)
    }

    toast({
      variant: "destructive",
      description: `${t("ProductIsOutOfStock")}`,
    });
  };

  const removeItem = async (id) => {
    try {
      let trxId = fetchTrxId()
      const res = await removeCartItem(id, authToken, trxId, country);
      if (res.success) {
        setCartCount(cartCount - 1)
        mutate(`${GET_CART}lang=${locale}&trx_id=${trxId}`);
      }
      toast({
        title: `${t('ItemRemovedFromCart')}`,
        variant: "destructive",
      })
      // }
    } catch (error) {
      console.error(error);
    }
  };

  const updateItem = async (id, quantity, variant) => {
    try {
      let trxId = fetchTrxId()
      const formData = { quantity: quantity, variant: variant, trx_id: trxId }

      const res = await updateCartItemQty(id, formData, authToken, country);
      if (res.success) {
        mutate(`${GET_CART}lang=${locale}&trx_id=${trxId}`)
        toast({
          title: `${t('CartItemUpdated')}`,
          variant: "success",

        })
        return res
      } else {
        toast({
          title: `${t('CartItemNotUpdated')}`,
          variant: "destructive",
        })
        return res
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addToBag = (productId, count) => {
    // Check if the selected variant state has this productId
    const selectedProduct = findProductInSelectedVariant(productId);
    if (!selectedProduct) {
      // Set an error message if no variant is selected
      setErrorMessages({
        [productId]: `${t("PleaseSelectVariant")}`
      });
      return;
    }

    const { variant, variantId } = selectedProduct; // Assuming single variant selection
    // Check if the product with this variant exists in the cart
    const cartProduct = findProductInCart(productId, variant);

    if (cartProduct) {
      if (isStockAvailable(cartProduct, selectedProduct)) {
        addItem(productId, variant, variantId, count);
        // Clear the error message if adding succeeds
        setErrorMessages((prevErrors) => ({
          ...prevErrors,
          [productId]: ""
        }));
      } else {
        // Set an error message for out-of-stock scenario
        setErrorMessages({
          [productId]: `${t("OutOfStockForThisVariant")}`
        });
      }
    } else {
      // Add product to cart if it doesn't exist
      addItem(productId, variant, variantId, count);
      // Clear any previous error message
      setErrorMessages({
        [productId]: ""
      });
    }
  };

  // const handleWishlist = async (id) => {
  //   try {
  //     if(authToken){
  //       console.log(authToken,"authTokenauthTokenauthToken");
  //       const res = await addToWishlist(id, authToken);

  //       console.log(res,"added to wish");
  //       toast({ 
  //         title: "Cart item not removed",
  //         variant: "destructive",
  //         description: "Friday, February 10, 2023 at 5:57 PM",
  //       })
  //     } 
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   // Sync cart from localStorage for guest users
  //   if (!isAuthenticated) {
  //     const savedCart = localStorage.getItem('cart');
  //     if (savedCart) {
  //       setCart(JSON.parse(savedCart));
  //     }
  //   }
  // }, [isAuthenticated, setCart]);

  return {
    cart: cart,
    // isLoading: !error && !data,
    // isError: error,
    addItem,
    removeItem,
    variantOpen, setIsVariantOpen,
    isOpen,
    setIsOpen,
    updateItem,
    isLoading,
    addToBag,
    findProductInSelectedVariant,
    errorMessages,
    getVariantByProductID
  };
};
