"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from "react";
import { axiosPostWithToken } from "@/lib/getHome";
import { SEARCH } from "@/constants/apiRoutes";
import { useLocale } from "next-intl";

export const useSearch = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = useLocale();
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState(searchParams.get("q") || "");
  const [isOpen, setIsOpen] = useState(false);

  const fetchSuggestions = async (term) => {
    if (term.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const values = {
        key: term,
      };

      const response = await axiosPostWithToken(`${SEARCH}`, values, lang);
      if (response?.status) {
        const data = response?.results?.products;
        setSuggestions(data || []);
      } else {
        console.error("Failed to fetch suggestions");
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleSearch = useDebouncedCallback((term) => {
    fetchSuggestions(term);
  }, 300);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    handleSearch(value);
   
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("q", inputValue.trim());
      router.push(`/search?${params.toString()}`);
      setSuggestions([])
      if(isOpen) {
        setIsOpen(false)
      }
      
    }
   
  };



  return {
    handleSubmit,
    handleInputChange,
    suggestions,
    setSuggestions,
    setInputValue,
    inputValue,
    isOpen, setIsOpen
  };
};
