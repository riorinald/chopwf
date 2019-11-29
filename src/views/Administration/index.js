import React,{Component} from 'react';
import swal from 'sweetalert2';
import Axios from 'axios';
import {
    Col, Row, CustomInput,
    Input, Button, InputGroup,
    FormGroup, Label, Collapse,
    Table, Badge, 
    Modal, ModalBody,
    Card, CardHeader, CardBody, CardFooter
} from 'reactstrap';
import ReactTable from "react-table";
import "react-table/react-table.css"
import selectTableHOC from "react-table/lib/hoc/selectTable";
import qs from 'qs'
import PropTypes from 'prop-types';

const SelectTable = selectTableHOC(ReactTable);

class Administration extends Component {
    constructor(props){
        super(props)
        this.state = {
            notes: '',
            label: '',
            branch:[],
            selectAll: false,
            selection: [],
            editable: false,
            showModal: false,
            accordion: [true, false, false, false]
        }
        this.handleChange = this.handleChange.bind(this);
    }

    static defaultProps = {
        keyField: "id"
      };
    
      static propTypes = {
        keyField: PropTypes.string
      }

    componentDidMount(){
        this.getData();
        this.getBranch();
    }

    getData(){
        Axios.get(`http://5b7aa3bb6b74010014ddb4f6.mockapi.io/config/1`)
        .then (res => {
            this.setState({
                notes : res.data.notes,
                label : res.data.label
            })
        })
    }

    getBranch(){
        Axios.get(`http://5b7aa3bb6b74010014ddb4f6.mockapi.io/config/4`)
        .then (res => {
            this.setState({
                branch : res.data.branchList
            })
        })
    }

    handleChange(event){
        this.setState({
            notes : event.target.value
        })
    }

    toggleModal = () => {
        this.setState({showModal: !this.state.showModal})
    }

    toggleEdit = () => {
        this.setState({editable: !this.state.editable})
    }

    putUpdate = () => {
        // Axios.put(`http://5b7aa3bb6b74010014ddb4f6.mockapi.io/config/1`, qs.stringify(this.state.notes), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        let xhr = new XMLHttpRequest();
        let data= qs.stringify(this.state.notes)
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
              console.log(this.responseText);
            }
          });
        xhr.open("PUT", "http://5b7aa3bb6b74010014ddb4f6.mockapi.io/config/1");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Accept", "*/*");
        xhr.send(data);
        swal.fire({
            title: "Updated",
            timer: 1500,
            type: 'success',
            timerProgressBar: true
        })
        this.setState({editable: !this.state.editable})
    }

    toggleAccordion(tab){
        const prevState = this.state.accordion;
        const state = prevState.map((x, index) => tab === index ? !x : false);
    this.setState({
      accordion: state,
    })
    }

    isSelected = key => {
        return this.state.selection.includes(`select-${key}`);
      };
    
    rowFn = (state, rowInfo, column, instance) => {
    const { selection } = this.state;
    return {
        onClick: (e) => {
        console.log("It was in this row:", rowInfo);
        },
        style: {
        background:
            rowInfo &&
            selection.includes(`select-${rowInfo.original.id}`)
        }
    };
    };

    toggleSelection = (key, shift, row) => {
        // start off with the existing state
        let selection = [...this.state.selection];
        const keyIndex = selection.indexOf(key);
    
        // check to see if the key exists
        if (keyIndex >= 0) {
          // it does exist so we will remove it using destructing
          selection = [
            ...selection.slice(0, keyIndex),
            ...selection.slice(keyIndex + 1)
          ];
        } else {
          // it does not exist so add it
          selection.push(key);
        }
        // update the state
        this.setState({ selection });
      };

      toggleAll = () => {
        const { keyField } = this.props;
        const selectAll = !this.state.selectAll;
        const selection = [];
        const selectedDocs = [];
    
        if (selectAll) {
          // we need to get at the internals of ReactTable
          const wrappedInstance = this.checkboxTable.getWrappedInstance();
          // the 'sortedData' property contains the currently accessible records based on the filter and sort
          const currentRecords = wrappedInstance.getResolvedState().sortedData;
          // we just push all the IDs onto the selection array
          currentRecords.forEach(item => {
            selection.push(`select-${item._original[keyField]}`);
            selectedDocs.push(item._original)
          });
        }
        this.setState({ selectAll, selection, selectedDocs }, console.log(this.state.selectedDocs));
      };

      handleFiles = (files) => {
        // Check for the various File API support.
        if (window.FileReader) {
            // FileReader are supported.
            this.getAsText(files);
        }
    }

    getAsText(fileToRead) {
        var reader = new FileReader();
        var fileToRead = document.querySelector(fileToRead);
        // Read file into memory as UTF-8      
        reader.readAsText(fileToRead);
        // Handle errors load
        reader.onload = this.fileReadingFinished;
        reader.onerror = this.errorHandler;
    }
    
    processData(csv) {
        var allTextLines = csv.split(/\r\n|\n/);
        var lines = allTextLines.map(data => data.split(';'))

        console.log(lines)
    }

    fileReadingFinished(event) {
        var csv = event.target.result;
        this.processData(csv);
    }

    errorHandler(event) {
        if (event.target.error.name === "NotReadableError") {
            alert("Cannot read file!");
        }
    }

    render(){

        return (
            <Card>
                <CardHeader>
                <h3>Administration</h3>
                </CardHeader>
                <CardBody>
                    <Card  className="mb-4">
                        <CardHeader>
                            <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(0)}>
                            <h5 className="m-0 p-0">Create Request</h5>
                        </Button>
                        </CardHeader>
                        <Collapse isOpen={this.state.accordion[0]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                        <CardBody className="px-0 py-3">
                        <Col className="mb-4">
                        <Label>Notes :</Label>
                        <InputGroup>
                        <Input maxLength={500} disabled={!this.state.editable} value={this.state.notes} onChange={(event)=>this.handleChange(event)} placeholder="Enter Notes" type="textarea" rows="5" />
                        </InputGroup>
                        </Col>
                        <Col className="text-right">
                            {this.state.editable 
                            ? <Button color="success" onClick={this.putUpdate}> Update </Button>
                            : <Button color="info" onClick={this.toggleEdit}> Edit </Button>
                            }
                        </Col>                    
                        </CardBody>
                        </Collapse>
                    </Card>
                    <Card  className="mb-4">
                        <CardHeader>
                            <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(2)}>
                            <h5 className="m-0 p-0">branch company chop</h5>
                        </Button>
                        </CardHeader>
                        <Collapse isOpen={this.state.accordion[2]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                        <CardBody>
                        <Col className="text-right mb-2">
                            <Button className="mr-2" onClick={this.toggleModal} color="warning"> Upload CSV </Button>
                            <Button className="mr-2" color="danger"> Delete </Button>
                        </Col>
                        <Col className="mb-4">
                        <SelectTable
                            {...this.props}
                            data={this.state.branch}
                            ref={r => (this.checkboxTable = r)}
                            toggleSelection={this.toggleSelection}
                            selectAll={this.state.selectAll}
                            selectType="checkbox"
                            toggleAll={this.toggleAll}
                            isSelected={this.isSelected}
                            getTrProps={this.rowFn}
                            filterable
                            defaultPageSize={15}
                            columns={[
                                {
                                Header: 'Branch Name',
                                accessor: 'name',
                                style: { textAlign: "left" },
                                }
                            ]}
                            keyField="id"

                            />
                        </Col>
                        </CardBody>
                        </Collapse>
                    </Card>
                    <Card  className="mb-4">
                        <CardHeader>
                            <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(1)}>
                            <h5 className="m-0 p-0">Department</h5>
                        </Button>
                        </CardHeader>
                        <Collapse isOpen={this.state.accordion[1]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                        <CardBody>
                        Department
                        </CardBody>
                        </Collapse>
                    </Card>
                    <Card  className="mb-4">
                        <CardHeader>
                            <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(3)}>
                            <h5 className="m-0 p-0">Entitled Teams</h5>
                        </Button>
                        </CardHeader>
                        <Collapse isOpen={this.state.accordion[3]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                        <CardBody>
                        Teams  
                        </CardBody>
                        </Collapse>
                    </Card>
                    <Modal toggle={this.toggleModal} isOpen={this.state.showModal}>
                        <ModalBody>
                            <Col lg>
                                <input type='file' id="csvInput" accept=".CSV" onChange={ this.handleFiles } />
                            </Col>
                        </ModalBody>
                    </Modal>
                </CardBody>
            </Card>
        )
    }
}

export default Administration ;