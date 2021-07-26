import { Col } from "react-bootstrap";
import InputTime from "./InputTime";

const InputsTimeContainer = (props) => {
  function checkLength(val) {
    return val.length < 2 ? "0" + val : val;
  }

  const handleChangeDay = (event) => {
    let attr = event.target.attributes.inputtype.nodeValue;
    let val = event.target.value;
    if (attr === "start") {
      props.changeStart({ ...props.start, day: checkLength(val) });
    } else {
      props.changeEnd({ ...props.end, day: checkLength(val) });
    }
  };

  const handleChangeMonth = (event) => {
    let attr = event.target.attributes.inputtype.nodeValue;

    let val = event.target.value;

    if (attr === "start") {
      props.changeStart({ ...props.start, month: checkLength(val) });
    } else {
      props.changeEnd({ ...props.end, month: checkLength(val) });
    }
  };

  const handleChangeYear = (event) => {
    let attr = event.target.attributes.inputtype.nodeValue;
    let val = event.target.value;
    if (attr === "start") {
      props.changeStart({ ...props.start, year: checkLength(val) });
    } else {
      props.changeEnd({ ...props.end, year: checkLength(val) });
    }
  };

  return (
    <Col>
      <InputTime
        max="31"
        inputtype={props.inputtype}
        name="Day"
        time={props.day}
        handleChangeDate={handleChangeDay}
      ></InputTime>
      <InputTime
        max="12"
        inputtype={props.inputtype}
        name="Month"
        time={props.month}
        handleChangeDate={handleChangeMonth}
      ></InputTime>
      <InputTime
        max="2021"
        inputtype={props.inputtype}
        name="Year"
        time={props.year}
        handleChangeDate={handleChangeYear}
      ></InputTime>
    </Col>
  );
};

export default InputsTimeContainer;
