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
      comments: "",
      histories: [],
    }
    this.getTaskDetails = this.getTaskDetails.bind(this);
    this.approve = this.approve.bind(this)
    this.toggleView = this.toggleView.bind(this);
    this.redirect = this.redirect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getApprovalHistories = this.getApprovalHistories.bind(this);
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

  async getApprovalHistories() {
    const response = await Axios.get('http://5b7aa3bb6b74010014ddb4f6.mockapi.io/application/364e425f-bf55-478c-b055-8ef811173aa1/approval')
    this.setState({ histories: response.data })
  }

  async getTaskDetails(id) {
    let userId = localStorage.getItem('userId')
    // let userId = "josh@otds.admin"
    const res = await Axios.get(`${config.url}/tasks/${id}?userid=${userId}`)
    this.setState({ taskDetails: res.data })
    this.getApprovalHistories()

  }

  convertDate(dateValue) {
    let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3')
    return regEx
  }

  tempApprove() {

  }

  approve(action) {

    let data = {
      userId: localStorage.getItem('userId'),
      comments: this.state.comments
    }

    // let userId = "josh@otds.admin"
    try {
      Axios.post(`${config.url}/tasks/${this.props.location.state.id}/${action}`, data, { headers: { 'Content-Type': 'application/json' } })
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

  handleChange(event) {
    this.setState({ comments: event.target.value })
  }

  toggleView() {
    this.setState({ showModal: !this.state.showModal })
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getDeptHeads(heads) {
    let dh = ""
    heads.map(head => {
      dh = dh + head + "; "
    })
    return dh
  }

  redirect() {
    this.setState({ redirectToTasks: true })
  }

  checkDetail() {

    // console.log(this.props.match.params)
    if (this.state.taskDetails) {
      if (this.props.match.params.id !== this.state.taskDetails.applicationTypeId) {
        this.setState({ redirectToTasks: true })
      }
      switch (this.props.match.params.id) {
        case 'STU':
          return <DetailSTU
            legalName={this.props.legalName}
            taskDetail={this.state.taskDetails}
            histories={this.state.histories}
            approve={this.approve}
            showModal={this.state.showModal}
            toggleView={this.toggleView}
            getDeptHeads={this.getDeptHeads}
            capitalize={this.capitalize}
            redirect={this.redirect}
            handleChange={this.handleChange}
            tempApprove={this.tempApprove}
          />
            ;
        case 'LTU':
          return <DetailLTU
            legalName={this.props.legalName}
            taskDetail={this.state.taskDetails}
            approve={this.approve}
            showModal={this.state.showModal}
            toggleView={this.toggleView}
            getDeptHeads={this.getDeptHeads}
            redirect={this.redirect}
            capitalize={this.capitalize}
            handleChange={this.handleChange}
            histories={this.state.histories} />
            ;
        case 'LTI':
          return <DetailLTI
            legalName={this.props.legalName}
            taskDetail={this.state.taskDetails}
            approve={this.approve}
            showModal={this.state.showModal}
            toggleView={this.toggleView}
            redirect={this.redirect}
            getDeptHeads={this.getDeptHeads}
            capitalize={this.capitalize}
            handleChange={this.handleChange}
            histories={this.state.histories} />
            ;
        case 'CNIPS':
          return <DetailCNIPS
            legalName={this.props.legalName}
            taskDetail={this.state.taskDetails}
            approve={this.approve}
            getDeptHeads={this.getDeptHeads}
            showModal={this.state.showModal}
            toggleView={this.toggleView}
            redirect={this.redirect}
            capitalize={this.capitalize}
            handleChange={this.handleChange}
            histories={this.state.histories} />
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