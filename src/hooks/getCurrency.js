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
            currency = 'SAR'; 
            break;
        case 'AE':
            currency = 'AED'; 
            break;
        default:
            currency = 'SAR'; 
    }

    return currency;
};

export default getCurrency;
