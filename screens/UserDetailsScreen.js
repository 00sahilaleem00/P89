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
} from "react-native";
import { Card } from "react-native-elements";
import db from "../config.js";
import firebase from "firebase";

export default class UserDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: firebase.auth().currentUser.email,
      exchangerID: this.props.navigation.getParam("details")["Username"],
      itemName: this.props.navigation.getParam("details")["Item_Name"],
      exchangeID: this.props.navigation.getParam("details")["Exchange_ID"],
      exchangerName: "",
      exchangerContact: "",
      exchangerAddress: "",
    };
  }

  componentDidMount = () => {
    this.getUserDetails();
  };

  getUserDetails = () => {
    db.collection("users")
      .where("Username", "==", this.state.exchangerID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            exchangerName: doc.data().First_Name,
            exchangerContact: doc.data().Mobile_Number,
            exchangerAddress: doc.data().Address,
          });
        });
      });
  };

  addBarters = () => {
    db.collection("my_barters").add({
      Item_Name: this.state.itemName,
      Barterer_ID: this.state.userID,
      Exchanger_ID: this.state.exchangerID,
      Exchanger_Name: this.state.exchangerName,
      Exchanger_Contact: this.state.exchangerContact,
      Exchanger_Address: this.state.exchangerAddress,
      Exchange_ID: this.state.exchangeID,
      Exchange_Status: "Interested",
    });
  };

  addNotification = () => {
    var message =
      this.state.userID + " has shown interest in donating the book";
    db.collection("all_notifications").add({
      Target_User_ID: this.state.exchangerID,
      Barterer_ID: this.state.userID,
      Exchange_ID: this.state.exchangeID,
      Item_Name: this.state.itemName,
      Date: firebase.firestore.FieldValue.serverTimestamp(),
      Notification_Status: "Unread",
      Notification_Message: message,
    });
  };

  render() {
    return (
      <View style={{ marginTop: 100 }}>
        <View style={{ flex: 0.7 }}>
          <Text style={{ fontWeight: "500", fontSize: 20 }}>
            Exchanger Information
          </Text>
          <Text
            style={{
              fontWeight: "400",
              fontSize: 20,
              marginTop: 30,
            }}
          >
            Name: {this.state.exchangerName}
          </Text>
          <Text>Contact: {this.state.exchangerContact}</Text>
          <Text>Address: {this.state.exchangerAddress}</Text>
          <View
            style={{
              flex: 0.6,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 200,
            }}
          >
            <Text>ID of Exchanger: {this.state.exchangerID}</Text>
            <Text>Name of Item: {this.state.itemName}</Text>
          </View>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {this.state.exchangerID !== this.state.userID ? (
            <TouchableOpacity
              style={{ margin: 100, marginTop: 500 }}
              onPress={() => {
                this.addBarters();
                this.addNotification();
                this.props.navigation.navigate("Home");
              }}
            >
              <Text>I want to Barter</Text>
            </TouchableOpacity>
          ) : null}
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
