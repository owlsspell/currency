import React from "react";
import { Navigation } from "@shopify/polaris";
import {
  HomeMajor,
  OrdersMajor,
  OnlineStoreMajor,
  ProfileMajor,
} from "@shopify/polaris-icons";
import { Link, useLocation } from "react-router-dom";

export default function NavMenu(props) {
  let location = useLocation();

  return (
    <Navigation location={location.pathname}>
      <Navigation.Section
        items={[
          {
            // url: "/",

            label: <Link to="/">Home</Link>,
            icon: HomeMajor,
            exactMatch: true,
          },
        ]}
      />
      <Navigation.Section
        items={[
          {
            // url: "/profile",
            label: <Link to="/profile">My Profile</Link>,
            icon: ProfileMajor,
            // badge: "15",
            exactMatch: true,
          },
        ]}
      />
      <Navigation.Section
        items={[
          {
            // url: "/shop",
            label: <Link to="/shop">Shop</Link>,
            icon: OnlineStoreMajor,
            exactMatch: true,
          },
        ]}
      />
      <Navigation.Section
        items={[
          {
            // url: "/orders",
            label: <Link to="/orders">My orders</Link>,
            icon: OrdersMajor,
          },
        ]}
      />
    </Navigation>
  );
}
