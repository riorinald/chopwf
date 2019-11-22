import React from 'react';
import {withRouter, Redirect} from 'react-router-dom';
import LegalEntity from '../../context';


const RedirectCreate = () => { return <LegalEntity.Consumer>
  {ContextValue => (
  <Redirect from="/" to= {`${ContextValue.legalEntity.name}/create`} />
  )}
  </LegalEntity.Consumer>
} 

export default RedirectCreate;