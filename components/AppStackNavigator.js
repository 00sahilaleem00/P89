import React from "react";
import { Image } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import UserDetailsScreen from "../screens/UserDetailsScreen";
import { createStackNavigator } from "react-navigation-stack";

export const AppStackNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    UserDetails: {
      screen: UserDetailsScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  { initialRouteName: "Home" }
);
