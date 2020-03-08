//Daimler Staging OpenId client
const scope ="openid"
const client_id="812da7d2-b74a-484d-82a3-d30ff8ae6f9c"
const client_secret="5dd084f6-d9da-452a-86ee-45a6d301439f"
const redirect_uri="https%3A%2F%2Fdocms.es.corpintra.net%2Fclwf%2Flogin%3Fauthhandler%3DDaimler_OpenID"
const pathname=`https://sso-int.daimler.com/as/authorization.oauth2?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`

//Daimler Production OpenId client
// const scope ="openid"
// const client_id="9eb69a21-65b0-4182-bc1e-0696f0efc294"
// const client_secret="d4ca3fd2-cd88-480c-b47d-203f5e80c641"
// const redirect_uri="https%3A%2F%2Fdocms.es.corpintra.net%2Fclwf%2Flogin%3Fauthhandler%3DDaimler_OpenID"
// const pathname=`https://sso-int.daimler.com/as/authorization.oauth2?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`

export default {
    //LOCAL-DEV API
    url: "http://192.168.1.47/echopx/api/v1", 
    
    //DAIMLER API
    // url: "https://docms.es.corpintra.net/clwfb/api/v1", 
    
    openid: pathname,
    allowedExtension: ["jpg", "png", "xls", "xlsm", "xlsx", "msg", "jpeg", "txt", "rtf", "tiff", "tif", "doc", "docx", "pdf", "pdfx", "bmp"]
  };

  // const dev = {
  //   url: "http://192.168.1.47/echopx/api/v1"
  //   }

  // const staging = {
  //   url: "https://docms.es.corpintra.net/clwfb/api/v1"
  //   }

  // const config = process.env.REACT_APP_STAGE === 'production'
  // ? staging
  // : dev

  // export default {...config};
