import React, { Component } from 'react';
import {
  Badge,
  Card,
  CardHeader,
  CardBody,
  Progress,
  Col,
  Button,
  Label,
  FormGroup,
  Input,
  Row,
  Collapse
} from 'reactstrap';
import ReactTable from "react-table";
import "react-table/react-table.css"
import Axios from 'axios';
import LicenseApplicationDetail from '../LicenseApplicationDetail/LicenseApplicationDetail';

class LicenseMyApplications extends Component {
    constructor(props) {
        super(props)
        this.state = {
            applications:[],
            applicationDetails:[],
            approvalHistories:[],
            selectedRow:[],
            searchOption:{},
            detailView: false
        }
    }

    componentDidMount(){
        this.getApplications()
    }

    async getApplications() {
        this.setState({ loading: true })
        await Axios.get(`http://5de7307ab1ad690014a4e040.mockapi.io/licenseTask`)
          .then(res => {
            this.setState({ applications: res.data, loading: false })
          })
    }

    async getApplicationDetails(rowId) {
        this.setState({ loading: true })
        await Axios.get(`http://5de7307ab1ad690014a4e040.mockapi.io/licenseTask/${rowId}`)
          .then(res => {
            this.setState({ applicationDetails: res.data, loading: false })
        })
        await Axios.get(`https://5b7aa3bb6b74010014ddb4f6.mockapi.io/application/2e4fb172-1eca-47d2-92fb-51fa4068a4b0/approval`)
            .then(res => {
            this.setState({ approvalHistories: res.data })
        })
    }

    
    getColumnWidth = (accessor, headerText) => {
        let { applications } = this.state
        let max = 0
        const maxWidth = 260;
        const magicSpacing = 10;
            for (var i = 0; i < applications.length; i++) {
            if (applications[i] !== undefined && applications[i][accessor] !== null) {
                if (JSON.stringify(applications[i][accessor] || 'null').length > max) {
                max = JSON.stringify(applications[i][accessor] || 'null').length;
                }
            }
        }
    }

    convertDate(dateValue) {
        let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3')
        return regEx
    }

    handleSearch = name => event => {
        const options = this.state.searchOption
        options[name] = event.target.value
        this.setState(state => {
          const searchOption = options
          return {
            searchOption
          }
        },
          // console.log(this.state.searchOption)\
        )
        this.getApplications()
      }

    render() {
        return (
            <div>
            <h4>My Applications</h4>
            {!this.state.detailView 
            ?
            <Card>
                <CardHeader>MY APPLICATIONS</CardHeader>
                <CardBody>
                <ReactTable
                data={this.state.applications}
                filterable
                onFilteredChange={(filtered, column, value) => {
                  this.setState({ filtered: filtered })
                  this.onFilteredChangeCustom(value, column.id || column.accessor);
                }}
                defaultFilterMethod={(filter, row, column) => {
                  const id = filter.pivotId || filter.id;
                  return row[id]
                }}
                columns={[
                  {
                    Header: "Request Number",
                    accessor: "requestNumber",
                    Cell: this.renderEditable,
                    style: { textAlign: "center" },
                    width: this.getColumnWidth('requestNumber', "Request Number")
                  },
                  {
                    Header: "Licese Name",
                    accessor: "licenseName",
                    Cell: this.renderEditable,
                    width: this.getColumnWidth('licenseName', "Licese Name"),
                    filterMethod: (filter, row) => {
                      return row[filter.id] === filter.value;
                    },
                    Filter: ({ filter, onChange }) => {
                      return (
                        <Input type="select" value={this.state.searchOption} onChange={this.handleSearch('licenseName')} >
                          <option value="">Please Select</option>
                        </Input>

                      )
                    },
                    style: { textAlign: "center" }
                  },
                  {
                    Header: "Document Type",
                    accessor: "documentType",
                    Cell: this.renderEditable,
                    style: { textAlign: "center" },
                    width: this.getColumnWidth('documentType', "Document Type"),
                    filterMethod: (filter, row) => {
                      return row[filter.id] === filter.value;
                    },
                    Filter: ({ filter, onChange }) => {
                      return (
                        <Input type="select" value={this.state.searchOption} onChange={this.handleSearch('documentType')} >
                          <option value="">Please Select</option>
                        </Input>
                      )
                    },
                  },
                  {
                    Header: "Planned Return Date",
                    accessor: "returnDate",
                    width: this.getColumnWidth('returnDate', "Date Return Creation"),
                    Cell: row => (
                      <div> {this.convertDate(row.original.returnDate)} </div>
                    ),
                    style: { textAlign: "center" }
                  },
                  {
                    Header: "Senior Manager or above of Requestor Department",
                    accessor: `seniorManagerAbove`,
                    width: this.getColumnWidth('seniorManagerAbove', "Senior Manager or above of Requestor Department"),
                    Cell: row => (
                      <div> {row.original.seniorManagerAbove} </div>
                    ),
                    style: { textAlign: "center" }
                  },
                  {
                    Header: "Deliver Ways",
                    accessor: "deliverWays",
                    width: this.getColumnWidth('deliverWays', "Deliver Ways"),
                    Cell: this.renderEditable,
                    style: { textAlign: "center" }
                  },
                  {
                    Header: "Express Number",
                    accessor: "expressNumber",
                    width: this.getColumnWidth('expressNumber', "Express Number"),
                    Cell: this.renderEditable,
                    style: { textAlign: "center" }
                  },
                  {
                    Header: "Return Ways",
                    accessor: "returnWays",
                    width: this.getColumnWidth('returnWays', "Return Ways"),
                    Cell: this.renderEditable,
                    style: { textAlign: "center" }
                  }
                ]}
                defaultPageSize={10}
                // pages={this.state.page}
                // manual
                // onPageChange={(e)=>{this.setState({page: e})}}
                // canNextpage={true}
                className="-striped -highlight" 
                loading={this.state.loading}
                getTrProps={(state, rowInfo) => {
                  if (rowInfo && rowInfo.row) {
                    return {
                      onClick: e => {
                        console.log(rowInfo.original, rowInfo)
                        this.getApplicationDetails(rowInfo.original.id)
                        this.setState({ detailView: true})  
                      },                     
                      style: {
                        background:
                          rowInfo.index === this.state.rowEdit ? "#00afec" : "",
                        color:
                          rowInfo.index === this.state.rowEdit ? "white" : "black"
                      },
                    };
                  } else {
                    return {};
                  }
                }}
              />
                </CardBody>
            </Card>
            :
            <LicenseApplicationDetail applications={this.state.applicationDetails} appHistory={this.state.approvalHistories}/>
            }
            </div>
        )
    }

}
export default LicenseMyApplications