//Daimler STAGING OpenId client
// const scope ="openid"
// const domainName = "https://sso-int.daimler.com/"
// const client_id="812da7d2-b74a-484d-82a3-d30ff8ae6f9c"
// const client_secret="5dd084f6-d9da-452a-86ee-45a6d301439f"
// const clientBase64= "ODEyZGE3ZDItYjc0YS00ODRkLTgyYTMtZDMwZmY4YWU2ZjljOjVkZDA4NGY2LWQ5ZGEtNDUyYS04NmVlLTQ1YTZkMzAxNDM5Zg=="
// const redirectURI="https%3A%2F%2Fdocms.es.corpintra.net%2Fclwf%2Flogin%3Fauthhandler%3DDaimler_OpenID"
// const pathname=`${domainName}/as/authorization.oauth2?response_type=code&client_id=${client_id}&redirect_uri=${redirectURI}&scope=${scope}`

//Daimler PRODUCTION OpenId client
const scope ="openid"
const domainName = "https://sso.daimler.com"
const client_id= "e986adf8-e9c3-496f-a2d1-bc3e25044449"
const client_secret= "da1c2da8-3d13-405b-b085-5a125a868e68"
const clientBase64= "ZTk4NmFkZjgtZTljMy00OTZmLWEyZDEtYmMzZTI1MDQ0NDQ5OmRhMWMyZGE4LTNkMTMtNDA1Yi1iMDg1LTVhMTI1YTg2OGU2OA=="
const redirectURI="https%3A%2F%2Fndocms.es.corpintra.net%2Fclwf%2Flogin%3Fauthhandler%3DDaimler_OpenID"
const pathname=`${domainName}/as/authorization.oauth2?response_type=code&client_id=${client_id}&redirect_uri=${redirectURI}&scope=${scope}`

export default {
    //LOCAL-DEV API
    // url: "http://192.168.1.47/echopx/api/v1", 
    
    // DAIMLER STAGING API
    // url: "https://docms.es.corpintra.net/clwfb/api/v1",
    // domain: "https://docms.es.corpintra.net",
    
    //DAIMLER PRODUCTION API
    url: "https://ndocms.es.corpintra.net/clwfb/api/v1",
    domain: "https://ndocms.es.corpintra.net",

    OAdomain: domainName,
    redirectURI: redirectURI,
    clientBase64: clientBase64, 
    openid: pathname,
    allowedExtension: ["jpg", "png", "xls", "xlsm", "xlsx", "msg", "jpeg", "txt", "rtf", "tiff", "tif", "doc", "docx", "pdf", "pdfx", "bmp"]
  };

