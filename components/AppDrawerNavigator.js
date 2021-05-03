import React from "react";
import { createDrawerNavigator } from "react-navigation-drawer";
import { Icon } from "react-native-elements";
import { AppTabNavigator } from "./AppTabNavigator";
import SettingsScreen from "../screens/SettingsScreen";
import MyBartersScreen from "../screens/MyBartersScreen";
import NotificationScreen from "../screens/NotificationScreen";
import CustomSideBarMenu from "./CustomSideBarMenu";

export const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: AppTabNavigator,
    },
    Settings: {
      screen: SettingsScreen,
    },
    MyBarters: {
      screen: MyBartersScreen,
    },
    Notifications: {
      screen: NotificationScreen,
    },
  },
  {
    contentComponent: CustomSideBarMenu,
  },
  {
    initialRouteName: "Home",
  }
);
