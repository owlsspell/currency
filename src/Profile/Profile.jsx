import { useEffect, useState } from "react";
import { Button, Form, FormGroup } from "react-bootstrap";
import { chengeUserInfo, sendAvatarToBase, sendFileToBase } from "../api/api";
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
  const handleSubmit = (e) => {
    e.preventDefault();
    chengeUserInfo(newUserData, props.infoUser, token).then((response) => {
      console.log(response);
    });
    props.getUserInfo(token);
  };

  const sendAvatar = (e) => {
    e.preventDefault();
    let file = e.target[0].files[0];
    let fileName = file.name;
    // console.log(fileName);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    // reader.readAsArrayBuffer(file);
    // reader.readAsBinaryString(file);
    reader.onload = function () {
      let photo = reader.result;

      // console.log(photo);
      sendAvatarToBase(fileName, photo).then((res) => console.log(res));
    };
  };

  // const [formData, setFile] = useState();

  const sendFile = (e) => {
    e.preventDefault();
    let f = e.target[0].files[0];
    console.log(f);
    const formData = new FormData();
    let file = e.target[0].files[0];

    formData.append("file", file);
    // formData.get("file");
    sendFileToBase(formData).then((res) => console.log(res));
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
        <form
          // action="/upload"
          // method="post"
          // enctype="multipart/form-data"
          onSubmit={(e) => sendAvatar(e)}
          onDrop={(e) => console.log(e.dataTransfer.files)}
        >
          <input type="file" name="filedata" />
          <input type="submit" value="Send avatar" />
        </form>
        <hr />
        <form onSubmit={(e) => sendFile(e)}>
          <input type="file" name="Doc" />
          <input type="submit" value="Send file" />
        </form>
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
