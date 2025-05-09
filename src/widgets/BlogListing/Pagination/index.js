"use client"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
export default function Pagination({ page, setPage, pageCount }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const handlePagination = (term) => {
        const params = new URLSearchParams(searchParams);
        setPage(term);
        if (term) {
            params.set("page", term);
        } else {
            params.delete("page");
        }
        replace(`${pathname}?${params.toString()}`);
        window.scrollTo(0, 500)
    };
    return (
        <div>
            <div className='d-flex justify-content-center mt-4 mt-lg-5'>
                <nav aria-label="Page navigation example" >
                    <ul className={`pagination `}>
                        <li className={`page-item  ${Number(page) === 1 && "disabled bg-transparent"}`}><button className='page-link border-0' onClick={() => { handlePagination(Number(page) - 1) }} disabled={Number(page) === 1}>
                            <MdKeyboardArrowLeft />
                        </button></li>
                        {Array.from({ length: pageCount }, (_, index) => {
                            return (<li key={index} className={`page-item  ${Number(page) === (index + 1) ? "active" : ""}`}><button className='page-link title-md fw-600 rounded-pill  border-0' disabled={Number(page) === (index + 1)} onClick={() => { handlePagination(index + 1) }}>{index + 1}</button></li>);
                        })}
                        <li className={`page-item ${Number(page) === pageCount && "disabled  bg-transparent"}`}>
                            <button className={`page-link border-0`} onClick={() => { handlePagination(page + 1) }} disabled={Number(page) === pageCount}>
                                <MdKeyboardArrowRight />
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

