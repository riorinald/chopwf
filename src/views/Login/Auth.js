import React, { Component,useEffect } from 'react';
import LegalEntity from '../../context';
import axios from 'axios';
import { Redirect,NavLink } from 'react-router-dom';
import { fakeAuth } from '../../App';
import config from '../../config';

const Authenticated = (props) => { 
  
  useEffect(() => {
    localStorage.setItem('authenticate', true)
    localStorage.setItem('authType', "REQUESTOR")
    localStorage.setItem('application', "CHOP")
    localStorage.setItem('legalEntity', 'MBAFC')
    localStorage.setItem('userId', "abby@otds.admin")
    localStorage.setItem('token', props.location.hash)
    });

    return <>
    <span>you are authenticated</span>
    <span>Redirecting . . .</span>
    <Redirect wait={1000} to={`/create`} />
    </>
  }
  
  export default Authenticated;