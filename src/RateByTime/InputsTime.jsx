import InputsTimeContainer from "./InputsTimeContainer";

import { ButtonGroup, ToggleButton } from "react-bootstrap";

const { Button, Col, Row } = require("react-bootstrap");

function InputsTime(props) {
  return (
    <div>
      <Row className="mt-5">
        <Col>
          Start
          <InputsTimeContainer
            start={props.start}
            inputtype="start"
            changeStart={props.changeStart}
          />
        </Col>
        <Col>
          End
          <InputsTimeContainer
            end={props.end}
            inputtype="end"
            changeEnd={props.changeEnd}
          />
        </Col>
        <Col className="buttonContainer">
          <Row className="mb-2">
            <Button variant="primary" onClick={props.chooseDate}>
              Convert
            </Button>
          </Row>
          <Row>
            <ButtonGroup className="ml-5">
              <ToggleButton
                type="radio"
                name="radio"
                value="Table"
                onClick={(e) => {
                  props.setRadioValue(e.target.innerHTML);
                  props.chooseDate();
                }}
                checked={"Table" === props.radioValue}
              >
                Table
              </ToggleButton>
              <ToggleButton
                type="radio"
                name="radio"
                value="Diagram"
                checked={"Diagram" === props.radioValue}
                onClick={(e) => {
                  props.setRadioValue(e.target.innerHTML);
                  props.chooseDate();
                }}
              >
                Diagram
              </ToggleButton>
            </ButtonGroup>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default InputsTime;
