import React from "react";
import { Image } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createDrawerNavigator } from "react-navigation-drawer";
import SignUpLoginScreen from "./screens/SignUpLoginScreen";
import ExchangeScreen from "./screens/ExchangeScreen";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import CustomSideBarMenu from "./components/CustomSideBarMenu";

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

const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: AppTabNavigator,
    },
    Settings: {
      screen: SettingsScreen,
    },
  },
  { contentComponent: CustomSideBarMenu },
  { initialRouteName: "Home" }
);

const SwitchNavigator = createSwitchNavigator({
  SignUpLoginScreen: { screen: SignUpLoginScreen },
  BottomTab: { screen: AppDrawerNavigator },
});

const AppContainer = createAppContainer(SwitchNavigator);
