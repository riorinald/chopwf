import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import { Redirect } from 'react-router-dom'
import Axios from 'axios';
import config from '../../../config';
import {
  DetailSTU,
  DetailLTU,
  DetailLTI,
  DetailCNIPS,

} from '../Details';
import Swal from 'sweetalert2';
import { resetMounted } from '../MyPendingTasks'



class Detail extends Component {

  constructor(props) {
    super(props)
    this.state = {
      redirectToTasks: false,
      showModal: false,
      taskDetails: null,
    }
    this.getTaskDetails = this.getTaskDetails.bind(this);
    this.approve = this.approve.bind(this)
    this.toggleView = this.toggleView.bind(this);
    this.redirect = this.redirect.bind(this);
  }

  componentDidMount() {
    if (this.props.location.state !== undefined) {
      this.getTaskDetails(this.props.location.state.id)
      // console.log(this.props.location.state.id)
    }
    else {
      this.setState({ redirectToTasks: true })
    }
  }

  async getTaskDetails(id) {
    let userId = localStorage.getItem('userId')
    // let userId = "josh@otds.admin"
    const res = await Axios.get(`${config.url}/tasks/${id}?userid=${userId}`)
    await this.setState({ taskDetails: res.data })
  }

  convertDate(dateValue) {
    let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3')
    return regEx
  }

  approve(action) {
    let userId = localStorage.getItem('userId')
    // let userId = "josh@otds.admin"
    try {
      Axios.post(`${config.url}/tasks/${this.props.location.state.id}/?action=${action}&userid=${userId}`)
        .then(res => {
          Swal.fire({
            title: res.data.message === "The task successfully approved." ? "APPROVED" : "REJECTED",
            html: res.data.message,
            type: "success"
          }).then((result) => {
            if (result.value) {
              this.setState({ redirectToTasks: true })
              resetMounted.setMounted()
            }
          })
        })
    } catch (error) {
      console.log(error)
    }

  }

  toggleView() {
    this.setState({ showModal: !this.state.showModal })
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  redirect() {
    this.setState({ redirectToTasks: true })
  }

  checkDetail() {
    if (this.state.taskDetails) {
      switch (this.props.location.state.appTypeId) {
        case 'STU':
          return <DetailSTU
            legalName={this.props.legalName}
            taskDetail={this.state.taskDetails}
            approve={this.approve}
            showModal={this.state.showModal}
            toggleView={this.toggleView}
            capitalize={this.capitalize}
            redirect={this.redirect} />
            ;
        case 'LTU':
          return <DetailLTU
            legalName={this.props.legalName}
            taskDetail={this.state.taskDetails}
            approve={this.approve}
            showModal={this.state.showModal}
            toggleView={this.toggleView}
            redirect={this.redirect}
            capitalize={this.capitalize} />
            ;
        case 'LTI':
          return <DetailLTI
            legalName={this.props.legalName}
            taskDetail={this.state.taskDetails}
            approve={this.approve}
            showModal={this.state.showModal}
            toggleView={this.toggleView}
            redirect={this.redirect}
            capitalize={this.capitalize} />
            ;
        case 'CNIPS':
          return <DetailCNIPS
            legalName={this.props.legalName}
            taskDetail={this.state.taskDetails}
            approve={this.approve}
            showModal={this.state.showModal}
            toggleView={this.toggleView}
            redirect={this.redirect}
            capitalize={this.capitalize} />
            ;
        default:
          return <p><kbd>{this.props.match.params.id}</kbd> Not Exist </p>
      }
    }
  }

  render() {
    // console.log(this.checkDetail());
    return (
      <div className="animated fadeIn">
        {this.state.redirectToTasks
          ? <Redirect to='/mypendingtask' />
          :
          <Card>
            <CardBody>
              {this.checkDetail()}
            </CardBody>
          </Card>
        }

      </div>
    )
  }
}

export default Detail;