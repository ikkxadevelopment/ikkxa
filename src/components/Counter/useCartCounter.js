import { useState } from "react";

export default function useCartCounter() {
    const [count, setCount] = useState({quantity:0, stock:0});

    const updateItem = async (id, quantity) => {
        try {
          if(session?.status === "unauthenticated"){
            setOpenLogin(true)
          } else {
            const res = await updateCartItemQty(id, quantity, authToken);
            if(res.success){
              toast({ 
                title: "Cart item updated",
                variant: "accent",
              })
              return true
            } else{
              toast({ 
                title: "Cart item not updated",
                variant: "destructive",
              })
              return fasle
            }
          }
        } catch (error) {
          console.error(error);
        }
    };

    const increment = (data) => {
    const increasedCount = count?.quantity + 1
    if(count?.stock >= increasedCount){
        console.log(" 1110000=====>",);
        const res = updateItem(data.id,increasedCount)
        if(res){
            setCount({...count, quantity:increasedCount});
        }
    } else {
        setCount({...count})
        console.log(" 00000=====>",);
        
    }
    };

    const decrement = (data) => {
    const decreasedCount = count?.quantity - 1
    const res = updateItem(data.id, decreasedCount)
    if(res){
        setCount(count - 1);
    }
    };

    return { 
    updateItem,
    increment,
    decrement,
    setCount,
    count
    }
}