import { Line } from "react-chartjs-2";

const Diagram = (props) => {
  let formateddArrDates = [];
  props.arrCurrencyDateSelectOne.map((data) => {
    formateddArrDates.push(data.data[0].exchangedate);
  });

  const data = (canvas) => {
    const ctx = canvas.getContext("2d");
    const g = ctx.createLinearGradient(0, 0, 100, 0);
    let dataLine1 = props.arrCurrencyDateSelectOne.map((i) => {
      return i.data[0].rate;
    });
    let dataLine2 = props.arrCurrencyDateSelectTwo.map((i) => {
      return i.data[0].rate;
    });
    let dataLineUSD = props.arrUSD.map((i) => {
      return i.data[0].rate;
    });

    return {
      labels: formateddArrDates,
      datasets: [
        {
          label: props.currency.oneCurrency,
          backgroundColor: g,
          borderColor: "rgb(0, 99, 0)",
          data: dataLine1,
        },
        {
          label: props.currency.twoCurrency,
          backgroundColor: g,
          borderColor: "rgb(255, 99, 132)",
          data: dataLine2,
        },
        {
          label: "USD",
          backgroundColor: g,
          borderColor: "rgb(0, 20, 100)",
          data: dataLineUSD,
        },
      ],
    };
  };

  return (
    <div>
      <Line data={data} />
    </div>
  );
};

export default Diagram;
