"use client"
import Block from "./block";


const WidgetBlocks = ({
  widgets = [],
  // slug,
  
}) => {
  // {
  //   console.log(widgets,"products?.results?.components");
  // }
  const child = widgets.map((widget, i) => (
    
    <Block
      key={i}
      widget={widget}
      // slug={slug}
    />
  ));
  return child;
};

export default WidgetBlocks;
