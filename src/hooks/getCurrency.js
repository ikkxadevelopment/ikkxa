import Dirham from '@/components/Dirham';
import nookies from 'nookies';

const getCurrency = () => {
    const cookies = nookies.get(null); 
    const locale = cookies['NEXT_LOCALE']; 

    if (!locale) {
        console.warn('NEXT_LOCALE cookie not found!');
        return null;
    }

    const country = locale.split('-')[1]; 
    let currency;

    switch (country) {
        case 'SA':
            currency = <i className="icon-riyal "></i>; 
            break;
        case 'AE':
            currency =  <span className='inline-block me-0.5'><Dirham className="text-[12px]"/></span>; 
            break;
        default:
            currency = <i className="icon-riyal "></i>; 
    }

    return currency;
};

export default getCurrency;
