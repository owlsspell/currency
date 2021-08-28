// import axios from "axios";

import { Card, ResourceList, Stack } from "@shopify/polaris";
import axios from "axios";
import { useEffect, useState } from "react";
import { getGoods, setUserOrder } from "../api/api";
import { CardContainer, ShopContainer } from "./Shop.module.css";

export default function Shop(props) {
  // debugger;
  const [goods, setGoods] = useState([]);

  useEffect(() => {
    getGoods().then((response) => {
      setGoods(response.data.goods);
    });
  }, []);
  console.log(goods);

  function setOrder(brand, price) {
    setUserOrder(brand, price, props.infoUser.id).then((response) => {
      console.log(response);
    });
  }
  return (
    <ShopContainer>
      {goods.map((good) => {
        return (
          <CardContainer key={good.id} good={good.id % 2 === 0 ? "" : "green"}>
            <Card
              className="card"
              sectioned
              title={good.brands}
              actions={[
                {
                  content: "Add car",
                  onAction: () =>
                    props.isAuth
                      ? setOrder(good.brands, good.price)
                      : alert("You must be logged in"),
                },
              ]}
            >
              <p>
                Add variants if this product comes in multiple versions, like
                different sizes or colors.
              </p>
              <Card.Section>
                <ResourceList
                  items={[
                    {
                      sales: "Price",
                      amount: "USD$" + good.price,
                    },
                  ]}
                  renderItem={(item) => {
                    const { sales, amount, url } = item;
                    return (
                      <ResourceList.Item>
                        <Stack>
                          <Stack.Item fill>{sales}</Stack.Item>
                          <Stack.Item>{amount}</Stack.Item>
                        </Stack>
                      </ResourceList.Item>
                    );
                  }}
                />
              </Card.Section>
            </Card>
          </CardContainer>
        );
      })}
    </ShopContainer>
  );
}
