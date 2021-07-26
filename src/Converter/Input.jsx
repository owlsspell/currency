import { Col, Form } from "react-bootstrap";

function Input(props) {
  return (
    <Col md={6}>
      <Form.Control
        max={props.max}
        inputtype={props.inputtype}
        className=" mb-2 h-100"
        type="number"
        min="0"
        value={props.inputText}
        onChange={props.handleChange}
      />
    </Col>
  );
}

export default Input;
