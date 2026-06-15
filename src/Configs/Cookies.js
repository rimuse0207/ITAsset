import { Cookies } from 'react-cookie';

export const getCookie = name => {
    const cookies = new Cookies();
    return cookies.get(name);
};

export const setCookie = (name, value, options) => {
    const cookies = new Cookies();
    return cookies.set(name, value, { ...options });
};

export const removeCookie = (name, options) => {
    const cookies = new Cookies();
    return cookies.remove(name, { ...options });
};
