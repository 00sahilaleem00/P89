import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
  Header,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import { ListItem, Icon } from "react-native-elements";
import MyHeader from "../components/MyHeader";
import db from "../config.js";
import firebase from "firebase";
import SwipeableFlatList from "../components/SwipeableFlatList";

export default class NotificationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: firebase.auth().currentUser.email,
      allNotifications: [],
    };
    this.notificationRef = null;
  }

  getNotifications = () => {
    this.requestRef = db
      .collection("all_notifications")
      .where("Notification_Status", "==", "Unread")
      .where("Target_User_ID", "==", this.state.userID)
      .onSnapshot((snapshot) => {
        var allNotifications = [];
        snapshot.docs.map((doc) => {
          var notification = doc.data();
          notification["Document_ID"] = doc.id;
          allNotifications.push(notification);
        });
        this.setState({
          allNotifications: allNotifications,
        });
      });
  };

  componentDidMount = () => {
    this.getNotifications();
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, index }) => (
    <ListItem key={index} bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.Item_Name}</ListItem.Title>
        <ListItem.Subtitle>{item.Notification_Message}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.1 }}>
          <MyHeader
            title={"Notifications"}
            navigation={this.props.navigation}
          />
        </View>
        <View style={{ flex: 0.9 }}>
          {this.state.allNotifications.length === 0 ? (
            <View style={{ margin: 10 }}>
              <Text style={{ fontSize: 20 }}>You have no Notifications</Text>
            </View>
          ) : (
            <SwipeableFlatList allNotifications={this.state.allNotifications} />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  inputBox: {
    margin: 10,
    borderWidth: 2,
  },
  modalContainer: {
    margin: 10,
  },
  keyboardAvoidingView: {
    margin: 10,
  },
  modalTitle: {
    backgroundColor: "red",
  },
});
