import React from 'react';
import {Redirect} from 'react-router-dom';
import LegalEntity from '../../context';


const RedirectCreate = (props) => { 
  return <LegalEntity.Consumer>{
    ContextValue => (
        props.history.push(`/create/${ContextValue.legalEntity.name}/`)
      )}
  </LegalEntity.Consumer>
} 

export default RedirectCreate;