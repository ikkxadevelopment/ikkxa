import { BsGrid, BsHouse, BsBag, BsHeart, BsPerson } from "react-icons/bs";

export function BottomMenu() {
  return (
    <div className="fixed lg:hidden bottom-0 left-0 w-full  bg-white shadow z-50 pt-3 pb-5">
      <div className="container">
        <ul className="flex justify-between">
          <li className="text-[20px] flex justify-center flex-col items-center">
            <span className="mb-[6px]">
              <BsHouse />
            </span>
            <span className="text-xs font-medium leading-none flex text-center">
              Home
            </span>
          </li>
          <li className="text-[20px] flex justify-center flex-col items-center">
          <span className="mb-[6px]">  <BsGrid /></span>
            <span className="text-xs font-medium leading-none flex text-center">
              Categories
            </span>
          </li>
          <li className="text-[20px] flex justify-center flex-col items-center">
          <span className="mb-[6px]"> <BsHeart /></span>
            <span className="text-xs font-medium leading-none flex text-center">
              Wishlist
            </span>
          </li>
          <li className="text-[22px] flex justify-center flex-col items-center">
          <span className="mb-[6px]"> <BsPerson /></span>
            <span className="text-xs font-medium leading-none flex text-center">
              Account
            </span>
          </li>
          <li className="text-[20px] flex justify-center flex-col items-center">
      
        
          <span className="mb-[6px]">   <BsBag /></span>
            <span className="text-xs font-medium leading-none flex text-center">
              Bag
            </span>
          </li>
         
        </ul>
      </div>
    </div>
  );
}
