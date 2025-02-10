import nookies from 'nookies';

const getBaseUrl = (countryCode) => {
    // const cookies = nookies.get(null); 
    // const locale = cookies['NEXT_LOCALE']; 

    // if (!locale) {
    //     console.warn('NEXT_LOCALE cookie not found!');
    //     return null;
    // }

    // const country = locale.split('-')[1]; 
    let base_url;

    switch (countryCode) {
        case 'SA':
            base_url = process.env.NEXT_PUBLIC_API_BASE_URL_SA; 
            break;
        case 'AE':
            base_url = process.env.NEXT_PUBLIC_API_BASE_URL_AE; 
            break;
        default:
            base_url = process.env.NEXT_PUBLIC_API_BASE_URL_SA; 
    }

    return base_url;
};

export default getBaseUrl;
