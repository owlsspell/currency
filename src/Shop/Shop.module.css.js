import styled from "styled-components";

export const ShopContainer = styled.div`
  display: grid;
  grid-gap: 1em;
  /* grid-auto-rows: 200px auto;
  grid-auto-columns: 400px auto; */

  /* grid-template: minmax(200px, auto) / 1fr 2fr 1fr minmax(400px, auto); */
  grid-template: auto / repeat(3, 1fr);
`;

export const CardContainer = styled.div`
  div {
    background-color: ${(props) => (props.good ? "#e5f8d6 " : "")};
    border-radius: 1em;
  }
  justify-self: center;
  align-self: center;
`;
