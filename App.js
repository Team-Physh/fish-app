import {useEffect} from 'react';
import { View, StyleSheet } from 'react-native';
import { Asset } from 'expo-asset';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ViewScreen from './screens/ViewScreen';
import HomeScreen from './screens/HomeScreen';
import MoreScreen from './screens/MoreScreen';
import HelpScreen from './screens/HelpScreen';
import SplashScreen from './screens/Splash';
import NewEntry from './screens/NewEntry';


// creates stack for stack navigator
const Stack = createNativeStackNavigator()

export default function App() {


  // cache icons for faster loading
  // without this icons can glitch a little when switching screens
  // add new icons here to cache them
  let cacheResources = async () => {
    const images = [
    require('./assets/PHYSH.png'),
    require("./assets/question.png"), 
    require('./assets/scan.png'),
    require('./assets/exit.png'),
    require('./assets/more.png'),
    require('./assets/catches.png'),
    require('./assets/splash.png'),
    require('./assets/azgfd.png'),
    require('./assets/azgfd_black.png'),
    ];
    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    });
    return Promise.all(cacheImages);
  }

  // load the resources (icons)
  useEffect(() => {
    const loadResources = async () => {
      await cacheResources();
    };

    loadResources();
  }, [])


  // just the navigation container here
  return (
    <View style={{flex: 1}}>
      
      <NavigationContainer>
      
        <Stack.Navigator
        screenOptions={{
          headerShown: true, 
          gestureEnabled: true,
        }} 
        mode="modal"
        initialRouteName="Splash">

        <Stack.Screen options={{
          headerShown: false, 
          gestureEnabled: false,
          animation: 'none',
        }} name="Splash" component={ SplashScreen } />

        <Stack.Screen options={{
          headerShown: false, 
          gestureEnabled: false,
          animation: 'none',
        }} name="New" component={ NewEntry } />

          <Stack.Screen options={{
          headerShown: false, 
          gestureEnabled: false,
          animation: 'none',
        }} name="Home" component={ HomeScreen } />

        <Stack.Screen options={{
          headerShown: false, 
          gestureEnabled: false,
          animation: 'none',
        }} name="View" component={ ViewScreen } />  

        <Stack.Screen options={{
          headerShown: false, 
          gestureEnabled: false,
          animation: 'none',
        }} name="More" component={ MoreScreen } />  

        <Stack.Screen options={{
          headerShown: false,
          gestureEnabled: false,
          animation: 'none',
        }} name="HelpScreen" component={HelpScreen} />  


        </Stack.Navigator>
    </NavigationContainer>
    

    </View>
  );
}

const styles = StyleSheet.create({

  mainView: {
    flex: 1,
    zIndex: 5,
  }
});