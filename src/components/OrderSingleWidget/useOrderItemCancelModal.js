import { useState } from 'react';
import { ALL_ORDERS, CANCEL_ORDER, ORDER_PRODUCT_CANCEL, ORDER_PRODUCT_RETURN } from '@/constants/apiRoutes';
import { axiosPostWithToken } from '@/lib/getHome';
import { useToast } from '@/hooks/use-toast';
import { useSWRConfig } from 'swr';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { useLocale } from 'next-intl';

export const useOrderItemCancelModal = (id, orderId, invNo) => {
    const lang = useLocale();
    const [locale, country] = lang.split('-');
    const { toast } = useToast()
    const { mutate } = useSWRConfig();
    const [isOpen, setIsOpen] =  useState(false);
    const [payLoad, setPayload] = useState({
        "order_id": orderId,
        "order_details_id": id,
    });

    const formik = useFormik({
        initialValues: {
          remark: '',
          cancel_reason: '',
        },
        validationSchema: Yup.object({
            remark: Yup.string()
                .required("Remark is required"),
            cancel_reason: Yup.string()
            .required("Cancel Reason is required")
        }),
        onSubmit: (values) => {
            cancelResponse(values); 
        },
    });

    const formikReturn = useFormik({
        initialValues: {
            return_reason: '',
        },
        validationSchema: Yup.object({
            return_reason: Yup.string()
            .required("Return Reason is required")
        }),
        onSubmit: (values) => {
            returnResponse(values); 
        },
    });

    const handleRemark = (value) => {
        formik.setFieldValue("remark",value);
    }

    const handleCancel = (value) => {
        formik.setFieldValue("cancel_reason",value);
    }

    const handleReturn = (value) => {
        formikReturn.setFieldValue("return_reason",value);
    }

    // const cancelResponse = async (id, orderId, invNo) => {
        const cancelResponse = async (values) => {
        const data = {...values, ...payLoad}
            
        try {
            const result = await axiosPostWithToken(`${ORDER_PRODUCT_CANCEL}`, data, lang);
            if(result?.success){
                mutate(`${TRACK_ORDER}?invoice_no=${invNo}&lang=${locale}`)
                setIsOpen(false);
                toast({ 
                    title: response?.message,
                    variant: "success",
                })
            } else {
                setIsOpen(false);
                toast({ 
                    title: 'This item not cancelled please try again',
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error(error);
            setIsOpen(false);
        }
    } 

    const returnResponse = async (values) => {
        const data = {...values, ...payLoad}
            
        try {
            const result = await axiosPostWithToken(`${ORDER_PRODUCT_RETURN}`, data, lang);
            if(result?.success){
                mutate(`${TRACK_ORDER}?invoice_no=${invNo}&lang=${locale}`)
                setIsOpen(false);
                toast({ 
                    title: response?.message,
                    variant: "success",
                })
            } else {
                setIsOpen(false);
                toast({ 
                    title: 'This item not Returned please try again',
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error(error);
            setIsOpen(false);
        }
    } 

    return { 
        cancelResponse,
        setIsOpen,
        isOpen,
        handleRemark,
        handleCancel,
        handleReturn,
        formik,
        formikReturn,
    }
};