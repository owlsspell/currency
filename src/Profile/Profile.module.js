import styled from "styled-components";

export const ImgContainer = styled.div``;

export const ImgAvatar = styled.img`
  width: 200px;
  height: auto;
  border-radius: 2em;
`;

export const ContainerProfile = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
  grid-gap: 1em;
  justify-items: center;
`;

export const GridColumn = styled.div`
  padding: 1.2em;
  padding-left: 2em;
`;

export const GridColumnForm = styled.div`
  padding-top: 2em;
  justify-self: start;
  min-width: 300px;
`;
