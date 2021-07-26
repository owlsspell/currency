import { useState } from "react";
import { Button, Card, Col, Form, InputGroup } from "react-bootstrap";
import "../App.css";
import Input from "./Input";
import Select from "./Select";

function Converter(props) {
  const [inputText, changeText] = useState({ inputOne: "", inputTwo: "" });

  const handleChange = (event, fieldName) => {
    if (fieldName === "currency1") {
      changeText({ ...inputText, inputOne: +event.target.value });
      props.changeActiveInput(0);
    } else {
      changeText({ ...inputText, inputTwo: +event.target.value });
      props.changeActiveInput(1);
    }
  };

  const ChangeSelect = (event, fieldName) => {
    if (fieldName === "currency1") {
      props.changeCurrency({
        ...props.currency,
        oneCurrency: event.target.value,
      });
      props.changeActiveInput(0);
    } else {
      props.changeCurrency({
        ...props.currency,
        twoCurrency: event.target.value,
      });
      props.changeActiveInput(1);
    }
  };

  const convertVal = () => {
    let oneCurrencyRate = findCurrency(props.currency.oneCurrency);
    let twoCurrencyRate = findCurrency(props.currency.twoCurrency);

    function findCurrency(currencyName) {
      return props.currencies.find((n) => n.CurrencyCodeL === currencyName);
    }
    if (props.activeInput === 0) {
      changeText({
        ...inputText,
        inputTwo: (
          (oneCurrencyRate.Amount * inputText.inputOne) /
          twoCurrencyRate.Amount
        ).toFixed(2),
      });
    } else {
      changeText({
        ...inputText,
        inputOne: (
          (twoCurrencyRate.Amount * inputText.inputTwo) /
          oneCurrencyRate.Amount
        ).toFixed(2),
      });
    }
  };

  return (
    <Card>
      <Form.Group className="mb-3 ">
        <Card.Header>Enter the currency you want to transfer:</Card.Header>
        <InputGroup className="mt-3 d-flex justify-content-center">
          <Input
            inputText={inputText.inputOne}
            handleChange={(e) => handleChange(e, "currency1")}
          />
          <Select
            currencies={props.currencies}
            ChangeSelect={(e) => ChangeSelect(e, "currency1")}
          />
        </InputGroup>
        <InputGroup className="mt-2 d-flex justify-content-center">
          <Input
            inputText={inputText.inputTwo}
            handleChange={(e) => handleChange(e, "currency2")}
          />
          <Select
            currencies={props.currencies}
            ChangeSelect={(e) => ChangeSelect(e, "currency2")}
          />
        </InputGroup>
        <Col className="d-flex justify-content-center">
          <Button variant="primary" className="mt-2" onClick={convertVal}>
            Convert
          </Button>
        </Col>
      </Form.Group>
    </Card>
  );
}

export default Converter;
