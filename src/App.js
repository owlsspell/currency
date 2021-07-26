import Converter from "./Converter/Converter";
import { Col, Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import React from "react";
import TimeContainer from "./RateByTime/TimeContainer";
import { getCurrencies } from "./api";

function App() {
  let [currency, changeCurrency] = useState({
    oneCurrency: "AUD",
    twoCurrency: "AUD",
  });

  const [activeInput, changeActiveInput] = useState(0);
  const [dates, changeDatesArr] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  useEffect(() => {
    getCurrencies().then((response) => {
      setCurrencies(response);
    });
  }, []);

  return (
    <Container className="mt-3">
      <Row>
        <Col md={5}>
          <Converter
            currency={currency}
            currencies={currencies}
            changeCurrency={changeCurrency}
            activeInput={activeInput}
            changeActiveInput={changeActiveInput}
          />
        </Col>
      </Row>
      <Row>
        <TimeContainer
          currency={currency}
          currencies={currencies}
          activeInput={activeInput}
          dates={dates}
          changeDatesArr={changeDatesArr}
        />
      </Row>
    </Container>
  );
}

export default App;
