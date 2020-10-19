import React, { Component } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import { ListItem } from "react-native-elements";
import firebase from "firebase";
import db from "../config";
import MyHeader from "../components/MyHeader";

export default class MyReceivedBooksScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      bookList: []
    };
    this.requestRef = null;
  }

  getReceivedBooksList = () => {
    const { userId } = this.state;
    this.requestRef = db
      .collection("requested_books")
      .where("user_id", "==", userId)
      .where("book_status", "==", "received")
      .onSnapshot(snapshot => {
        const bookList = snapshot.docs.map(doc => doc.data());
        this.setState({
          bookList: bookList
        });
      });
  };

  componentDidMount() {
    this.getReceivedBooksList();
  }

  componentWillUnmount() {
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => (
    <ListItem
      key={i}
      title={item.book_name}
      subtitle={item.book_status}
      titleStyle={styles.title}
      bottomDivider
    />
  );

  render() {
    const { bookList } = this.state;
    return (
      <View style={styles.container}>
        <MyHeader title="Received Books" navigation={this.props.navigation} />
        <View style={styles.container}>
          {bookList.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={styles.emptyListText}>
                List Of All Received Books
              </Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={bookList}
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
    flex: 1
  },
  subContainer: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center"
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
      height: 8
    }
  },
  title: {
    color: "black",
    fontWeight: "bold"
  },
  emptyListText: {
    fontSize: 20
  }
});
