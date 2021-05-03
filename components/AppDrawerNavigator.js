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
      navigationOptions: {
        drawerIcon: <Icon name="home" type="font-awesome" />,
      },
    },
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {
        drawerIcon: <Icon name="settings" type="font-awesome" />,
        drawerLabel: "settings",
      },
    },
    MyBarters: {
      screen: MyBartersScreen,
      navigationOptions: {
        drawerIcon: <Icon name="gift" type="font-awesome" />,
        drawerLabel: "My Received Books",
      },
    },
    Notifications: {
      screen: NotificationScreen,
      navigationOptions: {
        drawerIcon: <Icon name="bell" type="font-awesome" />,
        drawerLabel: "Notifications",
      },
    },
  },
  {
    contentComponent: CustomSideBarMenu,
  },
  {
    initialRouteName: "Home",
  }
);
