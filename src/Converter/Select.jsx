import { Col, Form } from "react-bootstrap";

function Select(props) {
  return (
    <Col md={3}>
      <Form.Select onChange={props.ChangeSelect}>
        {props.currencies.map((option) => {
          return (
            <option key={option.CurrencyCode}>{option.CurrencyCodeL}</option>
          );
        })}
      </Form.Select>
    </Col>
  );
}

export default Select;
