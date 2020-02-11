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
    let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
    return regEx
}

const CNIPS = (props) => {
  let viewTemplate = [
    {label:'Tel.', params: 'telephoneNum'},
    {label:'Dept.', params: 'departmentName'},
    {label:'Application Type', params: 'applicationTypeName'},
    {label:'Chop Type.', params: 'chopTypeName'},
    {label:'Branch Company Chop', params: 'branchName'},
    {label:'Purpose of Use.', params: 'purposeOfUse'},
    {label:'No. of Pages to Be Chopped', params: 'numOfPages'},
    {label:'Connecting Chop', params: 'connectChop'},
    {label:'Use in Office or not', params: 'isUseInOffice'},
    {label:'Return Date', params: 'returnDate'},
    {label:'Responsible Person', params: 'responsiblePersonName'},
    {label:'Pick Up By', params: 'pickUpByName'},
    {label:'Remark (e.g. tel.)', params: 'remark'},
    {label:'Contract Signed By (First Person) :', params: 'contractSignedByFirstPersonName'},
    {label:'Contract Signed By (Second Person) :', params: 'contractSignedBySecondPersonName'},
    {label:'Confirm', params: 'isConfirm'},
  ]  
  console.log(props.taskDetails)
  return (<> 
            <Col xl className="mb-4">
                <FormGroup row>
                {viewTemplate
                .filter((vCheck, index) => {
                    switch(vCheck.params){
                        case 'isUseInOffice':
                            if (props.taskDetails.isUseInOffice === "Y"){
                            viewTemplate.splice(index+1,2)
                              console.log(index)
                            }
                        case 'branchName':
                            if (props.taskDetails.branchName === ""){
                            viewTemplate.splice(index,1)
                            }
                    }
                })
                .map((views, index) => (
                    <React.Fragment key={index}>
                        <Col lg={2} className="p-2">
                            <Label>{views.label}</Label>
                        </Col>
                        <Col lg={4} className="p-2">
                            <TextareaAutosize className="form-control" disabled value={props.taskDetails[views.params]} id={views.params} name={views.params} placeholder="/" />
                        </Col>
                    </React.Fragment>
                    ))}
                </FormGroup>
                {/* {viewTemplate.map(x => (
                <div>
                    {x.params}<br/>
                </div>
                ))} */}
            </Col>
  </>
  )} 

const LTI = (props) => { 
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
                                  <Label>Purpose of Use</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.purposeOfUse} id="purposeOfUse" name="purposeOfUse" placeholder="/" />
                              </Col>
                              <Col md lg={2}>
                                  <Label>Address to</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.addressTo} id="addressTo" name="addressTo" placeholder="/" />
                              </Col>
                          </FormGroup>
                          <FormGroup row>
                              <Col md lg={2}>
                                  <Label>Remark (e.g. tel.)</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.remark} id="remark" name="remark" placeholder="/" />
                              </Col>
                              <Col md lg={2}>
                                  <Label>Document Check By</Label>
                                </Col>
                                <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.documentCheckByName} id="documentCheckByName" name="documentCheckByName" placeholder="/" />
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

  const LTU = (props) => { 
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
                                  <Label>Address to</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.addressTo} id="addressTo" name="addressTo" placeholder="/" />
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
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.remark} id="remark" name="remark" placeholder="/" />
                              </Col>
                              <Col md lg={2}>
                                  <Label>Document Check By</Label>
                              </Col>
                              <Col md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.documentCheckByName} id="documentCheckByName" name="documentCheckByName" placeholder="/" />
                              </Col>
                          </FormGroup>
                          <FormGroup row>
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
  
  const STU = (props) => { 
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
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.addressTo} id="addressTo" name="addressTo" placeholder="/" />
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
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.remark} id="remark" name="remark" placeholder="/" />
                              </Col>
                              <Col md lg={2}>
                                  <Label>Department Heads</Label>
                              </Col>
                              <Col id="deptHead" md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.setArray(props.taskDetails.departmentHeadsName)} id="departmentHeadsName" name="departmentHeadsName" placeholder="/" />
                                  <UncontrolledTooltip placement="right" target="deptHead">{props.setArray(props.taskDetails.departmentHeadsName)}</UncontrolledTooltip>
                              </Col>
                          </FormGroup>
                          <FormGroup row>
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

export {STU,LTU,LTI,CNIPS};