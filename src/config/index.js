//Daimler Staging OpenId client
// const scope ="openid"
// const domainName = "https://sso-int.daimler.com/"
// const client_id="812da7d2-b74a-484d-82a3-d30ff8ae6f9c"
// const client_secret="5dd084f6-d9da-452a-86ee-45a6d301439f"
// const clientBase64= "ODEyZGE3ZDItYjc0YS00ODRkLTgyYTMtZDMwZmY4YWU2ZjljOjVkZDA4NGY2LWQ5ZGEtNDUyYS04NmVlLTQ1YTZkMzAxNDM5Zg=="
// const redirect_uri="https%3A%2F%2Fdocms.es.corpintra.net%2Fclwf%2Flogin%3Fauthhandler%3DDaimler_OpenID"
// const pathname=`https://${domainName}/as/authorization.oauth2?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`

//Daimler Production OpenId client
const scope ="openid"
const domainName = "https://sso.daimler.com"
const client_id= "9eb69a21-65b0-4182-bc1e-0696f0efc294"
const client_secret= "d4ca3fd2-cd88-480c-b47d-203f5e80c641"
const clientBase64= "OWViNjlhMjEtNjViMC00MTgyLWJjMWUtMDY5NmYwZWZjMjk0OmQ0Y2EzZmQyLWNkODgtNDgwYy1iNDdkLTIwM2Y1ZTgwYzY0MQ=="
const redirect_uri="https%3A%2F%2Fndocms.es.corpintra.net%2Fclwf%2Flogin%3Fauthhandler%3DDaimler_OpenID"
const pathname=`${domainName}/authorization.oauth2?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`

export default {
    //LOCAL-DEV API
    // url: "http://192.168.1.47/echopx/api/v1", 
    
    //DAIMLER STAGING API
    // url: "https://docms.es.corpintra.net/clwfb/api/v1",
    
    //DAIMLER PROD API
    url: "https://ndocms.es.corpintra.net/clwfb/api/v1",

    OAdomain: domainName,
    clientBase64: clientBase64, 
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
