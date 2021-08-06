import axios from "axios";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import Profile from "../Profile/Profile";

const Auth = (props) => {
  // debugger;
  const [authData, changeAuthData] = useState({ email: "", password: "" });

  // let chackError = () => {
  //   axios.interceptors.response.use(
  //     (response) => {
  //       return response;
  //     },
  //     (error) => {
  //       // if (error.response.status === 401) {
  //       //   //place your reentry code
  //       //   console.log(401);
  //       // }
  //       // // return error;
  //       // return;

  //       return Promise.reject(error);
  //     }
  //   );
  // };

  const handleChange = (event, fieldName) => {
    if (fieldName === "email") {
      changeAuthData({ ...authData, email: event.target.value });
    } else {
      changeAuthData({ ...authData, password: event.target.value });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // chackError();
    if (authData.email && authData.password) {
      axios.post("/logup", authData).then((response) => {
        console.log(response);
        localStorage.setItem("token", response.data.token);
      });
      // props.changeAuth(true);
    } else {
      alert("Enter login and password");
    }
  };
  const signIn = () => {
    // chackError();

    if (authData.email && authData.password) {
      axios.post(`/login`, { authData }).then((response) => {
        console.log(response);
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          alert(`You authorized`);
          props.changeAuth(true);
        } else {
          alert(`You not authorized`);
        }
      });
    } else {
      alert("Enter login and password");
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(e) => handleChange(e, "email")}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => handleChange(e, "password")}
          />
        </Form.Group>
        {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group> */}
        <Button variant="primary" onClick={signIn}>
          Sign in
        </Button>
        <Button variant="primary" type="submit">
          Sign up
        </Button>
      </Form>
    </div>
  );
};

export default Auth;
