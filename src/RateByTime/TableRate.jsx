const { Table } = require("react-bootstrap");

function TableRate(props) {
  return (
    <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>
            {props.activeInput === 0
              ? props.currency.twoCurrency +
                " for 1 " +
                props.currency.oneCurrency
              : props.currency.oneCurrency +
                " for 1 " +
                props.currency.twoCurrency}
          </th>
          <th>USD</th>
        </tr>
      </thead>
      <tbody>
        {props.arrCurrencyDateSelectOne.map((elem, index) => {
          if (elem.data[0].message === "Wrong parameters format") {
            return;
          } else {
            return (
              <tr key={elem.data[0].exchangedate}>
                <td>{elem.data[0].exchangedate}</td>
                <td key={index} className="ml-2">
                  {props.activeInput === 0
                    ? (
                        elem.data[0].rate /
                        props.arrCurrencyDateSelectTwo.find(
                          (n, i) => i === index
                        ).data[0].rate
                      ).toFixed(2)
                    : (
                        props.arrCurrencyDateSelectTwo.find(
                          (n, i) => i === index
                        ).data[0].rate / elem.data[0].rate
                      ).toFixed(2)}
                </td>
                {props.arrUSD.map((el, i) => {
                  if (i === index) {
                    return (
                      <td key={el.data[0].exchangedate}>
                        {el.data[0].rate.toFixed(2)}
                      </td>
                    );
                  }
                })}
              </tr>
            );
          }
        })}
      </tbody>
    </Table>
  );
}

export default TableRate;
