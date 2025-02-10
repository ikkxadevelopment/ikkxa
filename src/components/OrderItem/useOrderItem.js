import { useState } from 'react';
import { ALL_ORDERS, CANCEL_ORDER, REFUND_ORDER_LIST, RETURN_ORDER, RETURN_ORDER_LIST } from '@/constants/apiRoutes';
import { axiosPostWithToken } from '@/lib/getHome';
import { useToast } from '@/hooks/use-toast';
import { useSWRConfig } from 'swr';
import { useLocale } from 'next-intl';

export const useOrderItem = () => {
    const lang = useLocale();
    const [locale, country] = lang.split('-');
    const { toast } = useToast()
    const { mutate } = useSWRConfig();
    const [isOpen, setIsOpen] =  useState(false);
    const cancelResponse = async (id) => {
        try {
            const result = await axiosPostWithToken(`${CANCEL_ORDER}${id}`, null, lang);
            if(result?.success){
                mutate(`${ALL_ORDERS}${1}&lang=${locale}`)
                mutate(`${RETURN_ORDER_LIST}${1}&lang=${locale}`)   
                mutate(`${REFUND_ORDER_LIST}${1}&lang=${locale}`)
                setIsOpen(false);
                toast({ 
                    title: response?.message,
                    variant: "success",
                })
            } else {
                setIsOpen(false);
                toast({ 
                    title: 'This order not cancelled please try again',
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error(error);
            setIsOpen(false);
        }
    } 

    const returnResponse = async (id) => {
        try {
            const result = await axiosPostWithToken(`${RETURN_ORDER}${id}`, null, lang);
            if(result?.success){
                mutate(`${ALL_ORDERS}${page}&lang=${locale}`)
                mutate(`${RETURN_ORDER_LIST}${page}&lang=${locale}`)   
                mutate(`${REFUND_ORDER_LIST}${page}&lang=${locale}`)
                setIsOpen(false);
                toast({ 
                    title: response?.message,
                    variant: "success",
                })
            } else {
                setIsOpen(false);
                toast({ 
                    title: 'This order not Returned please try again',
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
        returnResponse,
        setIsOpen,
        isOpen,
    }
};