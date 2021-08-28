import axios from "axios";

//User

export const registrationUser = (authData) => {
  return axios.post("/logup", authData).then((response) => response);
};

export const authorizationUser = (authData) => {
  return axios.post(`/login`, { authData }).then((response) => response);
};

export const getUser = (token) => {
  return axios
    .get("/getUser", { headers: { Authorization: token } })
    .then((response) => response);
};

export const chengeUserInfo = (newUserData, infoUserObj, token) => {
  return axios
    .post("/changeUserData", [newUserData, infoUserObj], {
      headers: { Authorization: token },
    })
    .then((response) => response);
};

//Shop

export const getGoods = () => {
  return axios.get("/getGoods").then((response) => response);
};

export const setUserOrder = (brand, price, userId) => {
  return axios
    .post("/setOrder", {
      brand: brand,
      price: price,
      userId: userId,
    })
    .then((response) => response);
};
export const getUserOrders = (token) => {
  return axios
    .get("/orders/", { headers: { Authorization: token } })
    .then((response) => response);
};
