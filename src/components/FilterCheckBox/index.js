"use client"
import { Checkbox } from "../ui/checkbox";
export default function FilterCheckBox({data, handleAttributeChange, isFilterChecked}) {
    return (
        <div className="border-b  pt-5 pb-3">
            <h2 className="text-base font-semibold mb-4">{data?.title}</h2>
            {data?.attribute_value?.map((item, i)=>{
                return(
                    <div className="flex items-center space-x-2 mb-[18px]" key={i}>
                    <Checkbox id={item?.id} onCheckedChange={()=>handleAttributeChange('attribute_value_id',item?.id)} defaultChecked={isFilterChecked(item?.id)}/>
                    <label htmlFor={item?.id}  className="text-sm  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{item?.value}
                        {/* <span className="text-black opacity-50">(64)</span> */}
                        </label>
                </div>
                )
            })}
        </div>
    )
}