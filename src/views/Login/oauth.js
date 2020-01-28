import React from 'react';
import {Redirect} from 'react-router-dom';


const scope ="openid"
const client_id="812da7d2-b74a-484d-82a3-d30ff8ae6f9c"
const client_secret="5dd084f6-d9da-452a-86ee-45a6d301439f"
const redirect_uri="https%3A%2F%2Fdocms.es.corpintra.net%2Fclwf%2Flogin%3Fauthhandler%3DDaimler_OpenID"
const pathname=`https://sso-int.daimler.com/as/authorization.oauth2?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`


const Oauth = (props) => {  
console.log('redirect')
  return <>{window.location.replace(pathname)}
  </>
} 

export default Oauth;