import React from "react";
import { createDrawerNavigator } from "react-navigation-drawer";
import { AppTabNavigator } from "./AppTabNavigator";
import CustomSideBarMenu from "./CustomSideBarMenu";
import MyDonationScreen from "../screens/MyDonations";
import NotificationScreen from "../screens/Notifications";
import SettingScreen from "../screens/Setting";
import MyReceivedBooksScreen from "../screens/MyReceivedBooksScreen";

export const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: AppTabNavigator
    },
    MyDonations: {
      screen: MyDonationScreen
    },
    Notifications: {
      screen: NotificationScreen
    },
    MyReceivedBooks: {
      screen: MyReceivedBooksScreen
    },
    Setting: {
      screen: SettingScreen
    }
  },
  {
    contentComponent: CustomSideBarMenu
  },
  {
    initialRouteName: "Home"
  }
);
