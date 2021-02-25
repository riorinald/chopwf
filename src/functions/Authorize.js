
import Cookies from 'universal-cookie';

const cookies = new Cookies();


const getCookies = () => {
		let userInfo = {}
		if (cookies.get('userInfo', {path:'/'})){
				userInfo = cookies.get('userInfo', {path:'/'})
				return userInfo
		} else {
				window.location.replace('./authenticated?session=expired')
		}
	}

const setCookies = (data) => {
		let minutes = 720 //set Expired in minutes
		let expiredIn = new Date()
		expiredIn.setTime(expiredIn.getTime() + (minutes*60*1000));
		// console.log('SET COOKIE EXP', expiredIn)
		cookies.set('userInfo', data, { path:'/', expires: expiredIn });
	}

const setCookie = (name, data, minutes) => {
	let expiredIn = new Date()
	expiredIn.setTime(expiredIn.getTime() + (minutes*60*1000));
	cookies.set(name, data, { path:'/', expires: expiredIn });
}

const getCookie = (name) => {
	return cookies.get(name, {path:'/'})
}

const delCookie = (name) => {
	cookies.remove(name,{path:'/'})
}
	
const check = (legalEntity, adminEntity) => {
		let isAdmin = false
		// for (let i = 0; i < adminEntity.length; i++) {
		// 	if (adminEntity[i] === legalEntity) {
		// 		isAdmin = true
		// 		console.log('authorized', isAdmin, legalEntity, adminEntity)
		// 	}
		// 	else {
		// 		isAdmin = false
		// 		console.log('Unauthorized', isAdmin, legalEntity, adminEntity)
		// 	}
		// }
		isAdmin = (adminEntity.indexOf(legalEntity) > -1);
		return isAdmin
	}

const Authorize = ({getCookies, setCookies, check, setCookie, getCookie, delCookie})

export default Authorize;