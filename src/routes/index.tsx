import React from "react";
import { ActivityIndicator } from "react-native";

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";
import { useAppSelector } from "../hooks/redux";
import { Box } from "native-base";

export const Routes = () => {
  const { user, isFetching } = useAppSelector((state) => state.auth)

  if (isFetching) {
    return (
      <Box flex={1}>
        <ActivityIndicator size="large" color="#999" />
      </Box>
    );
  }

  return user ? <AppRoutes /> : <AuthRoutes />;
};