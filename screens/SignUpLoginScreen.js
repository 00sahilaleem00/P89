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
import { Input, Icon } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
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
      currency: "",
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
            Currency: this.state.currency,
            Is_Item_Exchange_Active: "false",
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
      .then(() => {
        this.props.navigation.navigate("Home");
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
          <Input
            style={styles.inputBox}
            placeholder={"emailID@example.com"}
            label={"emailID@example.com"}
            keyboardType="email-address"
            onChangeText={(text) => {
              this.setState({
                email: text,
              });
            }}
          />
          <Input
            label={"Password"}
            placeholder={"Password"}
            style={styles.inputBox}
            secureTextEntry={true}
            onChangeText={(text) => {
              this.setState({
                password: text,
              });
            }}
          />
          <Input
            label={"Confirm Password"}
            placeholder={"Confirm Password"}
            style={styles.inputBox}
            secureTextEntry={true}
            onChangeText={(text) => {
              this.setState({
                confirmPassword: text,
              });
            }}
          />
          <Input
            style={styles.inputBox}
            label={"First Name"}
            placeholder={"First Name"}
            onChangeText={(text) => {
              this.setState({
                first_name: text,
              });
            }}
          />
          <Input
            style={styles.inputBox}
            label={"Last Name"}
            placeholder={"Last Name"}
            onChangeText={(text) => {
              this.setState({
                last_name: text,
              });
            }}
          />
          <Input
            style={styles.inputBox}
            label={"Address"}
            placeholder={"Address"}
            onChangeText={(text) => {
              this.setState({
                address: text,
              });
            }}
          />
          <Input
            style={styles.inputBox}
            label={"Contact"}
            placeholder={"contact number"}
            keyboardType="numeric"
            maxLength={10}
            onChangeText={(text) => {
              this.setState({
                mobile_number: text,
              });
            }}
          />
          <Input
            label={"Currency"}
            style={styles.inputBox}
            placeholder={"Currency"}
            onChangeText={(text) => {
              this.setState({
                currency: text,
              });
            }}
          />
          <Icon
            type={"materialicon"}
            name={"cancel"}
            size={RFValue(40)}
            color={"red"}
            onPress={() => {
              this.setState({ isModalVisible: false });
            }}
          />
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
          <Input
            label={"email address"}
            style={styles.inputBox}
            keyboardType="email-address"
            placeholder={"Enter Email ID"}
            onChangeText={(text) => {
              this.setState({
                email: text,
              });
            }}
          />
          <Input
            label={"password"}
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
