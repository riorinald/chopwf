import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const checkAdmin = {
    isAdmin: false,
    check(legalName, workflow, cb) {
        console.log(legalName)
        let userInfo = cookies.get('userInfo')
        console.log(userInfo)
        let isAdmin = workflow === "CHOP" ? userInfo.chopKeeperCompanyIds : userInfo.licenseAdminCompanyIds
        for (let i = 0; i < isAdmin.length; i++) {
            if (isAdmin[i] === legalName) {
                this.isAdmin = true
                cb()
                break;
            }
            else {
                this.isAdmin = false
                if (i === isAdmin.length - 1)
                    cb()
            }
        }

    }
}

export default checkAdmin;