import React from 'react';
export const label = {
    MBAFC: {
        name: 'MBAFC'
    },
    MBIA: {
        name: 'MBIA'
    },
    MBLC: {
        name: 'MBLC'
    },
    CAR2GO: {
        name: 'CAR2GO'
    },

};

const LegalEntity = React.createContext(label.name);
export default LegalEntity;