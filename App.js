import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import ExchangeScreen from "./screens/ExchangeScreen";
import HomeScreen from "./screens/HomeScreen";
import { Image } from "react-native";

import SignUpLoginScreen from "./screens/SignUpLoginScreen.js";

export default function App() {
  return <AppContainer />;
}

const AppTabNavigator = createBottomTabNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarIcon: (
        <Image
          source={require("./assets/home.png")}
          style={{ width: 20, height: 20 }}
        />
      ),
      tabBarLabel: "Home",
    },
  },
  Exchange: {
    screen: ExchangeScreen,
    navigationOptions: {
      tabBarIcon: (
        <Image
          source={require("./assets/exchange.png")}
          style={{ width: 20, height: 20 }}
        />
      ),
      tabBarLabel: "Exchange",
    },
  },
});

const SwitchNavigator = createSwitchNavigator({
  SignUpLoginScreen: { screen: SignUpLoginScreen },
  BottomTab: { screen: AppTabNavigator },
});

const AppContainer = createAppContainer(SwitchNavigator);
