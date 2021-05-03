import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import SignUpLoginScreen from "./screens/SignUpLoginScreen";
import { AppDrawerNavigator } from "./components/AppDrawerNavigator";

export default function App() {
  return <AppContainer />;
}

const SwitchNavigator = createSwitchNavigator({
  SignUpLoginScreen: { screen: SignUpLoginScreen },
  BottomTab: { screen: AppDrawerNavigator },
});

const AppContainer = createAppContainer(SwitchNavigator);
