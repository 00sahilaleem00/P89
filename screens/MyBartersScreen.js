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
