import React from 'react';
import {
    Col,
    Row,
    Input,
    FormGroup,
    Label,
    UncontrolledTooltip,
} from 'reactstrap';
import TextareaAutosize from 'react-autosize-textarea';


const CNIPS = (props) => { 
    return <> 
              <Col className="mb-4">
                    <FormGroup row className="mx-0">
                              <Col lg={2} className="p-2">
                                  <Label>Tel.</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                      <TextareaAutosize className="form-control" disabled value={props.taskDetails.requestorUser.telephoneNum} id="telephoneNum" name="telephoneNum" placeholder="/" />
                                  </Col>
                              <Col lg={2} className="p-2">
                                  <Label>Dept.</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.departmentName} id="departmentName" name="departmentName" placeholder="/" />
                              </Col>
                          
                          
                              <Col lg={2} className="p-2">
                                  <Label>Application Type</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                      <TextareaAutosize className="form-control" disabled value={props.taskDetails.applicationTypeName} id="applicationTypeName" name="applicationTypeName" placeholder="/" />
                                  </Col>
                              <Col lg={2} className="p-2">
                                  <Label>Chop Type</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.chopTypeName} id="chopTypeName" name="chopTypeName" placeholder="/" />
                              </Col>
                          
                          
                              <Col lg={2} className="p-2">
                                  <Label>Purpose of Use</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.purposeOfUse} id="purposeOfUse" name="purposeOfUse" placeholder="/" />
                              </Col>
                              <Col lg={2} className="p-2">
                                  <Label>No. of Pages to Be Chopped </Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.numOfPages} id="numOfPages" name="numOfPages" placeholder="/" />
                              </Col>
                          
                          
                              <Col lg={2} className="p-2">
                                  <Label>Connecting Chop</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.connectChop} id="connectChop" name="connectChop" placeholder="/" />
                              </Col>
                              <Col lg={2} className="p-2">
                                  <Label>Use in Office or not</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.isUseInOffice} id="isUseInOffice" name="isUseInOffice" placeholder="/" />
                              </Col>
                          
  
                          {props.taskDetails.isUseInOffice === "No" ?
                          <>
                              
                                  <Col lg={2} className="p-2">
                                      <Label>Return Date</Label>
                                  </Col>
                                  <Col lg={4} className="p-2">
                                      <TextareaAutosize className="form-control" disabled value={props.taskDetails.returnDate} id="returnDate" name="returnDate" placeholder="/" />
                                  </Col>
                                  <Col lg={2} className="p-2">
                                      <Label>Responsible Person</Label>
                                  </Col>
                                  <Col lg={4} className="p-2">
                                      <TextareaAutosize className="form-control" disabled value={props.taskDetails.responsiblePersonName} id="responsiblePersonName" name="responsiblePersonName" placeholder="/" />
                                  </Col>
                              
                          </> : null
                          }
  
                          
                              <Col lg={2} className="p-2">
                                  <Label>Address to</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.addressTo} id="addressTo" name="addressTo" placeholder="/" />
                              </Col>
                              <Col lg={2} className="p-2">
                                  <Label>Pick Up By</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.pickUpByName} id="pickUpBy" name="pickUpBy" placeholder="/" />
                              </Col>
                          
                          
                              <Col lg={2} className="p-2">
                                  <Label>Remark (e.g. tel.)</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.remark} id="remark" name="remark" placeholder="/" />
                              </Col>
                              <Col lg={2} className="p-2">
                                  <Label>Contract Signed By (First Person)  </Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.contractSignedByFirstPersonName} id="contractSignedByFirstPersonName" name="contractSignedByFirstPersonName" placeholder="/" />
                              </Col>
                          
                          
                              {/* <Col lg={2} className="p-2">
                                  <Label>Confirm</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.isConfirm} id="isConfirm" name="isConfirm" placeholder="/" />
                              </Col> */}
                              <Col lg={2} className="p-2">
                                  <Label>Contract Signed By (Second Person)  </Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.contractSignedBySecondPersonName} id="contractSignedBySecondPersonName" name="contractSignedBySecondPersonName" placeholder="/" />
                              </Col>
                          
                      </FormGroup>
            </Col>
        </>
    }

const LTI = (props) => { 
    return <> 
              <Col className="mb-4">
                    <FormGroup row className="mx-0">
                              <Col lg={2} className="p-2">
                                  <Label>Tel.</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                      <TextareaAutosize className="form-control" disabled value={props.taskDetails.telephoneNum} id="telephoneNum" name="telephoneNum" placeholder="/" />
                                  </Col>
                              <Col lg={2} className="p-2">
                                  <Label>Dept.</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.departmentName} id="departmentName" name="departmentName" placeholder="/" />
                              </Col>
                          
                          
                              <Col lg={2} className="p-2">
                                  <Label>Application Type</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                      <TextareaAutosize className="form-control" disabled value={props.taskDetails.applicationTypeName} id="applicationTypeName" name="applicationTypeName" placeholder="/" />
                              </Col>
                              <Col lg={2} className="p-2">
                                  <Label>Effective Period</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                    <TextareaAutosize className="form-control" disabled value={props.taskDetails.effectivePeriod} id="effectivePeriod" name="effectivePeriod" placeholder="/" />
                              </Col>
                          
                          
                                <Col lg={2} className="p-2">
                                    <Label>Entitled Team</Label>
                                </Col>
                                <Col lg={4} className="p-2">
                                    <TextareaAutosize className="form-control" disabled value={props.taskDetails.teamName} id="teamName" name="teamName" placeholder="/" />
                                </Col>
                                <Col lg={2} className="p-2">
                                    <Label>Chop Type</Label>
                                </Col>
                                <Col lg={4} className="p-2">
                                    <TextareaAutosize className="form-control" disabled value={props.taskDetails.chopTypeName} id="chopTypeName" name="chopTypeName" placeholder="/" />
                                </Col>
                          
                          
                              <Col lg={2} className="p-2">
                                  <Label>Purpose of Use</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.purposeOfUse} id="purposeOfUse" name="purposeOfUse" placeholder="/" />
                              </Col>
                              <Col lg={2} className="p-2">
                                  <Label>Address to</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.addressTo} id="addressTo" name="addressTo" placeholder="/" />
                              </Col>
                          
                          
                              <Col lg={2} className="p-2">
                                  <Label>Remark (e.g. tel.)</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.remark} id="remark" name="remark" placeholder="/" />
                              </Col>
                              <Col lg={2} className="p-2">
                                  <Label>Document Check By</Label>
                                </Col>
                                <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.documentCheckByName} id="documentCheckByName" name="documentCheckByName" placeholder="/" />
                              </Col>
                          
                          
                              <Col lg={2} className="p-2">
                                  <Label>Department Heads</Label>
                              </Col>
                              <Col id="deptHead" lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.departmentHeadsName} id="departmentHeadsName" name="departmentHeadsName" placeholder="/" />
                                  {/* <UncontrolledTooltip placement="right" target="deptHead">{props.taskDetails.departmentHeadsName}</UncontrolledTooltip> */}
                              </Col>
                              {/* <Col lg={2} className="p-2">
                                  <Label>Confirm</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.isConfirm} id="isConfirm" name="isConfirm" placeholder="/" />
                              </Col> */}
                          
                      </FormGroup>
            </Col>
    </>
  } 

  const LTU = (props) => { 
    return <> 
              <Col className="mb-4">
                    <FormGroup row className="mx-0">
                              <Col lg={2} className="p-2">
                                  <Label>Tel.</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                      <TextareaAutosize className="form-control" disabled value={props.taskDetails.telephoneNum} id="telephoneNum" name="telephoneNum" placeholder="/" />
                                  </Col>
                              <Col lg={2} className="p-2">
                                  <Label>Dept.</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.departmentName} id="departmentName" name="departmentName" placeholder="/" />
                              </Col>
                          
                          
                              <Col lg={2} className="p-2">
                                  <Label>Application Type</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                    <TextareaAutosize className="form-control" disabled value={props.taskDetails.applicationTypeName} id="applicationTypeName" name="applicationTypeName" placeholder="/" />
                              </Col>
                              <Col lg={2} className="p-2">
                                    <Label>Entitled Team</Label>
                              </Col>
                                <Col lg={4} className="p-2">
                                    <TextareaAutosize className="form-control" disabled value={props.taskDetails.teamName} id="teamName" name="teamName" placeholder="/" />
                                </Col>
                          
                          
                          <Col lg={2} className="p-2">
                                  <Label>Chop Type</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.chopTypeName} id="chopTypeName" name="chopTypeName" placeholder="/" />
                              </Col>
                              <Col lg={2} className="p-2">
                                  <Label>Purpose of Use</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.purposeOfUse} id="purposeOfUse" name="purposeOfUse" placeholder="/" />
                              </Col>
                          
                          
                              <Col lg={2} className="p-2">
                                  <Label>No. of Pages to Be Chopped </Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.numOfPages} id="numOfPages" name="numOfPages" placeholder="/" />
                              </Col>
                              <Col lg={2} className="p-2">
                                  <Label>Connecting Chop</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.connectChop} id="connectChop" name="connectChop" placeholder="/" />
                              </Col>
                          
                          
                              <Col lg={2} className="p-2">
                                  <Label>Address to</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.addressTo} id="addressTo" name="addressTo" placeholder="/" />
                              </Col>
                              <Col lg={2} className="p-2">
                                  <Label>Pick Up By</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.pickUpByName} id="pickUpBy" name="pickUpBy" placeholder="/" />
                              </Col>
                          
                          
                              <Col lg={2} className="p-2">
                                  <Label>Remark (e.g. tel.)</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.remark} id="remark" name="remark" placeholder="/" />
                              </Col>
                              <Col lg={2} className="p-2">
                                  <Label>Document Check By</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.documentCheckByName} id="documentCheckByName" name="documentCheckByName" placeholder="/" />
                              </Col>
                          
                          {/* 
                              <Col lg={2} className="p-2">
                                  <Label>Confirm</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.isConfirm} id="isConfirm" name="isConfirm" placeholder="/" />
                              </Col>
                           */}
                      </FormGroup>
            </Col>
    </>
  }
  
  const STU = (props) => { 
    return <> 
              <Col className="mb-4">
                    <FormGroup row className="mx-0">
                              <Col lg={2} className="p-2">
                                  <Label>Tel.</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                      <TextareaAutosize className="form-control" disabled value={props.taskDetails.telephoneNum} id="telephoneNum" name="telephoneNum" placeholder="/" />
                                  </Col>
                              <Col lg={2} className="p-2">
                                  <Label>Dept.</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.departmentName} id="departmentName" name="departmentName" placeholder="/" />
                              </Col>
                          
                          
                              <Col lg={2} className="p-2">
                                  <Label>Application Type</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                      <TextareaAutosize className="form-control" disabled value={props.taskDetails.applicationTypeName} id="applicationTypeName" name="applicationTypeName" placeholder="/" />
                                  </Col>
                              <Col lg={2} className="p-2">
                                  <Label>Chop Type</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.chopTypeName} id="chopTypeName" name="chopTypeName" placeholder="/" />
                              </Col>
                          
                          
                              <Col lg={2} className="p-2">
                                  <Label>Purpose of Use</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                <TextareaAutosize className="form-control" disabled value={props.taskDetails.purposeOfUse} id="purposeOfUse" name="purposeOfUse" placeholder="/" />
                              </Col>
                              <Col lg={2} className="p-2">
                                  <Label>No. of Pages to Be Chopped </Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.numOfPages} id="numOfPages" name="numOfPages" placeholder="/" />
                              </Col>
                          
                          
                              <Col lg={2} className="p-2">
                                  <Label>Connecting Chop</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.connectChop} id="connectChop" name="connectChop" placeholder="/" />
                              </Col>
                              <Col lg={2} className="p-2">
                                  <Label>Use in Office or not</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.isUseInOffice} id="isUseInOffice" name="isUseInOffice" placeholder="/" />
                              </Col>
                          
  
                          {props.taskDetails.isUseInOffice === "No" ?
                          <>
                              
                                  <Col lg={2} className="p-2">
                                      <Label>Return Date</Label>
                                  </Col>
                                  <Col lg={4} className="p-2">
                                      <TextareaAutosize className="form-control" disabled value={props.taskDetails.returnDate} id="returnDate" name="returnDate" placeholder="/" />
                                  </Col>
                                  <Col lg={2} className="p-2">
                                      <Label>Responsible Person</Label>
                                  </Col>
                                  <Col lg={4} className="p-2">
                                      <TextareaAutosize className="form-control" disabled value={props.taskDetails.responsiblePersonName} id="responsiblePersonName" name="responsiblePersonName" placeholder="/" />
                                  </Col>
                              
                          </> : null
                          }
  
                          
                              <Col lg={2} className="p-2">
                                  <Label>Address to</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.addressTo} id="addressTo" name="addressTo" placeholder="/" />
                              </Col>
                              <Col lg={2} className="p-2">
                                  <Label>Pick Up By</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.pickUpByName} id="pickUpBy" name="pickUpBy" placeholder="/" />
                              </Col>
                          
                          
                              <Col lg={2} className="p-2">
                                  <Label>Remark (e.g. tel.)</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.remark} id="remark" name="remark" placeholder="/" />
                              </Col>
                              <Col lg={2} className="p-2">
                                  <Label>Department Heads</Label>
                              </Col>
                              <Col id="deptHead" lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.departmentHeadsName} id="departmentHeadsName" name="departmentHeadsName" placeholder="/" />
                                  {/* <UncontrolledTooltip placement="right" target="deptHead">{props.taskDetails.departmentHeadsName}</UncontrolledTooltip> */}
                              </Col>
                          
                          {/* 
                              <Col lg={2} className="p-2">
                                  <Label>Confirm</Label>
                              </Col>
                              <Col lg={4} className="p-2">
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.isConfirm} id="isConfirm" name="isConfirm" placeholder="/" />
                              </Col>
                           */}
                      </FormGroup>
            </Col>
    </>
  } 

export {STU,LTU,LTI,CNIPS};