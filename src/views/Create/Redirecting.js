import React from 'react';
import {Redirect} from 'react-router-dom';
import LegalEntity from '../../context';


const RedirectCreate = props => { return <LegalEntity.Consumer>
  {ContextValue => (
  <Redirect from="/" to={{ pathname: `/${ContextValue.legalEntity.name}/create` }} />)}
  </LegalEntity.Consumer>
} 

export default RedirectCreate;