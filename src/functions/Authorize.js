
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const getCookies = () => {
    let userInfo = {}
    if (cookies.get('userInfo', {path:'clwf'})){
        userInfo = cookies.get('userInfo', {path:'clwf'})
        return userInfo
    } else {
        window.location.replace('./authenticated?session=expired')
    }
}