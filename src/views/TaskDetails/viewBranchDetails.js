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

function convertDate(dateValue) {
    let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3')
    return regEx
}

function expandRow(value){
    let row = 1
    if (value.length < 70){
        row = 2
    }
    if (value.length < 140){
        row = 3
    }
    if (value.length < 210){
        row = 4
    }
    if (value.length < 380){
        row = 5
    }
    if (value.length > 380){
        row = 7
    }
    if (value.length > 450){
        row = 10
    }
    console.log(row, value)
    return row
}


const BCNIPS = (props) => { 
  return <> 
            <Col className="mb-4">
                        <FormGroup row>
                            <Col md lg={2}>
                                <Label>Tel.</Label>
                            </Col>
                            <Col md lg={4}>
                                    <TextareaAutosize className="form-control" disabled value={props.taskDetails.requestorUser.telephoneNum} id="telephoneNum" name="telephoneNum" placeholder="/" />
                                </Col>
                            <Col md lg={2}>
                                <Label>Dept.</Label>
                            </Col>
                            <Col md lg={4}>
                                <TextareaAutosize className="form-control" disabled value={props.taskDetails.departmentName} id="departmentName" name="departmentName" placeholder="/" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md lg={2}>
                                <Label>Application Type</Label>
                            </Col>
                            <Col md lg={4}>
                                    <TextareaAutosize className="form-control" disabled value={props.taskDetails.applicationTypeName} id="applicationTypeName" name="applicationTypeName" placeholder="/" />
                                </Col>
                            <Col md lg={2}>
                                <Label>Chop Type</Label>
                            </Col>
                            <Col md lg={4}>
                                <TextareaAutosize className="form-control" disabled value={props.taskDetails.chopTypeName} id="chopTypeName" name="chopTypeName" placeholder="/" />
                            </Col>
                        </FormGroup>
                         <FormGroup row >
                                <Col md lg={2}>
                                    <Label>Branch Company Chop</Label>
                                </Col>
                                <Col md lg={4}>
                                    <TextareaAutosize className="form-control" disabled value={props.taskDetails.branchName} id="branchName" name="branchName" placeholder="/" />
                                </Col>
                                <Col md lg={2}>
                                    <Label>Purpose of Use</Label>
                                </Col>
                                <Col md lg={4}>
                                    <TextareaAutosize className="form-control" disabled value={props.taskDetails.purposeOfUse} id="purposeOfUse" name="purposeOfUse" placeholder="/" />
                                </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md lg={2}>
                                <Label>No. of Pages to Be Chopped </Label>
                            </Col>
                            <Col md lg={4}>
                                <TextareaAutosize className="form-control" disabled value={props.taskDetails.numOfPages} id="numOfPages" name="numOfPages" placeholder="/" />
                            </Col>
                            <Col md lg={2}>
                                <Label>Connecting Chop</Label>
                            </Col>
                            <Col md lg={4}>
                                <TextareaAutosize className="form-control" disabled value={props.taskDetails.connectChop === "Y" ? "Yes" : "No"} id="connectChop" name="connectChop" placeholder="/" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md lg={2}>
                                <Label>Use in Office or not</Label>
                            </Col>
                            <Col md lg={4}>
                                <TextareaAutosize className="form-control" disabled value={props.taskDetails.isUseInOffice === "Y" ? "Yes" : "No"} id="isUseInOffice" name="isUseInOffice" placeholder="/" />
                            </Col>
                        </FormGroup>
                        {props.taskDetails.isUseInOffice === "N" ?
                        <>
                            <FormGroup row>
                                <Col md lg={2}>
                                    <Label>Return Date</Label>
                                </Col>
                                <Col md lg={4}>
                                    <TextareaAutosize className="form-control" disabled value={convertDate(props.taskDetails.returnDate)} id="returnDate" name="returnDate" placeholder="/" />
                                </Col>
                                <Col md lg={2}>
                                    <Label>Responsible Person</Label>
                                </Col>
                                <Col md lg={4}>
                                    <TextareaAutosize className="form-control" disabled value={props.taskDetails.responsiblePersonName} id="responsiblePersonName" name="responsiblePersonName" placeholder="/" />
                                </Col>
                            </FormGroup>
                        </> : null
                        }
                        <FormGroup row>
                            <Col md lg={2}>
                                <Label>Address to</Label>
                            </Col>
                            <Col md lg={4}>
                                <TextareaAutosize className="form-control" disabled style={{resize:"none"}} value={props.taskDetails.addressTo} id="addressTo" name="addressTo" placeholder="/" />
                            </Col>
                            <Col md lg={2}>
                                <Label>Pick Up By</Label>
                            </Col>
                            <Col md lg={4}>
                                <TextareaAutosize className="form-control" disabled value={props.taskDetails.pickUpByName} id="pickUpBy" name="pickUpBy" placeholder="/" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md lg={2}>
                                <Label>Remark (e.g. tel.)</Label>
                            </Col>
                            <Col md lg={4}>
                                <TextareaAutosize className="form-control" disabled style={{resize:"none"}} value={props.taskDetails.remark} id="remark" name="remark" placeholder="/" />
                            </Col>
                            <Col md lg={2}>
                                <Label>Contract Signed By (First Person) :  </Label>
                            </Col>
                            <Col md lg={4}>
                                <TextareaAutosize className="form-control" disabled value={props.taskDetails.contractSignedByFirstPersonName} id="contractSignedByFirstPersonName" name="contractSignedByFirstPersonName" placeholder="/" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md lg={2}>
                                <Label>Confirm</Label>
                            </Col>
                            <Col md lg={4}>
                                <TextareaAutosize className="form-control" disabled value={props.taskDetails.isConfirm === "Y" ? "Yes" : "No"} id="isConfirm" name="isConfirm" placeholder="/" />
                            </Col>
                            <Col md lg={2}>
                                <Label>Contract Signed By (Second Person) :  </Label>
                            </Col>
                            <Col md lg={4}>
                                <TextareaAutosize className="form-control" disabled value={props.taskDetails.contractSignedBySecondPersonName} id="contractSignedBySecondPersonName" name="contractSignedBySecondPersonName" placeholder="/" />
                            </Col>
                        </FormGroup>
                    </Col>
  </>
} 

const BLTI = (props) => { 
    return <> 
              <Col className="mb-4">
                          <FormGroup row>
                              <Col md lg={2}>
                                  <Label>Tel.</Label>
                              </Col>
                              <Col md lg={4}>
                                      <TextareaAutosize className="form-control" disabled value={props.taskDetails.requestorUser.telephoneNum} id="telephoneNum" name="telephoneNum" placeholder="/" />
                                  </Col>
                              <Col md lg={2}>
                                  <Label>Dept.</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.departmentName} id="departmentName" name="departmentName" placeholder="/" />
                              </Col>
                          </FormGroup>
                          <FormGroup row>
                              <Col md lg={2}>
                                  <Label>Application Type</Label>
                              </Col>
                              <Col md lg={4}>
                                      <TextareaAutosize className="form-control" disabled value={props.taskDetails.applicationTypeName} id="applicationTypeName" name="applicationTypeName" placeholder="/" />
                              </Col>
                              <Col md lg={2}>
                                  <Label>Effective Period</Label>
                              </Col>
                              <Col md lg={4}>
                                    <TextareaAutosize className="form-control" disabled value={convertDate(props.taskDetails.effectivePeriod)} id="effectivePeriod" name="effectivePeriod" placeholder="/" />
                              </Col>
                          </FormGroup>
                          <FormGroup row>
                                <Col md lg={2}>
                                    <Label>Entitled Team</Label>
                                </Col>
                                <Col md lg={4}>
                                    <TextareaAutosize className="form-control" disabled value={props.taskDetails.teamName} id="teamName" name="teamName" placeholder="/" />
                                </Col>
                                <Col md lg={2}>
                                    <Label>Chop Type</Label>
                                </Col>
                                <Col md lg={4}>
                                    <TextareaAutosize className="form-control" disabled value={props.taskDetails.chopTypeName} id="chopTypeName" name="chopTypeName" placeholder="/" />
                                </Col>
                          </FormGroup>
                          <FormGroup row>
                              <Col md lg={2}>
                                  <Label>Branch Company Chop</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.branchName} id="branchName" name="branchName" placeholder="/" />
                              </Col>
                              <Col md lg={2}>
                                  <Label>Purpose of Use</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.purposeOfUse} id="purposeOfUse" name="purposeOfUse" placeholder="/" />
                              </Col>
                          </FormGroup>
                          <FormGroup row>
                              <Col md lg={2}>
                                  <Label>Address to</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled style={{resize:"none"}} value={props.taskDetails.addressTo} id="addressTo" name="addressTo" placeholder="/" />
                              </Col>
                              <Col md lg={2}>
                                  <Label>Remark (e.g. tel.)</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled style={{resize:"none"}} value={props.taskDetails.remark} id="remark" name="remark" placeholder="/" />
                              </Col>
                          </FormGroup>
                          <FormGroup row>
                              <Col md lg={2}>
                                  <Label>Document Check By</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.documentCheckByName} id="documentCheckByName" name="documentCheckByName" placeholder="/" />
                              </Col>
                              <Col md lg={2}>
                                  <Label>Department Heads</Label>
                              </Col>
                              <Col id="deptHead" md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.setArray(props.taskDetails.departmentHeadsName)} id="departmentHeadsName" name="departmentHeadsName" placeholder="/" />
                                  <UncontrolledTooltip placement="right" target="deptHead">{props.setArray(props.taskDetails.departmentHeadsName)}</UncontrolledTooltip>
                              </Col>
                          </FormGroup>
                          <FormGroup>
                              <Col md lg={2}>
                                  <Label>Confirm</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.isConfirm === "Y" ? "Yes" : "No"} id="isConfirm" name="isConfirm" placeholder="/" />
                              </Col>
                          </FormGroup>
                      </Col>
    </>
  } 

  const BLTU = (props) => { 
    return <> 
              <Col className="mb-4">
                          <FormGroup row>
                              <Col md lg={2}>
                                  <Label>Tel.</Label>
                              </Col>
                              <Col md lg={4}>
                                      <TextareaAutosize className="form-control" disabled value={props.taskDetails.requestorUser.telephoneNum} id="telephoneNum" name="telephoneNum" placeholder="/" />
                                  </Col>
                              <Col md lg={2}>
                                  <Label>Dept.</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.departmentName} id="departmentName" name="departmentName" placeholder="/" />
                              </Col>
                          </FormGroup>
                          <FormGroup row>
                              <Col md lg={2}>
                                  <Label>Application Type</Label>
                              </Col>
                              <Col md lg={4}>
                                    <TextareaAutosize className="form-control" disabled value={props.taskDetails.applicationTypeName} id="applicationTypeName" name="applicationTypeName" placeholder="/" />
                              </Col>
                              <Col md lg={2}>
                                    <Label>Entitled Team</Label>
                              </Col>
                                <Col md lg={4}>
                                    <TextareaAutosize className="form-control" disabled value={props.taskDetails.teamName} id="teamName" name="teamName" placeholder="/" />
                                </Col>
                          </FormGroup>
                          <FormGroup row>
                          <Col md lg={2}>
                                  <Label>Chop Type</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.chopTypeName} id="chopTypeName" name="chopTypeName" placeholder="/" />
                              </Col>
                              <Col md lg={2}>
                                  <Label>Branch Company Chop</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.branchName} id="branchName" name="branchName" placeholder="/" />
                              </Col>
                          </FormGroup>
                          <FormGroup row>
                              <Col md lg={2}>
                                  <Label>Purpose of Use</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.purposeOfUse} id="purposeOfUse" name="purposeOfUse" placeholder="/" />
                              </Col>
                              <Col md lg={2}>
                                  <Label>No. of Pages to Be Chopped </Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.numOfPages} id="numOfPages" name="numOfPages" placeholder="/" />
                              </Col>
                          </FormGroup>
                          <FormGroup row>
                              <Col md lg={2}>
                                  <Label>Connecting Chop</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.connectChop === "Y" ? "Yes" : "No"} id="connectChop" name="connectChop" placeholder="/" />
                              </Col>
                              <Col md lg={2}>
                                  <Label>Address to</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled style={{resize:"none"}} value={props.taskDetails.addressTo} id="addressTo" name="addressTo" placeholder="/" />
                              </Col>
                          </FormGroup>
                          <FormGroup row>
                              <Col md lg={2}>
                                  <Label>Pick Up By</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.pickUpByName} id="pickUpBy" name="pickUpBy" placeholder="/" />
                              </Col>
                              <Col md lg={2}>
                                  <Label>Remark (e.g. tel.)</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled style={{resize:"none"}} value={props.taskDetails.remark} id="remark" name="remark" placeholder="/" />
                              </Col>
                          </FormGroup>
                          <FormGroup row>
                              <Col md lg={2}>
                                  <Label>Document Check By</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.documentCheckByName} id="documentCheckByName" name="documentCheckByName" placeholder="/" />
                              </Col>
                              <Col md lg={2}>
                                  <Label>Confirm</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.isConfirm === "Y" ? "Yes" : "No"} id="isConfirm" name="isConfirm" placeholder="/" />
                              </Col>
                          </FormGroup>
                      </Col>
    </>
  }
  
  const BSTU = (props) => { 
    return <> 
              <Col className="mb-4">
                          <FormGroup row>
                              <Col md lg={2}>
                                  <Label>Tel.</Label>
                              </Col>
                              <Col md lg={4}>
                                      <TextareaAutosize className="form-control" disabled value={props.taskDetails.requestorUser.telephoneNum} id="telephoneNum" name="telephoneNum" placeholder="/" />
                                  </Col>
                              <Col md lg={2}>
                                  <Label>Dept.</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.departmentName} id="departmentName" name="departmentName" placeholder="/" />
                              </Col>
                          </FormGroup>
                          <FormGroup row>
                              <Col md lg={2}>
                                  <Label>Application Type</Label>
                              </Col>
                              <Col md lg={4}>
                                      <TextareaAutosize className="form-control" disabled value={props.taskDetails.applicationTypeName} id="applicationTypeName" name="applicationTypeName" placeholder="/" />
                                  </Col>
                              <Col md lg={2}>
                                  <Label>Chop Type</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.chopTypeName} id="chopTypeName" name="chopTypeName" placeholder="/" />
                              </Col>
                          </FormGroup>
                          <FormGroup row>
                              <Col md lg={2}>
                                    <Label>Branch Company Chop</Label>
                                </Col>
                                <Col md lg={4}>
                                    <TextareaAutosize className="form-control" disabled value={props.taskDetails.branchName} id="branchName" name="branchName" placeholder="/" />
                                </Col>
                              <Col md lg={2}>
                                  <Label>Purpose of Use</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled style={{resize:"none"}} value={props.taskDetails.purposeOfUse} id="purposeOfUse" name="purposeOfUse" placeholder="/" />
                              </Col>
                          </FormGroup>
                          <FormGroup row>
                              <Col md lg={2}>
                                  <Label>No. of Pages to Be Chopped </Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.numOfPages} id="numOfPages" name="numOfPages" placeholder="/" />
                              </Col>
                              <Col md lg={2}>
                                  <Label>Connecting Chop</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.connectChop === "Y" ? "Yes" : "No"} id="connectChop" name="connectChop" placeholder="/" />
                              </Col>
                          </FormGroup>
                          <FormGroup row>
                          <Col md lg={2}>
                                  <Label>Use in Office or not</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.isUseInOffice === "Y" ? "Yes" : "No"} id="isUseInOffice" name="isUseInOffice" placeholder="/" />
                              </Col>
                              <Col md lg={2}>
                                  <Label>Address to</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled style={{resize:"none"}} value={props.taskDetails.addressTo} id="addressTo" name="addressTo" placeholder="/" />
                              </Col>
                          </FormGroup>
                          {props.taskDetails.isUseInOffice === "N" ?
                          <>
                              <FormGroup row>
                                  <Col md lg={2}>
                                      <Label>Return Date</Label>
                                  </Col>
                                  <Col md lg={4}>
                                      <TextareaAutosize className="form-control" disabled value={convertDate(props.taskDetails.returnDate)} id="returnDate" name="returnDate" placeholder="/" />
                                  </Col>
                                  <Col md lg={2}>
                                      <Label>Responsible Person</Label>
                                  </Col>
                                  <Col md lg={4}>
                                      <TextareaAutosize className="form-control" disabled value={props.taskDetails.responsiblePersonName} id="responsiblePersonName" name="responsiblePersonName" placeholder="/" />
                                  </Col>
                              </FormGroup>
                          </> : null
                          }
                          <FormGroup row>
                              <Col md lg={2}>
                                  <Label>Pick Up By</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.pickUpByName} id="pickUpBy" name="pickUpBy" placeholder="/" />
                              </Col>
                              <Col md lg={2}>
                                  <Label>Remark (e.g. tel.)</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled style={{resize:"none"}} value={props.taskDetails.remark} id="remark" name="remark" placeholder="/" />
                              </Col>
                          </FormGroup>
                          <FormGroup row>
                              <Col md lg={2}>
                                  <Label>Department Heads</Label>
                              </Col>
                              <Col id="deptHead" md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.setArray(props.taskDetails.departmentHeadsName)} id="departmentHeadsName" name="departmentHeadsName" placeholder="/" />
                                  <UncontrolledTooltip placement="right" target="deptHead">{props.setArray(props.taskDetails.departmentHeadsName)}</UncontrolledTooltip>
                              </Col>
                              <Col md lg={2}>
                                  <Label>Confirm</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.isConfirm === "Y" ? "Yes" : "No"} id="isConfirm" name="isConfirm" placeholder="/" />
                              </Col>
                          </FormGroup>
                      </Col>
    </>
  } 

export {BSTU,BLTU,BLTI,BCNIPS};