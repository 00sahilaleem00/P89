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
import { ListItem } from "react-native-elements";
import db from "../config.js";
import firebase from "firebase";

export default class HomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      allRequests: [],
    };
    this.requestRef = null;
  }

  getAllRequests = () => {
    this.requestRef = db
      .collection("exchange_requests")
      .onSnapshot((snapshot) => {
        var allRequestsArray = snapshot.docs.map((document) => document.data());
        this.setState({
          allRequests: allRequestsArray,
        });
      });
  };

  componentDidMount = () => {
    this.getAllRequests();
  };

  componentWillUnmount = () => {
    this.requestRef();
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => (
    <ListItem key={i} bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.item_name}</ListItem.Title>
        <ListItem.Subtitle>{item.item_description}</ListItem.Subtitle>
        <TouchableOpacity style={styles.button}>
          <Text style={{ color: "#ffff" }}>Exchange</Text>
        </TouchableOpacity>
      </ListItem.Content>
    </ListItem>
  );
  render() {
    return (
      <View style={{ flex: 1, marginTop: 10 }}>
        <View style={{ flex: 1 }}>
          {this.state.allRequests.length === 0 ? (
            <View
              style={{
                flex: 1,
                fontSize: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20 }}>List of all items</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allRequests}
              renderItem={this.renderItem}
            />
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
  button: {
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
});
