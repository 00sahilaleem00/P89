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
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Card, Icon, ListItem } from "react-native-elements";
import MyHeader from "../components/MyHeader";
import db from "../config.js";
import firebase from "firebase";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default class MyBartersScreen extends Component {
  constructor() {
    super();
    this.state = {
      userID: firebase.auth().currentUser.email,
      allBarters: [],
    };
    this.requestRef = null;
  }

  getAllBarters = () => {
    this.requestRef = db
      .collection("my_barters")
      .where("Barterer_ID", "==", this.state.userID)
      .onSnapshot((snapshot) => {
        var allBartersArray = [];
        snapshot.docs.map((doc) => {
          var barter = doc.data();
          barter["Document_ID"] = doc.id;
          allBartersArray.push(barter);
        });
        this.setState({
          allBarters: allBartersArray,
        });
      });
  };

  componentDidMount = () => {
    this.getAllBarters();
  };

  componentWillUnmount = () => {
    this.requestRef();
  };

  sendNotification = (itemDetails, exchangeStatus) => {
    var exchangeID = itemDetails.Exchange_ID;
    var bartererID = itemDetails.Barterer_ID;
    db.collection("all_notifications")
      .where("Exchange_ID", "==", exchangeID)
      .where("Barterer_ID", "==", bartererID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var message = "";
          if (exchangeStatus === "Sent") {
            message = bartererID + " sent you the iten";
          } else {
            message = bartererID + " has shown interest";
          }
          db.collection("all_notifications").doc(doc.id).update({
            Notification_Message: message,
            Notification_Status: "Unread",
            Date: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
      });
  };

  sendItem = async (itemDetails) => {
    if (itemDetails.Exchange_Status === "Sent") {
      var docID;
      var exchangeStatus = "Interested";
      await db
        .collection("my_barters")
        .where("Exchange_ID", "==", itemDetails.Exchange_ID)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            docID = doc.id;
          });
        });

      db.collection("my_barters").doc(docID).update({
        Exchange_Status: "Interested",
      });

      this.sendNotification(itemDetails, exchangeStatus);
    } else {
      var docID;
      var exchangeStatus = "Sent";
      await db
        .collection("my_barters")
        .where("Exchange_ID", "==", itemDetails.Exchange_ID)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            docID = doc.id;
          });
        });
      db.collection("my_barters").doc(docID).update({
        Exchange_Status: "Sent",
      });
      this.sendNotification(itemDetails, exchangeStatus);
    }
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => (
    <ListItem key={i} bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.Item_Name}</ListItem.Title>
        <ListItem.Subtitle>
          {"Requested By:" +
            item.Exchanger_ID +
            "\n Status: " +
            item.Exchange_Status}
        </ListItem.Subtitle>
        <TouchableOpacity
          style={{
            backgroundColor:
              item.Exchange_Status === "Sent" ? "green" : "#ff5722",
          }}
          onPress={() => {
            this.sendItem(item);
          }}
        >
          <Text style={{ color: "#ffff" }}>
            {item.Exchange_Status === "Sent" ? "Sent" : "Exchange"}
          </Text>
        </TouchableOpacity>
      </ListItem.Content>
    </ListItem>
  );

  render() {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, marginTop: 100 }}>
          <MyHeader navigation={this.props.navigation} title="My Barters" />
          <View style={{ flex: 1 }}>
            {this.state.allBarters.length === 0 ? (
              <View style={{ margin: 10 }}>
                <Text style={{ fontSize: 20 }}>List of all Barters</Text>
              </View>
            ) : (
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.allBarters}
                renderItem={this.renderItem}
              />
            )}
          </View>
        </View>
      </SafeAreaProvider>
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
