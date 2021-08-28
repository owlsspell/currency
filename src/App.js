import Converter from "./Converter/Converter";
import { Col, Container, Row, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import React from "react";
import TimeContainer from "./RateByTime/TimeContainer";
import { getCurrencies } from "./api";
import Auth from "./Form/Auth";
import { Link, Route, Switch, withRouter } from "react-router-dom";
import Profile from "./Profile/Profile";
import "@shopify/polaris/dist/styles.css";
import Shop from "./Shop/Shop";
import { NavContainer } from "./Nav/Nav.module";
import NavMenu from "./Nav/NavMenu";
import Orders from "./Orders/Orders";
import { getUser } from "./api/api";

function App(props) {
  // debugger;
  let token = localStorage.getItem("token");

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

  //Auth
  const [isAuth, changeAuth] = useState(false);
  const [infoUser, changeInfoUser] = useState({});

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      changeAuth(false);
    } else {
      changeAuth(true);
    }
  }, [localStorage.getItem("token")]);

  const signOut = () => {
    localStorage.removeItem("token");
    changeAuth(false);
    changeInfoUser({});
  };
  // console.log(infoUser);

  async function getUserInfo(token) {
    await getUser(token).then((response) => {
      // debugger;
      console.log(response.data);
      changeInfoUser(response.data);
    });
    // await setName(infoUser.name);
  }

  return (
    <NavContainer>
      <NavMenu />
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
                    <Link className="m-5" to="/shop">
                      My shop
                    </Link>
                    <Button variant="primary" onClick={signOut}>
                      Out
                    </Button>
                  </div>
                ) : (
                  <Auth
                    changeAuth={changeAuth}
                    isAuth={isAuth}
                    getUserInfo={getUserInfo}
                  />
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
          <Profile
            isAuth={isAuth}
            changeAuth={changeAuth}
            infoUser={infoUser}
            changeInfoUser={changeInfoUser}
            getUserInfo={getUserInfo}
          />
        </Route>
        <Route path="/shop">
          <Shop isAuth={isAuth} infoUser={infoUser} />
        </Route>
        <Route path="/orders/">
          <Orders isAuth={isAuth} infoUser={infoUser} />
        </Route>
      </Switch>
    </NavContainer>
  );
}

export default withRouter(App);
