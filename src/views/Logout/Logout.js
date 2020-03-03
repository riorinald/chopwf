import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { fakeAuth } from '../../App';
import {Card, CardBody, Row, Alert } from 'reactstrap';
import Cookies from 'universal-cookie';

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
	console.log(redirect)
		return (<div style={{ backgroundColor: "#2F353A" }}>
		{/* {redirect === 0
		? <Redirect to='/login'/>
		:	<> */}

				<Row className="centerd">
					<Card className="shadow-lg p-3 rounded">
						<CardBody>
							<Alert color="danger">Successfully Logged out the application.</Alert >
							{/* <p className="mb-0"><center>Redirect in {timer}</center></p>  */}
						</CardBody>
					</Card>
				</Row>
			
		{/* </>} */}
		</div>
		
		)}
    
    export default Logout;