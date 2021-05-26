import React from "react";

import { createStackNavigator } from '@react-navigation/stack';

import { SignIn } from '../pages/SignIn';

const Auth = createStackNavigator();

export const AuthRoutes = () => {
  return (
    <Auth.Navigator
      screenOptions={{
        headerShown: false
      }}
      initialRouteName="SignIn"
    >
      <Auth.Screen name="SignIn" component={SignIn} />
    </Auth.Navigator>
  )
}