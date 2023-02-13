import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Footer from '../components/Footer';
import {useEffect, useState} from 'react';
import * as SQLite from 'expo-sqlite'

export default function ViewScreen({navigation}) {

  const [data, setData] = useState([]);

  useEffect(() => {
    const db = SQLite.openDatabase("fish.db");
    db.transaction(tx => {
  
      //upload data to local database
      const storeInfo = (_array) => {
        //var count = Object.keys(_array).length;
        //console.log(_array);
        //9891031619722

        var count = Object.keys(_array).length;

        // if catch table not empty, store in data field
        if(count >= 0)
        {
          setData(_array);
        }

        };

        tx.executeSql(
          "select * from catchTable",
          [],
          // success
          (_, { rows: { _array } }) => storeInfo(_array),
          // error
          () => console.log("error fetching")
                      );
    });
  }, []);

    return (
        <View style={styles.container}>
         <TouchableOpacity  style ={styles.help} onPress={() => navigation.navigate('HelpScreen')}>
                      <Image style={ styles.icon } source={require('../assets/question.png')}></Image>
          </TouchableOpacity>
          <View style={styles.header}>
            <Text style={styles.headerText}>Stored Catches</Text>
          </View>


            <FlatList
              ListHeaderComponent={() => (
                <View style={styles.listHead}>
                </View>
              )}
              data={data}
              renderItem={({item}) => (
                <View style={styles.itemRow}>
                  <Text>
                  {item.hex}, {item.species}
                  </Text>
                </View>
              )}
              keyExtractor={(item) => item.hex}
            />
            <Footer />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    icon:{
      height: 50,
      width: 50,
      resizeMode: 'contain',
      top: 50,
      right:20,
      position: 'absolute',
    },

      help:{
      zIndex: 1,
    },

    itemRow:{
      justifyContent:'center',
    },

    page:{
      justifyContent: 'center',
      width: "100%",
      height: "100%",
    },

    page:{
      backgroundColor: 'pink',
      justifyContent: 'center',
      width: "100%",
      height: "100%",
    },

    header:{
      width: "100%",
      height: "15%",
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
      backgroundColor: 'rgba(1, 1, 1, .1)',
      borderRadius: 20,
    },

    headerText:{
      fontWeight: 'bold',
      bottom: 0,
      position: 'absolute',
      alignSelf: 'center',
      fontSize: 30,
      
    }

  
  });
  
