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
    DMT: {
        name: 'DMT'
    },

};

const LegalEntity = React.createContext(label.name);
export default LegalEntity;