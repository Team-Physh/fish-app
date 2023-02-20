import { Alert, FlatList, Modal, StyleSheet, Text, View, Image, TouchableOpacity, Linking } from 'react-native';
import Footer from '../components/Footer'
import {useState, useEffect} from 'react';
import * as SQLite from 'expo-sqlite';
import {clearLocal, clearRecent} from '../database/databasefunctions';


export default function MoreScreen({navigation}) {
  // history modal
  const [historyVisible, setHistoryVisible] = useState(false);

  // data for history
  const [data, setData] = useState([]);

  // data for clearing
  const [cleared, setCleared] = useState(false);

  // species
  const getSpecies=(species)=>{

    if(species=="RBT")
    {
      return "Rainbow Trout";
    }
    else if (species == "BNT")
    {
      return "Brown Trout";
    }
  }

  const rowStyle = (index) => ({
    borderBottomColor: '#4a5760',
    borderLeftColor: 'white',
    borderRightColor: 'white',
    borderTopColor: 'white',
    borderBottomWidth: 3,
    width: "100%",
    height: 100,
    alignSelf: 'center',
    justifyContent: 'center',
    zIndex: 0,
    backgroundColor: index % 2 === 0 ? '#d8fafb' : '#b6d8dc',
  });


  function clearHistory()
  {
    const db = SQLite.openDatabase("fish.db");

      db.transaction(tx => {
  
        // drop old table on app start (MIGHT REMOVE)
        tx.executeSql("DROP TABLE IF EXISTS history;", []);
    });

    setData([]); openHistory();

    
  }

  function openHistory()
  {
    // get history
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
          "select * from history",
          [],
          // success
          (_, { rows: { _array } }) => storeInfo(_array),
          // error
          () => console.log("history empty error")
                      );
    });


    // make visible
    setHistoryVisible(true);

    
  }



    return (
        <View style={styles.container}>
            {/* <TouchableOpacity  style ={styles.help} onPress={() => navigation.navigate('HelpScreen')}>
                      <Image style={ styles.icon } source={require('../assets/question.png')}></Image>
            </TouchableOpacity> */}


        <Modal
        animationType="slide"
        transparent={true}
        visible={historyVisible}
        >
        <View style={styles.bgmodal}>

          <View style={styles.modalView}>

          <TouchableOpacity style={styles.closeIcon} onPress={() => setHistoryVisible(false)}>
                <Image style={styles.Modalicon} source={require('../assets/exit.png')}></Image>
          </TouchableOpacity>


          

          <View style={styles.header}>

          <TouchableOpacity style={styles.clearIcon} onPress={() => {Alert.alert(
                                                                      "Clearing History",
                                                                      "This will clear your fishing history. Are you sure you want to continue?",
                                                                      [
                                                                        { text: "Cancel" },
                                                                        { text: "Clear",
                                                                          onPress: () => clearHistory()}
                                                                      ]
                                                                    );} }>
            <Text style={styles.headerText}>Clear</Text>
          </TouchableOpacity>
          

            <Text style={styles.headerText}>History</Text>
          </View>



          <FlatList
            style ={styles.flatlister}
              ListHeaderComponent={() => (
                <View style={styles.listHead}>
                </View>
              )}
              data={data}

              ListEmptyComponent={() => (
                <View style={styles.emptyView}>
                  <Text style={styles.emptyText}>
                     No stored catches
                  </Text>
                </View>
              )}



              renderItem={({item,index}) => (
                <View style={rowStyle(index)}>
                    <View style={styles.leftSide}>
                      <Text style={styles.rowText}>
                      PIT: {item.hex}
                      </Text>
                    </View>

                    <View style={styles.rightSide}>
                      <Text style={styles.rightText}>
                        Length: {item.length}mm
                        </Text>
                        <Text style={styles.rightText}>
                        Species: {getSpecies(item.species)}
                        </Text>
                        <Text style={styles.rightText}>
                      Date: {item.lastCaught}
                      </Text>
                      <Text style={styles.rightText}>
                      Mile: {item.riverMile}
                      </Text>
                    </View>
                </View>
              )}
              keyExtractor={(item) => item.hex}
            />




          </View>
          </View>

      </Modal>



















            <View style={styles.moreView}>

            <TouchableOpacity  style ={styles.learn} onPress={() => { Linking.openURL('https://ceias.nau.edu/capstone/projects/CS/2022/TeamPhysh_F22/')}}>
            <Text style={styles.buttonText}>Our Website</Text>
            </TouchableOpacity>

            <TouchableOpacity  style ={styles.history} onPress={() => openHistory()}>
            <Text style={styles.buttonText}>Total Catch History</Text>
            </TouchableOpacity>

            <TouchableOpacity  style ={styles.otherOne} onPress={() => {Alert.alert(
                                                                      "Clearing History",
                                                                      "This will clear your recent catches. Are you sure you want to continue?",
                                                                      [
                                                                        { text: "Cancel" },
                                                                        { text: "Clear",
                                                                          onPress: () => clearRecent()}
                                                                      ]
                                                                    );}}>
            <Text style={styles.buttonText}>Clear Recent Catches</Text>
            </TouchableOpacity>

            <TouchableOpacity  style ={styles.otherTwo} onPress={() => {Alert.alert(
                                                                      "Clearing History",
                                                                      "This will clear your whole local database. Are you sure you want to continue?",
                                                                      [
                                                                        { text: "Cancel" },
                                                                        { text: "Clear",
                                                                          onPress: () => clearLocal()}
                                                                      ]
                                                                    );}}>
            <Text style={styles.buttonText}>Clear Local Database</Text>
            </TouchableOpacity>

              </View>

            
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

    moreView:{
      justifyContent: 'center',
      width: "100%",
      height: "100%",
    },

    learn:{
      backgroundColor: '#fddfba',
      height: '10%',
      width: '80%',
      marginBottom: 10,
      justifyContent: 'center',
      borderRadius: 20,
      alignSelf: 'center',
      
    },

    history:{
      backgroundColor: '#fbd6f3',
      height: '10%',
      width: '80%',
      marginBottom: 10,
      justifyContent: 'center',
      borderRadius: 20,
      alignSelf: 'center',
    },

    otherOne:{
      backgroundColor: '#8acc98',
      height: '10%',
      width: '80%',
      marginBottom: 10,
      justifyContent: 'center',
      borderRadius: 20,
      alignSelf: 'center',
    },

    otherTwo:{
      backgroundColor: '#c6d9fd',
      height: '10%',
      width: '80%',
      marginBottom: 10,
      justifyContent: 'center',
      borderRadius: 20,
      alignSelf: 'center',
    },

    buttonText:{
      color: 'black',
      fontSize: 25,
      textAlign: 'center',
    },
  




    modalView: {
      width: "100%",
      height: "100%",
      backgroundColor: '#8da5b3',
      alignSelf: 'center',
      top: "10%",
      shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,  
    elevation: 5,
      borderRadius: 30,
    },

    Modalicon:{
      height: 50,
      width: 50,
      resizeMode: 'contain',
      top: 10,
      right:10,
      position: 'absolute',

    },

    closeIcon: {
      zIndex: 1,
    },

    bgmodal:{
      height: "100%",
      width: "100%",
      backgroundColor: "rgba(0, 0, 0, 0)",
    },

    modalText:{
      fontSize: 25,
      top: "5%",
      alignSelf: 'center',
      marginBottom: 40,
    },


    header:{
      justifyContent:'center',
      width: "100%",
      height: "10%",
      backgroundColor: '#8da5b3',
      borderRadius: 0,
      borderRadius: 20,
    },

    headerText:{
      fontWeight: '',

      position: 'absolute',
      alignSelf: 'center',
      fontSize: 30,
      
    },

    emptyView:{
      width: "100%",
      height: 100,
      alignSelf: 'center',
      justifyContent: 'center',
      backgroundColor: "",
      
    },

    emptyText:{
      textAlign: 'left',
      fontSize:20,
      textAlign: 'center',
      color: "black",
    },


    itemRow:{
      borderBottomColor: '#6e4b78',
      borderLeftColor: 'white',
      borderRightColor: 'white',
      borderTopColor: 'white',
      borderBottomWidth: 3,
      width: "90%",
      height: 80,
      alignSelf: 'center',
      justifyContent: 'center',
      zIndex: 0,
    },

    rowText:{
      textAlign: 'left',
      fontSize:18,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      fontWeight: 'bold',
    },

    leftSide: {
      display: "flex",
      flexDirection: "column",
      left: 10,
      position: 'absolute',
    },

    rightSide: {
      display: "flex",
      flexDirection: "column",
      right: 10,
      position: 'absolute',
    },
    
    rightText:{
      textAlign: 'left',
      fontSize:12,
    },

    clearIcon:{
    backgroundColor: '#b73a40',
    height: 50,
    width: 100,
    justifyContent: 'center',
    borderRadius: 100,
    // top: "45%",
    alignSelf: 'center',
    top: 10,
    left: 10,
    position: 'absolute',
    borderWith: 5,
    borderWidth: 3,
    borderColor: 'maroon',
    },



  });
  
