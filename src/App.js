import Converter from "./Converter/Converter";
import { Col, Container, Row, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import React from "react";
import TimeContainer from "./RateByTime/TimeContainer";
import { getCurrencies } from "./api";
import Auth from "./Form/Auth";
import { BrowserRouter, Link, Redirect, Route, Switch } from "react-router-dom";
import Profile from "./Profile/Profile";

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

  const [isAuth, changeAuth] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      changeAuth(false);
    } else {
      changeAuth(true);
    }
  }, [localStorage.getItem("token")]);

  const signOut = () => {
    localStorage.removeItem("token");
    // changeAuth(false);
  };

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
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
              <Col>
                {isAuth ? (
                  <div>
                    <Link className="m-5" to="/profile">
                      My profile
                    </Link>
                    <Button variant="primary" onClick={signOut}>
                      Out
                    </Button>
                  </div>
                ) : (
                  <Auth changeAuth={changeAuth} isAuth={isAuth} />
                )}
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
        </Route>
        <Route path="/profile">
          <Profile isAuth={isAuth} changeAuth={changeAuth} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
