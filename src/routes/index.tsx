import React from "react";
import { Spinner } from "native-base";

import { Content } from "../components/Content";
import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";
import { useAppSelector } from "../hooks/redux";

export const Routes = () => {
  const { user, isFetching } = useAppSelector((state) => state.auth)

  if (isFetching) {
    return (
      <Content>
        <Spinner color="brand.900" />
      </Content>
    );
  }

  return user ? <AppRoutes /> : <AuthRoutes />;
};