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
    };
  }

  createUniqueID() {
    return Math.random().toString(36).substring(7);
  }

  addItem = () => {
    var randomRequestID = this.createUniqueID();
    console.log(randomRequestID);
    this.setState({
      exchangeID: randomRequestID,
    });
    db.collection("exchange_requests").add({
      Item_Name: this.state.itemName,
      Item_Description: this.state.itemDescription,
      Username: this.state.userID,
      Exchange_ID: randomRequestID,
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

  render() {
    return (
      <View style={{ marginTop: 100 }}>
        <MyHeader title="Exchange" navigation={this.props.navigation} />
        <KeyboardAvoidingView style={styles.keyboardStyle}>
          <TextInput
            style={styles.formTextInput}
            placeholder="Enter Item Name"
            value={this.state.itemName}
            onChangeText={(text) => {
              this.setState({
                itemName: text,
              });
            }}
          />
          <TextInput
            style={styles.formTextInput}
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
