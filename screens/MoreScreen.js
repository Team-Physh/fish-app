import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Footer from '../components/Footer'

export default function MoreScreen({navigation}) {


    return (
        <View style={styles.container}>
            <TouchableOpacity  style ={styles.help} onPress={() => navigation.navigate('HelpScreen')}>
                      <Image style={ styles.icon } source={require('../assets/question.png')}></Image>
            </TouchableOpacity>
            <Text style={styles.boxText}>More Page</Text>
            <Footer />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    boxText:{
        color: 'black',
        fontSize: 15,
        textAlign: 'center',
        top: "50%",
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
  
  });
  
