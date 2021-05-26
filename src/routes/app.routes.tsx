import React from "react";

import { createStackNavigator } from '@react-navigation/stack';

import { Playlist } from '../pages/Playlists';
import { Player } from "../pages/Player";

const App = createStackNavigator();

export const AppRoutes = () => {
  return (
    <App.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Playlist"
    >
      <App.Screen name="Playlist" component={Playlist} />
      <App.Screen name="Player" component={Player} />
    </App.Navigator>
  )
}