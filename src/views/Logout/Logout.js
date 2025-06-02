import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { fakeAuth } from '../../App';
import {Card, CardBody, Row, Alert, Button } from 'reactstrap';
import Cookies from 'universal-cookie';
import config from '../../config';

// let timer = 5

// function countDown (){
// 	setInterval(() => {
// 			if(timer !== 0){
// 				timer--
// 				}
// 			}, 1000);
// 		console.log(timer)
// }

const Logout = (props) => {
	let [redirect, setRedirect] = useState(0);
	const cookies = new Cookies();
	const logout = () => setTimeout(setRedirect((redirect-1)),5000)
	
	redirect = 1000
	localStorage.clear()
	cookies.remove('userInfo',{path:'/'})

	fakeAuth.signOut(() => {logout()})
	// console.log(redirect)
		return (<div style={{ backgroundColor: "#2F353A" }}>
		{/* {redirect === 0
		? <Redirect to='/login'/>
		:	<> */}

				<Row className="centerd">
					<Card className="shadow-lg p-3 rounded">
						<CardBody>
							<Alert center color="danger">You have been successfully logged out.</Alert >
							<center>
								<Button className="btn-openid btn-brand" onClick= {event =>  window.location.href = config.openid} >
										<i className="fa fa-openid"></i><span>Click here to login again.</span>
								</Button>
							</center>
							{/* <p className="mb-0"><center>Redirect in {timer}</center></p>  */}
						</CardBody>
					</Card>
				</Row>
			
		{/* </>} */}
		</div>
		
		)}
    
    export default Logout;