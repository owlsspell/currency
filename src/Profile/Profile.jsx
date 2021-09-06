import { useEffect, useState } from "react";
import { Button, Form, FormGroup } from "react-bootstrap";
import {
  chengeUserInfo,
  saveAvatarToTable,
  sendAvatarToBase,
  sendFileToBase,
  sendmanyFileToBase,
} from "../api/api";
import Auth from "../Form/Auth";
import {
  ContainerProfile,
  GridColumn,
  GridColumnForm,
  ImgAvatar,
  ImgContainer,
  PreloadAvatar,
} from "./Profile.module";

const Profile = (props) => {
  // debugger;
  let token = localStorage.getItem("token");

  const [newUserData, changeUserData] = useState({});
  const [filesArr, addFilesArr] = useState({});
  console.log(filesArr);
  // const [userAvatar, changeAvatar] = useState(null);
  // console.log(newUserData);
  // console.log(props.infoUser);
  // console.log(userAvatar);

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

      console.log(photo);
      sendAvatarToBase(fileName, photo).then((res) => console.log(res));
    };
  };

  // const [formData, setFile] = useState();

  const sendFile = (e) => {
    e.preventDefault();
    // const formData = new FormData();
    let file = e.target[0].files[0];
    // formData.append("file", file);
    // // formData.get("file");
    // let a = formData.get("file");
    // console.log(a);
    // let name = Buffer.from(file.name).toString("base64");

    let reader = new FileReader();
    reader.readAsDataURL(file);
    // let hashedPict = Buffer.from(file).toString("base64");
    // console.log(file);
    let createPictureName;
    reader.onload = function () {
      let photo = reader.result;
      createPictureName = photo.split("/")[3];
      sendFileToBase(
        file,
        createPictureName + file.name,
        props.infoUser.id
      ).then((res) =>
        props.changeInfoUser({ ...props.infoUser, avatar: res.data })
      );
    };

    // saveAvatarToTable(userAvatar, props.infoUser.id);
  };

  const sendmanyFile = (e) => {
    e.preventDefault();
    // const resultArr = [];
    let files = e.target[0].files;
    function createPictureName(f) {
      return f.split("/")[3];
    }
    return Promise.all(
      [].map.call(files, (file) => {
        return new Promise((resolve, reject) => {
          let reader = new FileReader();
          let filetype = file.name.split(".")[1];
          reader.onloadend = function () {
            // console.log(reader.result.split(",")[1]);

            resolve({
              result: reader.result.split(",")[1],
              name:
                createPictureName(reader.result) + file.name + "." + filetype,
            });
            // console.log(reader.result);
            // console.log(file);
          };
          // reader.readAsDataURL(file);
          reader.readAsDataURL(file);
        }).then((result) => {
          console.log(result);
          sendmanyFileToBase(result);
          // results.forEach(function (result) {
          //   console.log(result);
          // });
        });
      })
    );

    // const converter = (f) => {
    //   let reader = new FileReader();
    //   reader.readAsDataURL(f);
    //   reader.onload = function () {
    //     let fileToBase64 = reader.result;
    //     // console.log(photo);
    //     let name = createPictureName(fileToBase64);
    //     let data = { name: name, file: fileToBase64 };

    //     addFilesArr({ ...filesArr, ...{ [f.name]: data } });
    //   };
    // };
    // let files = e.target[0].files;
    // console.log(files);
    // let a = [...files];
    // a.map((i) => converter(i));
    // for (let file of files) {
    // for (let i = 0; i < files.length; i++) {
    // let promise = new Promise((res) => {
    // console.log(file);
    // converter(file);
    // converter(file);
    // let obj = new Promise((resolve) => converter(file));
    // // Promise.all[obj];
    // // console.log(createPictureName);
    // console.log(obj);
    // resultArr.push(obj);
    // });
    // promises.then(console.log(promises));
    // console.log(promise.then((res) => resultArr.push(res)));
    // }

    // Promise.all(e.target[0].files).then(sendmanyFileToBase(e.target[0].files));
  };

  return (
    <ContainerProfile>
      <GridColumn>
        <h3>Hello {props.infoUser.name ? props.infoUser.name : "unknown"}! </h3>
        <ImgContainer>
          <ImgAvatar
            src={
              props.infoUser.avatar
                ? "http://localhost:8080/upload/" + props.infoUser.avatar
                : /*userAvatar */
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
            }
            // src={
            //   userAvatar
            //     ? "data:image/png;base64," + userAvatar
            //     : "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
            // }
            alt=""
          />
        </ImgContainer>
        {/* <form
          // action="/upload"
          // method="post"
          // enctype="multipart/form-data"
          onSubmit={(e) => sendAvatar(e)}
          onDrop={(e) => console.log(e.dataTransfer.files)}
        >
          <input type="file" name="filedata" />
          <input type="submit" value="Send avatar" />
        </form> */}
        <hr />
        <form onSubmit={(e) => sendFile(e)}>
          <input type="file" name="Doc" />
          <input type="submit" value="Send file" />
        </form>
        <hr />
        <form onSubmit={(e) => sendmanyFile(e)}>
          <input type="file" multiple />
          <input type="submit" value="Отправить" />
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
