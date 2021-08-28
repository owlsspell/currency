import { Card, DataTable, Page } from "@shopify/polaris";
import axios from "axios";
import { useEffect, useState } from "react";
import { getUserOrders } from "../api/api";

export default function Orders(props) {
  // debugger;

  let [orders, setOrders] = useState([]);

  function getOrders() {
    let token = localStorage.getItem("token");

    getUserOrders(token).then((response) => {
      setOrders(response.data.orders);
    });
  }
  useEffect(() => {
    getOrders();
  }, []);

  let sumPrice = orders.reduce((acc, order) => acc + order.price, 0);
  let sumCount = orders.reduce((acc, order) => acc + order.count_item, 0);

  return (
    <div>
      <Page title="The orders you made">
        <Card>
          <DataTable
            columnContentTypes={["text", "numeric", "numeric"]}
            headings={["Order", "Price", "Count item"]}
            rows={orders.map((order) => {
              return [order.order_name, order.price + "$", order.count_item];
            })}
            totals={["", sumPrice + "$", sumCount]}
          />
        </Card>
      </Page>
    </div>
  );
}
