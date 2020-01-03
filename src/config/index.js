// export default {
//     // url: "http://192.168.1.47/echopx/api/v1", //LOCAL-DEV
//     url: "https://docms.es.corpintra.net/clwfb/api/v1", //DAIMLER
//   };

  const dev = {
    url: "http://192.168.1.47/echopx/api/v1"
    }

  const staging = {
    url: "https://docms.es.corpintra.net/clwfb/api/v1"
    }

  const config = process.env.REACT_APP_STAGE === 'production'
  ? staging
  : dev

  export default {...config};