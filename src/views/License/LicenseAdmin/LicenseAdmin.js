import React, { Component } from 'react';
import {
    Card, CardHeader, CardBody, CardFooter, Button
} from 'reactstrap'

class LicenseAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <div>
                <h4>License Admin</h4>
                <Card>
                    <CardHeader>Administration</CardHeader>
                    <CardBody>

                    </CardBody>
                    <CardFooter>
                        <Button color="success" >Save</Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

}
export default LicenseAdmin