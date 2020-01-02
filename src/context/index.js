import React from 'react';
export const label = {
    MBAFC: {
        name: 'MBAFC',
        contractChop: <p>
            <b>MBAFC</b> Contract Chop is only used for <b>Mortgage Loan Contract</b> and <b>Mortgage Filling Business</b>.
           For any other contracts (e.g. purchase orders/release orders) and agreements, please select company chop.
            </p> 
      },
    MBIA: {
        name: 'MBIA',
        contractChop: <p>
            <b>MBIA</b> Contract Chop hasn’t been initiated to be used yet. Please select <b>Company Chop</b> 
            for PO/RO/Contract/Agreement.
        </p>
    },
    MBLC: {
        name: 'MBLC',
        contractChop:<p>
            <b>MBLC</b> Contract Chop is only used for <b>Finance Lease and Guarantee Contract and Mortgage Contract and Mortgage 
            Filling Business</b> For any other contracts (e.g. purchase orders/release orders) and agreements, please select company chop.
        </p>
    },
    DMT: {
        name: 'DMT',
        contractChop:<p>
            <b>DMT</b> China Contract Chop hasn’t been initiated to be used yet. Please select<b>Company Chop</b>
            for PO/RO/Contract/Agreement.
        </p>
    },

};

const LegalEntity = React.createContext(label.name);
export default LegalEntity;