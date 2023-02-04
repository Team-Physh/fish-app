import {useState} from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import Footer from '../components/Footer'
import HelpIcon from '../components/HelpIcon'
import * as SQLite from 'expo-sqlite'
import {downloadDatabase} from '../database/databasefunctions'

export default function HomeScreen({navigation}) {

  // pit constant
  const [pitTag, setPit] = useState({
    number: '',
  });

  function enterTag(number)
  {
  const db = SQLite.openDatabase("fish.db");

      // testing function that prints out whatever index of data your tryna see. Can also print whole thing
    const printInfo = (_array) => {
    //console.log(Object.values(_array[1]));
    console.log(_array);

    };

  db.transaction(tx => {

        // function for testing, just selects the table to print it out and stuff. printInfo above is called for this
        tx.executeSql(
        "select * from fishTable where hex = ?",
        [number],
        // success
        (_, { rows: { _array } }) => printInfo(_array),
        // error
        () => console.log("error fetching")
                    );

    });
  }

    return (
        <View style={styles.container}>
          <HelpIcon />
            <TouchableOpacity style={styles.syncButton} onPress={() => downloadDatabase()}>
              <Text style={styles.buttonText}>Download DB </Text>
            </TouchableOpacity>
            <Text style={styles.boxText}>Scanning Screen</Text>
            <TextInput
                style={styles.textIn}
                autoCapitalize="none"
                onChangeText={text => setPit({ number: text})}
                label={"Username"}
                placeholder="Enter PIT tag"
              />
            <TouchableOpacity style={styles.sendButton} onPress={() => enterTag(pitTag.number)}>
              <Text style={styles.buttonText}>ENTER </Text>
            </TouchableOpacity>
            <Footer />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center'
    },
    boxText:{
        color: 'black',
        fontSize: 15,
        textAlign: 'center',
        top: "30%",
    },
    sendButton:{
      backgroundColor: 'lightblue',
      height: '10%',
      width: '50%',
      justifyContent: 'center',
      borderRadius: 50,
      top: "30%",
    },

    syncButton:{
      backgroundColor: 'lightgreen',
      height: '10%',
      width: '50%',
      justifyContent: 'center',
      borderRadius: 50,
      top: "15%",
    },

    buttonText:{
      color: 'black',
      fontSize: 25,
      textAlign: 'center',
    },

    textIn: {
    borderWidth: 2,
    alignSelf: 'center',
    width: "70%",
    height: 40,
    marginTop: 10,
    marginBottom: 10,
    color: 'black',
    fontSize: "20px",
    textAlign: "center",
    top: "30%",
    }
  
  });
  
