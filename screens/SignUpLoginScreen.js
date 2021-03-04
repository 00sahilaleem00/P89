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
import db from "../config.js";
import firebase from "firebase";

export default class SignUpLoginScreen extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      first_name: "",
      last_name: "",
      address: "",
      mobile_number: "",
      isModalVisible: false,
    };
  }

  userSignUp(email, password, confirmPassword) {
    if (password != confirmPassword) {
      Alert.alert("Passwords Must Match!");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          db.collection("users").add({
            Address: this.state.address,
            First_Name: this.state.first_name,
            Last_Name: this.state.last_name,
            Mobile_Number: this.state.mobile_number,
            Username: this.state.email,
          });
          return Alert.alert("User Added Successfully", "", [
            {
              text: "OK",
              onPress: () => {
                this.setState({
                  isModalVisible: false,
                });
              },
            },
          ]);
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          return Alert.alert(errorMessage);
        });
    }
  }

  userLogin = (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        return Alert.alert("User Logged In Successfully");
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        return Alert.alert(errorMessage);
      });
  };

  showModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={false}
        visible={this.state.isModalVisible}
      >
        <View style={styles.modalContainer}></View>
        <ScrollView style={{ width: "80%" }} />
        <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
          <Text style={styles.modalTitle}>REGISTRATION</Text>
          <TextInput
            style={styles.inputBox}
            placeholder={"emailID@example.com"}
            keyboardType="email-address"
            onChangeText={(text) => {
              this.setState({
                email: text,
              });
            }}
          />
          <TextInput
            style={styles.inputBox}
            secureTextEntry={true}
            onChangeText={(text) => {
              this.setState({
                password: text,
              });
            }}
          />
          <TextInput
            style={styles.inputBox}
            secureTextEntry={true}
            onChangeText={(text) => {
              this.setState({
                confirmPassword: text,
              });
            }}
          />
          <TextInput
            style={styles.inputBox}
            placeholder={"First Name"}
            onChangeText={(text) => {
              this.setState({
                first_name: text,
              });
            }}
          />
          <TextInput
            style={styles.inputBox}
            placeholder={"Last Name"}
            onChangeText={(text) => {
              this.setState({
                last_name: text,
              });
            }}
          />
          <TextInput
            style={styles.inputBox}
            placeholder={"Address"}
            onChangeText={(text) => {
              this.setState({
                address: text,
              });
            }}
          />
          <TextInput
            style={styles.inputBox}
            placeholder={"contact number"}
            keyboardType="numeric"
            maxLength={10}
            onChangeText={(text) => {
              this.setState({
                mobile_number: text,
              });
            }}
          />
          <TouchableOpacity
            onPress={() => {
              this.setState({ isModalVisible: false });
            }}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.userSignUp(
                this.state.email,
                this.state.password,
                this.state.confirmPassword
              );
            }}
          >
            <Text>REGISTER</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>{this.showModal()}</View>
        <View>
          <TextInput
            style={styles.inputBox}
            keyboardType="email-address"
            placeholder={"Enter Email ID"}
            onChangeText={(text) => {
              this.setState({
                email: text,
              });
            }}
          />
          <TextInput
            style={styles.inputBox}
            secureTextEntry={true}
            placeholder={"Enter Password"}
            onChangeText={(text) => {
              this.setState({
                password: text,
              });
            }}
          />
        </View>

        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.userLogin(this.state.email, this.state.password);
            }}
          >
            <Text>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.setState({
                isModalVisible: true,
              });
            }}
          >
            <Text>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  inputBox: {
    margin: 10,
    borderWidth: 2,
  },
  button: {
    margin: 10,
    backgroundColor: "blue",
  },
  modalContainer: {
    margin: 10,
  },
  keyboardAvoidingView: {
    margin: 10,
  },
  modalTitle: {
    backgroundColor: "green",
  },
});
