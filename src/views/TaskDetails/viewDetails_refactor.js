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


const viewTemplateCNIPS = [
    {label:'Tel.', params: 'telephoneNum',data:'x'},
    {label:'Dept.', params: 'departmentName',data:'x'},
    {label:'Application Type', params: 'applicationTypeName',data:'x'},
    {label:'Effective Period', params: 'effectivePeriod',data:'x'},
    {label:'Entitled Team', params: 'teamName',data:'x'},
    {label:'Chop Type.', params: 'chopTypeName',data:'x'},
    {label:'Branch Company Chop', params: 'branchName',data:'x'},
    {label:'Purpose of Use.', params: 'purposeOfUse',data:'x'},
    {label:'No. of Pages to Be Chopped', params: 'numOfPages',data:'x'},
    {label:'Connecting Chop', params: 'connectChop',data:'x'},
    {label:'Use in Office or not', params: 'isUseInOffice',data:'x'},
    {label:'Return Date', params: 'returnDate',data:'x'},
    {label:'Responsible Person', params: 'responsiblePersonName',data:'x'},
    {label:'Address to', params: 'addressTo',data:'x'},
    {label:'Pick Up By', params: 'pickUpByName',data:'x'},
    {label:'Remark (e.g. tel.)', params: 'remark',data:'x'},
    {label:'Document Check By', params: 'documentCheckByName',data:'x'},
    {label:'Department Heads', params: 'departmentHeadsName',data:'x'},
    {label:'Contract Signed By (First Person)', params: 'contractSignedByFirstPersonName',data:'x'},
    {label:'Contract Signed By (Second Person)', params: 'contractSignedBySecondPersonName',data:'x'},
]

const viewTemplateLTI = [
    {label:'Tel.', params: 'telephoneNum',data:'x'},
    {label:'Dept.', params: 'departmentName',data:'x'},
    {label:'Application Type', params: 'applicationTypeName',data:'x'},
    {label:'Effective Period', params: 'effectivePeriod',data:'x'},
    {label:'Entitled Team', params: 'teamName',data:'x'},
    {label:'Chop Type.', params: 'chopTypeName',data:'x'},
    {label:'Branch Company Chop', params: 'branchName',data:'x'},
    {label:'Purpose of Use.', params: 'purposeOfUse',data:'x'},
    {label:'Address to', params: 'addressTo',data:'x'},
    {label:'Pick Up By', params: 'pickUpByName',data:'x'},
    {label:'Remark (e.g. tel.)', params: 'remark',data:'x'},
    {label:'Document Check By', params: 'documentCheckByName',data:'x'},
    {label:'Department Heads', params: 'departmentHeadsName',data:'x'},
]

function CheckDetail(taskDetails){
    let newView = []
    viewTemplateCNIPS.filter( view => {

        view.data = taskDetails[view.params]

        switch(view.params){
            case 'returnDate':
                if (taskDetails.returnDate === "0001-01-01" ){
                    return null     
                }
                return newView.push(view)
            case 'responsiblePersonName':
                if (taskDetails.responsiblePersonName === "" ){
                    return null     
                }
                return newView.push(view)
            case 'branchName':
                if (taskDetails.branchName === ""){
                    return null 
                }
                return newView.push(view)
            case 'connectChop':
                if (taskDetails.applicationTypeId === "LTI" || "LTU"){
                    return null 
                }
                return newView.push(view)
            default:
                if(Array.isArray(taskDetails[view.params])){
                    if(taskDetails[view.params].length === 0){
                        return null
                    }else{
                        return newView.push(view)    
                    }
                }
                else{
                    if(taskDetails[view.params] === ""){
                        return null
                    }
                }
                return newView.push(view) 
            }
        })

    return newView
}


const CNIPS = (props) => {

    let renderView = CheckDetail(props.taskDetails)       
    // console.log(renderView, viewTemplateCNIPS)
    return (<> 
            <FormGroup row className="px-4 py-0">
            {renderView.map((views, index) => (
                <React.Fragment key={index}>
                    <Col lg={2} className="p-2">
                        <Label>{views.label}</Label>
                    </Col>
                    <Col lg={4} className="p-2">
                        <TextareaAutosize className="form-control" disabled value={views.data} id={views.params} name={views.params} placeholder="/" />
                    </Col>
                </React.Fragment>
                ))}
            </FormGroup>
        </>
  )} 

const LTI = (props) => { 

    let renderView = CheckDetail(props.taskDetails)       

    return (<> 
            <FormGroup row className="px-4 py-0">
            {renderView.map((views, index) => (
                <React.Fragment key={index}>
                    <Col lg={2} className="p-2">
                        <Label>{views.label}</Label>
                    </Col>
                    <Col lg={4} className="p-2">
                        <TextareaAutosize className="form-control" disabled value={views.data} id={views.params} name={views.params} placeholder="/" />
                    </Col>
                </React.Fragment>
                ))}
            </FormGroup>
        </>
    )
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
                              <Col id="deptHead" md lg={4}>
                                  <TextareaAutosize className="form-control" disabled value={props.taskDetails.departmentHeadsName} id="departmentHeadsName" name="departmentHeadsName" placeholder="/" />
                                  <UncontrolledTooltip placement="right" target="deptHead">{props.taskDetails.departmentHeadsName}</UncontrolledTooltip>
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