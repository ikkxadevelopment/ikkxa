"use client"
import { Slider } from "@/components/ui/slider"

export function RangeSlider() {
  return (
    (<div className="flex items-center justify-center w-full">
      <Slider defaultValue={[25, 75]} max={100} step={1} className="w-full" range />
    </div>)
  );
}
