"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import "./Moyasar.scss";

const MoyasarPage = ({ data }) => {
  const [load, setLoad] = useState(false);
  useEffect(() => {
    const initMoyasar = () => {
      if (typeof Moyasar !== "undefined") {
        Moyasar.init({
          element: ".mysr-form",
          amount: data?.total_payable * 100,
          currency: "SAR",
          description: `moyasar payment with order id ${data?.id}`,
          publishable_api_key: process.env.NEXT_PUBLIC_MOYASAR_PUBLIC_API_KEY,
        //   callback_url: `http://localhost:3000/en`,
          callback_url: `${process.env.NEXT_PUBLIC_API_BASE_URL_SA}moyasar/redirect?order_id=${data?.id}`,
          methods: ["creditcard", "applepay", "stcpay"],
          apple_pay: {
            country: "SA",
            label: `Apple pay with order id ${data?.id}`,
            validate_merchant_url:
              "https://api.moyasar.com/v1/applepay/initiate",
          },
        //   on_completed:`${process.env.NEXT_PUBLIC_BASE_URL}moyasar/redirect/complete`,
        //   on_completed: async function (payment) {
        //     try {
        //         const formData = new FormData();
        //         formData.append("paymentID", payment.id);
        //         formData.append("order_id", "685")
        //         formData.append("status", payment.status);
        //         formData.append("lang", "en");
        //         // formData.append("amount", payment.amount);
        //         // formData.append("currency", payment.currency);
        //         // formData.append("payment_method", JSON.stringify(payment.source));
    
        //         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}moyasar/redirect/complete`, {
        //             method: "POST",
        //             body: formData,
        //         });
    
        //         if (!response.ok) {
        //             throw new Error("Failed to send payment data.");
        //         }
    
        //         const result = await response.json();
        //         console.log("Payment data sent successfully:", result);
        //     } catch (error) {
        //         console.error("Error while sending payment data:", error);
        //     }
        // },
        //   on_completed: (payment) => {
        //     console.log("Payment completed successfully:", payment);
        //   },
          on_failed: (error) => {
            console.error("Payment failed:", error);
          },
        });
      }
    };

    initMoyasar();

    return () => {
      const moyasarElement = document.querySelector(".mysr-form");
      if (moyasarElement) moyasarElement.innerHTML = ""; // Clear form content
    };
  }, [load, data]);

  return (
    <>
      <Script
        src="https://cdn.moyasar.com/mpf/1.14.0/moyasar.js"
        strategy="lazyOnload"
        onLoad={() => {
          setLoad(true);
        }}
      />
      <div className="pt-4">
        <div className="mysr-form"></div>
      </div>
    </>
  );
};

export default MoyasarPage;


