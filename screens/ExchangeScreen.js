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
  TouchableHighlight,
  FlatList,
} from "react-native";
import { Input } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import MyHeader from "../components/MyHeader";
import db from "../config.js";
import firebase from "firebase";

export default class ExchangeScreen extends Component {
  constructor() {
    super();
    this.state = {
      userID: firebase.auth().currentUser.email,
      itemName: "",
      itemDescription: "",
      exchangeID: "",
      exchangeStatus: "",
      documentID: "",
      isItemExchangeActive: "",
      userDocumentID: "",
      showFlatList: false,
      dataSource: "",
      itemStatus: "",
      currency: "",
      itemValue: "",
    };
  }

  createUniqueID() {
    return Math.random().toString(36).substring(7);
  }

  getItemExchange = () => {
    var itemExchange = db
      .collection("exchange_requests")
      .where("Username", "==", this.state.userID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().Item_Status !== "Received") {
            this.setState({
              exchangeID: doc.data().Exchange_ID,
              itemName: doc.data().Item_Name,
              itemStatus: doc.data().Item_Status,
              documentID: doc.id,
            });
          }
        });
      });
  };

  getIsItemExchangeActive = () => {
    db.collection("users")
      .where("Username", "==", this.state.userID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            isItemExchangeActive: doc.data().Is_Item_Exchange_Active,
            currency: doc.data().Currency,
          });
        });
      });
  };

  componentDidMount = () => {
    this.getItemExchange();
    this.getIsItemExchangeActive();
  };

  addItem = async () => {
    var randomRequestID = this.createUniqueID();
    this.setState({
      exchangeID: randomRequestID,
    });
    var value = await this.getData();
    db.collection("exchange_requests").add({
      Username: this.state.userID,
      Item_Name: this.state.itemName,
      Item_Description: this.state.itemDescription,
      Exchange_ID: randomRequestID,
      Date: firebase.firestore.FieldValue.serverTimestamp(),
      Item_Status: "Requested",
      Item_Value: value,
    });
    await this.getItemExchange();
    db.collection("users")
      .where("Username", "==", this.state.userID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users")
            .doc(doc.id)
            .update({ Is_Item_Exchange_Active: "true" });
        });
        this.setState({ isItemExchangeActive: "true" });
      });
    this.setState({
      itemName: "",
      itemDescription: "",
      exchangeID: "",
    });
    return Alert.alert("Item Added Successfully", "", [
      {
        text: "OK",
        onPress: () => {
          this.props.navigation.navigate("HomeScreen");
        },
      },
    ]);
  };

  sendNotification = () => {
    db.collection("users")
      .where("Username", "==", this.state.userID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().First_Name;
          var lastName = doc.data().Last_Name;
          db.collection("all_notifications")
            .where("Exchange_ID", "==", this.state.exchangeID)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var bartererID = doc.data().Barterer_ID;
                var itemName = doc.data().Item_Name;
                db.collection("all_notifications").add({
                  Target_User_ID: bartererID,
                  Notification_Message:
                    name + " " + lastName + " received the item " + itemName,
                  Notification_Status: "Unread",
                  Item_Name: itemName,
                });
              });
            });
        });
      });
    db.collection("exchange_requests")
      .where("Exchange_ID", "==", this.state.exchangeID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var docID = doc.id;
          db.collection("exchange_requests").doc(docID).update({
            Item_Status: "Received",
          });
        });
      });
    db.collection("users")
      .where("Username", "==", this.state.userID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            Is_Item_Exchange_Active: "false",
          });
        });
        this.setState({ isItemExchangeActive: "false" });
      });
  };

  getData = async () => {
    var value;
    await fetch(
      "http://data.fixer.io/api/latest?access_key=2a88a47606fbf5c6833e55deafbd1822"
    )
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        var currencyCode = this.state.currency;
        var userCurrencyRate = responseData.rates[currencyCode];
        value = (this.state.itemValue / userCurrencyRate).toString();
        this.setState({
          itemValue: value,
        });
      });
    return value;
  };

  render() {
    if (this.state.isItemExchangeActive === "true") {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View
            style={{
              borderColor: "red",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
            }}
          >
            <Text>Item Name</Text>
            <Text>{this.state.itemName}</Text>
          </View>
          <View
            style={{
              borderColor: "blue",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
            }}
          >
            <Text>Item Status</Text>
            <Text>{this.state.itemStatus}</Text>
          </View>
          <View
            style={{
              borderColor: "blue",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
            }}
          >
            <Text>Item Value</Text>
            <Text>{this.state.itemValue}</Text>
          </View>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "orange",
              width: 300,
              alignSelf: "center",
            }}
            onPress={() => {
              this.sendNotification();
            }}
          >
            <Text>I recieved the item</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{ marginTop: 100 }}>
          <MyHeader title="Exchange" navigation={this.props.navigation} />
          <KeyboardAvoidingView style={styles.keyboardStyle}>
            <Input
              style={styles.formTextInput}
              containerStyle={{ marginTop: RFValue(60) }}
              label={"Enter Book Name"}
              placeholder="Enter Item Name"
              value={this.state.itemName}
              onChangeText={(text) => {
                this.setState({
                  itemName: text,
                });
              }}
            />
            <Input
              style={styles.formTextInput}
              containerStyle={{marginTop: RFValue(30)}}
              label = {"Description"}
              placeholder="Enter Item Description"
              value={this.state.itemDescription}
              multiline
              numberOfLines={10}
              onChangeText={(text) => {
                this.setState({
                  itemDescription: text,
                });
              }}
            />
            <Input
              style={styles.formTextInput}
              containerStyle={{marginTop: RFValue(30)}}
              placeholder="Enter Item Price"
              label={"Price"}
              value={this.state.itemValue}
              multiline
              numberOfLines={10}
              onChangeText={(text) => {
                this.setState({
                  itemValue: text,
                });
              }}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.addItem();
              }}
            >
              <Text>Add Item</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      );
    }
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
  formTextInput: {
    width: "75%",
    height: 35,
    alignSelf: "center",
    borderColor: "black",
    borderRadius: 10,
    borderWidth: 5,
    marginTop: 10,
    padding: 5,
  },
  button: {
    width: "75%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "blue",
    shadowColor: "white",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 15,
    marginTop: 10,
  },
});
