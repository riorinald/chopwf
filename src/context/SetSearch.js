import React from 'react';
let searchState = {
    searchOption: {
        requestNum:""
    }
}

const SetSearch = React.createContext(searchState);
export default SetSearch;