import { useRecoilState } from "recoil";
import { selectedVariantState } from "@/recoil/atoms";


export default function useProductCard (){
    const [selectedVariant, setSelectedVariant] = useRecoilState(selectedVariantState);

    const selectVariant = (productID, variant, stock, variantId = null) => {
      setSelectedVariant((prevSelectedVariant) => {
        // Check if the product already exists in the state
        const existingProductIndex = prevSelectedVariant.findIndex(
          (item) => item.productID === productID
        );
    
        if (existingProductIndex !== -1) {
          // The product exists, check if the variant already exists
          const existingProduct = prevSelectedVariant[existingProductIndex];
          
          if (existingProduct.variant === variant) {
            // If the variant already exists, do nothing
            return prevSelectedVariant;
          } else {
            // If the variant is different, update the existing product's variant
            const updatedProduct = {
              productID,
              variant,
              stock,
              variantId,
            };
    
            // Replace the old product entry with the updated product entry
            const updatedProductList = [
              ...prevSelectedVariant.slice(0, existingProductIndex),
              updatedProduct,
              ...prevSelectedVariant.slice(existingProductIndex + 1),
            ];
    
            return updatedProductList;
          }
        } else {
          // The product doesn't exist, add it as a new entry
          return [
            ...prevSelectedVariant,
            {
              productID,
              variant,
              stock,
              variantId,
            },
          ];
        }
      });
    };

    const stockFromVariant = (data, value) => {
      const foundStock = data.find(item => item.stock_variant === value);
      // Get the current_stock value if found, otherwise return null or a default value
      const currentStock = foundStock ? foundStock.current_stock : null;
      const variantId = foundStock ? foundStock.variant_id : null;

      return {currentStock, variantId}
    }

    const stockFromVariantForDetailPage = (data, value) => {
      // console.log("stockFromVariant=====>",data);
      
      const foundStock = data.find(item => item.name === value);
      // Get the current_stock value if found, otherwise return null or a default value
      const currentStock = foundStock ? foundStock.current_stock : null;
      const variantId = foundStock ? foundStock.variant_ids : null;

      return {currentStock, variantId}
    }


    return {
        selectVariant,
        stockFromVariant,
        stockFromVariantForDetailPage
    }
}