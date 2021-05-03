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

export default class SettingsScreen extends Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      contactNumber: "",
      address: "",
      docID: "",
    };
  }
  getUserDetails = () => {
    var user = firebase.auth().currentUser;
    var email = user.email;
    db.collection("users")
      .where("Username", "==", email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            emailID: data.Username,
            firstName: data.First_Name,
            lastName: data.Last_Name,
            contactNumber: data.Mobile_Number,
            address: data.Address,
            docID: doc.id,
          });
        });
      });
  };
  updateUserDetails = () => {
    db.collection("users")
      .doc(this.state.docID)
      .update({
        First_Name: this.state.firstName,
        Last_Name: this.state.lastName,
        Mobile_Number: this.state.contactNumber,
        Address: this.state.address,
      })
      .then(() => {
        Alert.alert("User details successfully updated");
      });
  };
  componentDidMount = () => {
    this.getUserDetails();
  };
  render() {
    return (
      <View style={styles.container}>
        <MyHeader title="Settings" navigation={this.props.navigation} />
        <TextInput
          placeholder={"First Name"}
          onChangeText={(text) => {
            this.setState({
              firstName: text,
            });
          }}
          value={this.state.firstName}
        />
        <TextInput
          placeholder={"Last Name"}
          onChangeText={(text) => {
            this.setState({
              lastName: text,
            });
          }}
          value={this.state.lastName}
        />
        <TextInput
          placeholder={"contactNumber"}
          keyboardType={"numeric"}
          maxLength={10}
          onChangeText={(text) => {
            this.setState({
              contactNumber: text,
            });
          }}
          value={this.state.contactNumber}
        />
        <TextInput
          placeholder={"Address"}
          multiline={true}
          onChangeText={(text) => {
            this.setState({
              address: text,
            });
          }}
          value={this.state.address}
        />
        <TouchableOpacity
          onPress={() => {
            this.updateUserDetails();
          }}
        >
          <Text>Save</Text>
        </TouchableOpacity>
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
