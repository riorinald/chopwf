import React from 'react';
import {
    Button,
    CustomInput,
    Col,
    Collapse,
    FormGroup,
    Input,
    Row,
    Table,
  } from 'reactstrap';
import InputMask from "react-input-mask";
import deleteBin from '../../../assets/img/deletebin.png';


export const LTI = (props) => {
    var pointer;
        if (props.hover) {
        pointer = { cursor: 'pointer' }
        }
        else {
        pointer = {}
        }
    const DocTable = <div>
      <Table bordered>
        <thead>
          <tr>
            <th>No.</th>
            <th>Document Name in English</th>
            <th>Document Name in Chinese</th>
            <th>Attached File</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.documentTableLTI.map((document, index) =>
            <tr key={index}>
              <th>{index + 1}</th>
              <th>{document.engName}</th>
              <th>{document.cnName}</th>
              <th id="viewDoc">
                <a href={document.docURL} target='_blank' rel="noopener noreferrer">{document.docName}</a>
              </th>
              <th><img style={pointer} width="25px" onClick={() => props.deleteDocument("documentTableLTI", index)} onMouseOver={props.toggleHover} src={deleteBin} /></th>
            </tr>
          )}
        </tbody>
      </Table></div>
    return <div>
    <Row form>
      {props.CNIPS
        ? <Col ><FormGroup>
          <InputMask mask="*-*-*-9999-9999" className="form-control" defaultValue={props.contractNum} onChange={props.handleChange("contractNum")}></InputMask>
        </FormGroup></Col>
        : ""}

      <Col >
        <FormGroup>
          <Input value={props.engName} onChange={props.handleChange("engName")} type="text" name="textarea-input" id="docName" rows="3" placeholder="Please describe in English" />
        </FormGroup>
      </Col>
      <Col >
        <FormGroup>
          <Input value={props.cnName} onChange={props.handleChange("cnName")} type="text" name="textarea-input" id="cnName" rows="3" placeholder="Please describe in Chinese" />
        </FormGroup>
      </Col>
      <Col >
        <FormGroup>
          <CustomInput id="docFileName" onChange={props.uploadDocument} type="file" bsSize="lg" color="primary" label={props.docAttachedName} />
        </FormGroup>
      </Col>
      <Col md={1}>
        <FormGroup>
          <Button block onClick={props.addDocumentLTI}>Add</Button>
        </FormGroup>
      </Col>
    </Row>
    <Collapse isOpen={props.documentTableLTI.length !== 0}>
      {DocTable}
    </Collapse>
  </div>
}