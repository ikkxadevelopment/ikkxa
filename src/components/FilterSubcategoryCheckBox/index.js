"use client"
import { useTranslations } from "next-intl";
import { Checkbox } from "../ui/checkbox";
export default function FilterSubcategoryCheckBox({data, handleAttributeChange, isFilterChecked}) {
  const t = useTranslations("Index");
    return (
        <div className="border-b  pt-5 pb-3">
            <h2 className="text-base font-semibold mb-4">{t('SubCategories')}</h2>
            {data?.child_category?.map((item, i)=>{
                return(
                    <div className="flex items-center space-x-2 mb-[18px]" key={i}>
                    <Checkbox id={item?.id} onCheckedChange={()=>handleAttributeChange('child_category',item?.id)} defaultChecked={isFilterChecked(item?.id)}/>
                    <label htmlFor={item?.id}  className="text-sm  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{item?.title} <span className="text-black opacity-50">({item?.total_products})</span></label>
                </div>
                )
            })}
        </div>
    )
}