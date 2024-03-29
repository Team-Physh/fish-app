import * as SQLite from 'expo-sqlite'
import { Alert } from 'react-native';
import React, {useState} from "react";
import NetInfo from '@react-native-community/netinfo';

// API call to get data
export async function getAllData(){

      console.log("before fetch");
      try {
      // api call
      const response = await fetch('http://api.teamphysh.com:3000/fish');
      
      // set data
      const data = await response.json();
      
      // return the data
      return data;
      } catch(err){
        console.log("fetch err");
        
      }
      
      const data = null;
      return data;
}

// API call to get newest data than current date
// This is for updating the local database without having to redownload the whole thing (just gets values newer than given date)
export async function getNewData(date) {


  const response = await fetch('http://api.teamphysh.com:3000/fish/sync/'+date);
  const data = await response.json();


  return data;
}

// function to download db to local db (downloads ENTIRE THING)
// This should only run when the app is started for the very first time 
export async function downloadDatabase() {

  console.log("DOWNLOADING");

  const connectionInfo = await NetInfo.fetch();

  //const connectionInfo = await NetInfo.fetch();
  //console.log(connectionInfo.isConnected);
    if(connectionInfo.isConnected)
    {

          // open/make local database
      const db = SQLite.openDatabase("fish.db");
      const data = await getAllData();


      // // testing function that prints out whatever index of data your tryna see. Can also print whole thing
      // const printInfo = (_array) => {
      // console.log("Download success! printing data at chosen index (zero probably)\n");
      // //console.log(Object.values(_array[1]));
      // console.log(_array[0]);
      //
      // };

      // start DATABASE transaction
      db.transaction(tx => {

        // drop old table on app start (MIGHT REMOVE)
        tx.executeSql("DROP TABLE IF EXISTS fishTable;", []);

        // check if local table exists first
        tx.executeSql(
        "create table if not exists fishTable (hex integer prmiary key not null, lastCaught date, length integer, pit varchar(100), riverMile float, species varchar(100));",
        []
        );


        // drop date table
        tx.executeSql(
          "DROP TABLE IF EXISTS recentDate;",
          []
          );
        // create table entry to store date
        tx.executeSql(
          "create table if not exists recentDate (idNum integer primary key not null, lastSync date);",
          []
          );
        // store sync date
        tx.executeSql("INSERT INTO recentDate (idNum, lastSync) VALUES (?, ?)",
        [1, getCurrentDateNonReadable()])
        

        //upload data to local database
        for (var i = 0; i < data.length; i++)
        {
        const array = data[i];

        tx.executeSql("INSERT INTO fishTable (hex, lastCaught, length, pit, riverMile, species) VALUES (?, ?, ?, ?, ?, ?)",
                        [array.hex, array.lastCaught, array.length, array.pit, array.riverMile, array.species])

                        
        }

        console.log("DB DOWNLOADED");



        // // function for testing, just selects the table to print it out and stuff. printInfo above is called for this
        //         tx.executeSql(
        // "select * from fishTable",
        // null,
        // // success
        // (_, { rows: { _array } }) => printInfo(_array),
        // // error
        // () => console.log("error fetching")
        //             );

        // drop everything test
        // tx.executeSql("DROP TABLE IF EXISTS catchTable;", []);
        // tx.executeSql("DROP TABLE IF EXISTS fishTable;", []);
        // tx.executeSql("DROP TABLE IF EXISTS history;", []);

      });

    }
    else
    {
      Alert.alert(
        "Could not download database",
        "Restart app with a valid internet connection",
        [
          { text: "Ok" }
        ]
      );
    }

}

// Uploads catch data and clears catch table
// This runs from the home screen sync button. The reason the updateDatabase is called from here
// is because it is an await function, so i dont want it to update until the post request is finished (so no duplicates get added to local)
export async function uploadDatabaseSync(data) {
  const connectionInfo = await NetInfo.fetch();

  //const connectionInfo = await NetInfo.fetch();
  //console.log(connectionInfo.isConnected);
    if(connectionInfo.isConnected)
    {
      await fetch( "http://api.teamphysh.com:3000/fish/data" , {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },

        body: JSON.stringify(data)
      }).then( response => {
        // return response.json();

        // update now
        updateDatabase();

      })
      .catch(error => {
      })
    }
    // otherwise netinfo check failed
    else
    {
      Alert.alert(
        "Could not send data for sync",
        "Try again with an internet connection",
        [
          { text: "Ok" }
        ]
      );

      return
    }
    
}

// clears recent catches table
export function clearRecent() {
  const db = SQLite.openDatabase("fish.db");
  
  // start DATABASE transaction
  db.transaction(tx => {

    // drop old table on app start (MIGHT REMOVE)
    tx.executeSql("DROP TABLE IF EXISTS catchTable;", []);
  });

  
}

// clears local database (Whole thing)
export async function clearLocal() {
  const db = SQLite.openDatabase("fish.db");
    
  // start DATABASE transaction
  db.transaction(tx => {

    // drop old table on app start (MIGHT REMOVE)
    tx.executeSql("DROP TABLE IF EXISTS fishTable;", []);
  });
}

// simple local non-async function thats used to insert values non-asynchronously. 
// it was having problems inserting if called within async function so this was a quick solution
// runs within an async function, and its purpose is to confirm that the value was inserted before it downloaded the new database values
// this ensures that when the values are uploaded to the database, theyre then redownloaded and fully synced and not missed.
function inserter(array){

  const db = SQLite.openDatabase("fish.db");

  db.transaction(tx => {

    tx.executeSql("INSERT INTO fishTable (hex, lastCaught, length, pit, riverMile, species) VALUES (?, ?, ?, ?, ?, ?)",
                          [array.hex, array.lastCaught, array.length, array.pit, array.riverMile, array.species])

  });
}

// This function first gets the newest data (newer than current last retrieved date)
// and then it download and stores it and updates the date after.
export async function updateDatabase() {

  const connectionInfo = await NetInfo.fetch();

  //const connectionInfo = await NetInfo.fetch();
  //console.log(connectionInfo.isConnected);
    if(connectionInfo.isConnected)
    {

    // open/make local database
    const db = SQLite.openDatabase("fish.db");
    
    db.transaction(tx => {

      const useDate = async (_array) => {

        // get date
        var retrievedDate = Object.values(_array[0]);
        
        // clear recent catches
        await clearRecent();
        // retrieve data from date
        const data = await getNewData(retrievedDate[1]);

        var lastdate;

        // HOW THIS WORKS:
        // off all the new data retrieved, get the most recent ones date. this becomes the new 
        // last synced date.  
        if(Object.keys(data).length != 0)
        {
          lastdate = data[data.length-1].createdAt;

          db.transaction( tx => {
            tx.executeSql("UPDATE recentDate SET lastSync = ? WHERE idNum = ?;",
            [lastdate, 1],
            // success
            (_, )  => {
              // do nothing, used this space for debugging 
            }
            );
          });
          
        }

        //upload data to local database
        for (var i = 0; i < data.length; i++)
        {
          const array = data[i];

          // call inserter to insert because it is non-async, and confirms that data is inserted before it is redownloaded
          inserter(array);
        }

        };

      // retrieve new data
      tx.executeSql(
        "select * from recentDate WHERE idNum = ?",
        [1],
        // success
        (_, { rows: { _array } }) =>  useDate(_array));
    });


    }
    else
    {
      Alert.alert(
        "Could not update database",
        "Try again with an internet connection",
        [
          { text: "Ok" }
        ]
      );
    }

}

// date grabber function. gets current date/time FORMATTED TO READ!
// commented out block is for if we want to get ride of timestamp and just use date
// this isnt used currently
export function getCurrentDate() {

  var date;
  date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  return date;//format: d-m-y H:M:S;
}

// date grabber function. gets current date/time NOT FORMATTED TO READ! not used currently, since date js function just does it 
export function getCurrentDateNonReadable() {

  var date = new Date();
  var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                date.getUTCDate(), date.getUTCHours(),
                date.getUTCMinutes(), date.getUTCSeconds());

  return date.toISOString();//format: d-m-y H:M:S;
}

// Returns string of fish
export const getSpecies=(species)=>{

  if(species=="BBH")
  {
    return "Black Bullhead";
  }
  if(species=="BNT")
  {
    return "Brown Trout";
  }
  else if (species == "BGS")
  {
    return "Bluegill";
  }
  else if (species == "BHS")
  {
    return "Bluehead Sucker";
  }
  else if (species == "BKC")
  {
    return "Black Crappie";
  }
  else if (species == "BKT")
  {
    return "Brook Trout";
  }
  else if (species == "CCF")
  {
    return "Channel Catfish";
  }
  else if (species == "CRP")
  {
    return "Common Carp";
  }
  else if (species == "CTT")
  {
    return "Cutthroat Carp";
  }
  else if (species == "FMS")
  {
    return "Flannelmouth Sucker";
  }
  else if (species == "FRH")
  {
    return "Flannelmouth/Razorback";
  }
  else if (species == "GSF")
  {
    return "Green Sunfish";
  }
  else if (species == "GZD")
  {
    return "Gizzard Shad";
  }
  else if (species == "HBC")
  {
    return "Humpback Chub";
  }
  else if (species == "LMB")
  {
    return "Largemouth Bass";
  }
  else if (species == "NFC")
  {
    return "No Fish Caught";
  }
  else if (species == "NOP")
  {
    return "Northern Pike";
  }
  else if (species == "PKF")
  {
    return "Plains Killifish";
  }
  else if (species == "RBS")
  {
    return "Razorback Sucker";
  }
  else if (species == "RBT")
  {
    return "Rainbow Trout";
  }
  else if (species == "RCH")
  {
    return "Rainbow/Cutthroat";
  }
  else if (species == "SMB")
  {
    return "Smallmouth Bass";
  }
  else if (species == "STB")
  {
    return "Striped Bass";
  }
  else if (species == "SUC")
  {
    return "Unidentified Sucker";
  }
  else if (species == "TET")
  {
    return "Test PIT Tag";
  }
  else if (species == "TRT")
  {
    return "Unidentified Trout";
  }
  else if (species == "UBH")
  {
    return "Unidentified Bullhead";
  }
  else if (species == "UIB")
  {
    return "Unidentified Bass";
  }
  else if (species == "UIM")
  {
    return "Unidentified Minnow";
  }
  else if (species == "UIS")
  {
    return "Unidentified Sunfish";
  }
  else if (species == "UTR")
  {
    return "Unidentified Trout";
  }
  else if (species == "WAL")
  {
    return "Walleye";
  }
  else if (species == "YBH")
  {
    return "Yellow Bullhead";
  }
  else if (species == "YPE")
  {
    return "Yellow Perch";
  }
  else if (species == "CUT")
  {
    return "Cutthroat Trout";
  }
}

// converts to ft and inch
export function mmToFeetAndInches(mm) {
  const inches = parseInt(mm) / 25.4;
  const feet = Math.floor(inches / 12);
  const remainingInches = Math.round((inches % 12));
  return feet + " ft " + remainingInches + " in";
}

// converts back to mm
export function feetAndInchesToMm(feet, inches) {
  const totalInches = (parseInt(feet) * 12) + parseInt(inches);
  // Convert inches to millimeters
  const millimeters = totalInches * 25.4;
  console.log(millimeters);
  return millimeters;
}







