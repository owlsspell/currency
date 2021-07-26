import * as axios from "axios";

const instanse = axios.create({
  baseURL: "https://bank.gov.ua/",
});

export const getCurrencies = () => {
  return instanse
    .get("NBU_Exchange/exchange?json")
    .then((response) => response.data);
};

export const getCurrenciesforDateOne = (selectOne, dates) => {
  let fetchFunctions = [];
  dates.forEach((date) =>
    fetchFunctions.push(
      instanse.get(
        `NBUStatService/v1/statdirectory/exchange?valcode=${selectOne}&date=${date}&json`
      )
    )
  );
  return Promise.all(fetchFunctions).then((responses) => responses);
};

export const getCurrenciesforDateTwo = (selectTwo, dates) => {
  let fetchFunctions = [];
  dates.forEach((date) =>
    fetchFunctions.push(
      instanse.get(
        `NBUStatService/v1/statdirectory/exchange?valcode=${selectTwo}&date=${date}&json`
      )
    )
  );
  return Promise.all(fetchFunctions).then((responses) => responses);
};
