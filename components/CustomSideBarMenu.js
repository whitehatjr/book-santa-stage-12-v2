import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { DrawerItems } from "react-navigation-drawer";
import { Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";

import firebase from "firebase";
import db from "../config";

import CustomButton from "./CustomButton";

export default class CustomSideBarMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      image: "#",
      name: "",
      docId: ""
    };
  }

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.cancelled) {
      const { userId } = this.state;
      this.uploadImage(result.uri, userId);
    }
  };

  uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName)
      .put(blob)
      .then(response => {
        this.fetchImage(imageName);
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  fetchImage = imageName => {
    firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName)
      .getDownloadURL()
      .then(url => {
        this.setState({ image: url });
      })
      .catch(error => {
        this.setState({ image: "#" });
      });
  };

  getUserProfile = () => {
    const { userId } = this.state;
    db.collection("users")
      .where("email_id", "==", userId)
      .onSnapshot(snapshot => {
        snapshot.docs.map(doc => {
          this.setState({
            name: `${doc.data().first_name} ${doc.data().last_name}`,
            docId: doc.id,
            image: doc.data().image
          });
        });
      });
  };

  componentDidMount() {
    const { userId } = this.state;
    this.fetchImage(userId);
    this.getUserProfile();
  }

  render() {
    const { image, name } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.upperContainer}>
          <Avatar
            rounded
            source={{ uri: image }}
            size="medium"
            onPress={() => this.pickImage()}
            containerStyle={styles.avatarContainer}
            showEditButton
          />

          <Text style={styles.name}>{name}</Text>
        </View>
        <View style={styles.middleContainer}>
          <DrawerItems {...this.props} />
        </View>
        <View style={styles.lowerContainer}>
          <CustomButton
            title={"Log Out"}
            style={styles.button}
            titleStyle={styles.buttonText}
            onPress={() => {
              this.props.navigation.navigate("Login");
              firebase.auth().signOut();
            }}
          />
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  upperContainer: {
    flex: 0.4,
    backgroundColor: "#6fc0b8",
    justifyContent: "center",
    alignItems: "center"
  },
  avatarContainer: {
    width: "60%",
    height: "50%",
    borderRadius: 200
  },
  middleContainer: {
    flex: 0.4,
    paddingTop: 30
  },
  lowerContainer: {
    flex: 0.2,
    justifyContent: "flex-end",
    paddingBottom: 30
  },
  name: {
    fontWeight: "100",
    fontSize: 20,
    paddingTop: 10
  },
  button: {
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 0,
    padding: 10,
    shadowColor: "#fff",
    elevation: 0
  },
  buttonText: {
    fontWeight: "bold",
    color: "#000"
  }
});
