import React from 'react';
import {Redirect} from 'react-router-dom';
import LegalEntity from '../../context';
import Create from './Create';


const RedirectCreate = (props) => { 
  return <LegalEntity.Consumer>{
    ContextValue => (
        // props.history.push(`/create/${ContextValue.legalEntity.name}/`)
        <Redirect to={`/create/${ContextValue.legalEntity.name}`} />
      )}
  </LegalEntity.Consumer>
} 

export default RedirectCreate;