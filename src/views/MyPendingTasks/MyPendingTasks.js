import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Table, Col, Row } from 'reactstrap';


class MyPendingTasks extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <div>
                <h4>MY PENDING TASKS</h4>
                <Card>
                    <CardHeader>PENDING TASKS</CardHeader>
                    <CardBody>
                        <Row>
                            <Col sm={1}></Col>
                            <Col >
                                <Table size="sm">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Task Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>#</td>
                                            <td>Search Task Name</td>
                                        </tr>
                                        <tr>
                                            <td>#</td>
                                            <td>Task 1</td>
                                        </tr>
                                        <tr>
                                            <td>#</td>
                                            <td>Task 2</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                            <Col md={8}>
                            </Col>
                        </Row>

                    </CardBody>
                </Card>
            </div>
        )
    }
}
export default MyPendingTasks;
