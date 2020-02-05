
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
		let expiredIn = new Date
		expiredIn.setTime(expiredIn.getTime() + (minutes*60*1000));
		console.log('SET COOKIE EXP', expiredIn)
		cookies.set('userInfo', data, { path:'/', expires: expiredIn });
	}

const check = (legalEntity, adminEntity) => {
		let isAdmin = false
		for (let i = 0; i < adminEntity.length; i++) {
			if (adminEntity[i] === legalEntity) {
				console.log('authorized')
				isAdmin = true
				return isAdmin
			}
			else {
				console.log('Unauthorized')
				isAdmin = false
				return isAdmin 
			}
		}
	}

const Authorize = ({getCookies, setCookies, check})

export default Authorize;