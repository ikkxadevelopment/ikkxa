import { ORDER_INVOICE } from "@/constants/apiRoutes";
import { axiosPostBlob } from "@/lib/getHome";
import { useLocale } from "next-intl";
import { MdArrowBack } from "react-icons/md";

export default function DownloadInvoice({ id }) {
  const lang = useLocale()

  const handleDownload = async () => {
    try {
      const response = await axiosPostBlob(`${ORDER_INVOICE}/${id}`,null, lang);
      const blob = response; 
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `IKXXA-${id}.pdf`; 
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url); 
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };
  return (
    <button
      onClick={handleDownload}
      className="text-center text-black text-sm font-medium px-3 py-1.5 rounded-sm border border-black"
    >
     Download Invoice
    </button>
  );
}
