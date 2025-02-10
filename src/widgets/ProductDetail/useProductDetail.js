import { useState } from "react";


export const useProductDetail = ({ datas }) => {
    const [count, setCount] = useState(1);
    const [productDetail, setProductDetail] = useState({
        id: null,
        name: "",
        price: datas?.product?.price,
        disPrice: datas?.product?.discount_percentage,
        // disPrice:datas?.product?.price - datas?.product?.special_discount,
        size:"",
        sku: datas?.product?.product_stock?.sku
    });

    return {
        productDetail,
        setProductDetail,
        count, 
        setCount
    };
};
