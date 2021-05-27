import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from "@react-navigation/stack";
import { Icon } from "native-base";
import { Ionicons } from '@expo/vector-icons'

import { Playlist } from '../pages/Playlists';
import { Player } from "../pages/Player";
import { Menu } from "../pages/Menu";

const App = createBottomTabNavigator();

const Playlists = createStackNavigator()

const Home = () => {
  return (
    <Playlists.Navigator
      initialRouteName="Playlist"
      screenOptions={{
        headerShown: false
      }}
    >
      <Playlists.Screen 
        name="Playlist" 
        component={Playlist}
      />
      <App.Screen 
        name="Player" 
        component={Player} 
      />
    </Playlists.Navigator>
  )
}

export const AppRoutes = () => {
  return (
    <App.Navigator
      initialRouteName="Playlist"
      tabBarOptions={{
        activeBackgroundColor: '#171717',
        inactiveBackgroundColor: '#171717',
        showLabel: false,
      }}
    >
      <App.Screen 
        name="Home" 
        component={Home} 
        options={{
          tabBarIcon({ focused }) {
            return (
              <Icon 
                as={<Ionicons name='home' />} 
                color={focused ? 'brand.900' : 'white'}
              />
            )
          }
        }}
      />
      <App.Screen 
        name="Menu" 
        component={Menu} 
        options={{
          tabBarIcon({ focused }) {
            return (
              <Icon 
                as={<Ionicons name='person' />} 
                color={focused ? 'brand.900' : 'white'}
              />
            )
          }
        }}
      />
    </App.Navigator>
  )
}