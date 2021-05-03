import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { DrawerItems } from "react-navigation-drawer";
import { Header, Icon, Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { RFValue } from "react-native-responsive-fontsize";
import db from "../config";
import firebase from "firebase";

export default class CustomSideBarMenu extends Component {
  state = {
    image: "#",
    userID: firebase.auth().currentUser.email,
    name: "",
    documentID: "",
  };

  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!cancelled) {
      this.setState({
        image: uri,
      });
      this.uploadImage(uri, this.state.userID);
    }
  };

  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();
    var ref = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);
    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };

  getUserProfile() {
    db.collection("users")
      .where("User_ID", "==", this.state.userID)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            name: doc.data().First_Name + " " + doc.data().Last_name,
          });
        });
      });
  }

  fetchImage = async (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);
    storageRef.getDownloadURL().then((url) => {
      try {
        this.setState({
          image: url,
        });
      } catch (error) {
        console.log(error.message);
        this.setState({
          image: "#",
        });
      }
    });
  };

  componentDidMount() {
    this.getUserProfile();
    this.fetchImage(this.state.userID);
  }

  render() {
    return (
      <View style={{ flex: 1, marginTop: 50 }}>
        <Avatar
          rounded
          source={{ uri: this.state.image }}
          size="medium"
          onPress={() => {
            this.selectPicture();
          }}
          showEditButton
        />
        <Text style={{ fontWeight: "bold", fontSize: RFValue(20), padding: 5 }}>
          {this.state.name}
        </Text>
        <DrawerItems {...this.props} />
        <View
          style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 30 }}
        >
          <TouchableOpacity
            style={{
              justifyContent: "center",
              padding: 10,
              height: 30,
              width: "100%",
            }}
            onPress={() => {
              this.props.navigation.navigate("SignUpLoginScreen");
              firebase.auth().signOut();
            }}
          >
            <Icon
              name="logout"
              type="antdesign"
              size={RFValue(20)}
              iconStyle={{ paddingLeft: RFValue(10) }}
            />
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
