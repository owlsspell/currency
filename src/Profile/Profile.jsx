import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { chengeUserInfo, getUser } from "../api/api";
import Auth from "../Form/Auth";
import {
  ContainerProfile,
  GridColumn,
  GridColumnForm,
  ImgAvatar,
  ImgContainer,
} from "./Profile.module";

const Profile = (props) => {
  // debugger;
  let token = localStorage.getItem("token");

  const [newUserData, changeUserData] = useState({});

  useEffect(() => {
    props.getUserInfo(token);
  }, []);

  // async function getUserInfo() {
  //   await getUser(token).then((response) => {
  //     console.log(response.data);
  //     props.changeInfoUser(response.data);
  //     setName(response.data.name);
  //   });
  //   // await setName(infoUser.name);
  // }

  const handleChange = (event, fieldName) => {
    if (fieldName === "name") {
      changeUserData({ ...newUserData, name: event.target.value });
    } else if (fieldName === "email") {
      changeUserData({ ...newUserData, email: event.target.value });
    }
    props.getUserInfo(token);
  };
  console.log(props.infoUser);

  const handleSubmit = (e) => {
    e.preventDefault();
    chengeUserInfo(newUserData, props.infoUser, token).then((response) => {
      console.log(response);
    });
    props.getUserInfo(token);
  };

  return (
    <ContainerProfile>
      <GridColumn>
        <h3>Hello {props.infoUser.name ? props.infoUser.name : "unknown"}! </h3>
        <ImgContainer>
          <ImgAvatar
            src={
              props.infoUser.avatar
                ? props.infoUser.avatar
                : "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
            }
            alt=""
          />
        </ImgContainer>
      </GridColumn>
      <GridColumnForm>
        {props.isAuth ? (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Change name</Form.Label>
              <Form.Control
                onChange={(e) => handleChange(e, "name")}
                type="text"
                placeholder="Enter name"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Change email</Form.Label>
              <Form.Control
                onChange={(e) => handleChange(e, "email")}
                type="text"
                placeholder="Enter email"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        ) : (
          <Auth changeAuth={props.changeAuth} isAuth={props.isAuth} />
        )}
      </GridColumnForm>
      {/* <AppProvider i18n={enTranslations}> */}
    </ContainerProfile>
  );
};

export default Profile;
