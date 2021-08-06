import axios from "axios";
import { useState } from "react";
import { Container } from "react-bootstrap";
import Auth from "../Form/Auth";

const Profile = (props) => {
  let [name, setName] = useState(null);
  let token = localStorage.getItem("token");
  getName();

  async function getName() {
    await axios
      .get("/profile", { headers: { Authorization: token } })
      .then((response) => {
        console.log(response.data.name);
        return setName(response.data.name);
      });
  }
  console.log(name);
  console.log(props.isAuth);

  return (
    <Container className="mt-5">
      <h3>Hello {name ? name : "unknown"}! </h3>
      {props.isAuth ? (
        ""
      ) : (
        <Auth changeAuth={props.changeAuth} isAuth={props.isAuth} />
      )}
    </Container>
  );
};

export default Profile;
