import Input from "../Converter/Input";
const { InputGroup } = require("react-bootstrap");

function InputTime(props) {
  return (
    <InputGroup size="sm" className="mb-3">
      <InputGroup.Text className="timeInput">{props.name} </InputGroup.Text>
      <Input
        maxlength={props.max}
        inputtype={props.inputtype}
        inputText={props.day}
        handleChange={props.handleChangeDate}
      ></Input>
    </InputGroup>
  );
}

export default InputTime;
