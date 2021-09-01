import { useEffect, useState } from "react";
import {
  getCurrenciesforDate,
  // getCurrenciesforDateOne,
  // getCurrenciesforDateTwo,
} from "../api/apiBank";
import dayjs from "dayjs";
import InputsTime from "./InputsTime";
import TableRate from "./TableRate";
import Diagram from "../Diagram/Diagram";

function TimeContainer(props) {
  // debugger;
  let [arrCurrencyDateSelectOne, changeArrCurrencyDateSelectOne] = useState([]);
  let [arrCurrencyDateSelectTwo, changeArrCurrencyDateSelectTwo] = useState([]);

  const [radioValue, setRadioValue] = useState("Table");

  useEffect(() => {
    if (startDate.length !== 0 && endDate.length !== 0) {
      chooseDate();
    }
  }, [props.currency]);

  const [startDate, changeStart] = useState({});
  const [endDate, changeEnd] = useState([]);
  const chooseDate = () => {
    try {
      if (startDate.length !== 0 && endDate.length !== 0) {
        (async () => {
          changeArrCurrencyDateSelectOne([]);
          changeArrCurrencyDateSelectTwo([]);

          let start = dayjs()
            .set("year", startDate.year)
            .set("month", startDate.month - 1)
            .date(startDate.day)
            .format("YYYYMMDD");

          let end = dayjs()
            .set("year", endDate.year)
            .set("month", endDate.month - 1)
            .date(endDate.day)
            .format("YYYYMMDD");

          do {
            props.dates.push(start);
            start++;
          } while (start <= end);

          await getCurrenciesforDate(
            props.currency.twoCurrency,
            props.dates
          ).then((responses) => {
            changeArrCurrencyDateSelectTwo(responses);
          });

          await getCurrenciesforDate(
            props.currency.oneCurrency,
            props.dates
          ).then((responses) => {
            changeArrCurrencyDateSelectOne(responses);
          });

          getUSDRate();

          props.changeDatesArr([]);
        })();
      } else {
        throw new Error("Enter the date");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  let [arrUSD, changeArrUSD] = useState([]);

  async function getUSDRate() {
    let result = await getCurrenciesforDate("USD", props.dates).then((r) => r);
    changeArrUSD(result);
  }

  return (
    <div>
      <InputsTime
        start={startDate}
        end={endDate}
        changeStart={changeStart}
        changeEnd={changeEnd}
        chooseDate={chooseDate}
        setRadioValue={setRadioValue}
        chooseDate={chooseDate}
        radioValue={radioValue}
      />

      {radioValue === "Table" ? (
        <TableRate
          dates={props.dates}
          currency={props.currency}
          currencies={props.currencies}
          arrCurrencyDateSelectOne={arrCurrencyDateSelectOne}
          arrCurrencyDateSelectTwo={arrCurrencyDateSelectTwo}
          activeInput={props.activeInput}
          arrUSD={arrUSD}
        />
      ) : (
        <Diagram
          dates={props.dates}
          arrCurrencyDateSelectOne={arrCurrencyDateSelectOne}
          arrCurrencyDateSelectTwo={arrCurrencyDateSelectTwo}
          currency={props.currency}
          arrUSD={arrUSD}
        />
      )}
    </div>
  );
}

export default TimeContainer;
