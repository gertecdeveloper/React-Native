import React, {Fragment, Component} from 'react';
import {SafeAreaView, Text, StatusBar,Button, TouchableOpacity, View, ListView, Image , StyleSheet, DeviceEventEmitter} from 'react-native';
import {NativeModules} from 'react-native';



var ToastExample = NativeModules.ToastExample;
const styles = StyleSheet.create({
  stretch: {
    width: 360,
    height: 105,
    resizeMode: 'stretch'
  },
  
});
state = {

}



export default class App extends Component {
  constructor(props) {    
    super(props);
    
    this.state = {
     
      arrayResult: [
        
      ], 
     
    }
  }
// é possível recuperar o resultado do codigo de barras V2 
  componentDidMount() {
   
    DeviceEventEmitter.addListener("eventResult",event=>{
      this.setState({
        arrayResult: [...this.state.arrayResult, event.result] 
      })
    
    }
    );
    
  }
  
  render(){
    
  
  return (
   

    
    <Fragment>
      <StatusBar barStyle="dark-content" />
      <View>
        
          <Image 
          style={styles.stretch}
          source={require('./images/gertec.png')} />
           <Text style={{fontSize: 20, textAlign: 'center',fontWeight: 'bold'}}>Projeto React-Native G800</Text>          
      </View>
      <View>
        <TouchableOpacity style={{height: 96,flexDirection:"row",alignItems:'center',justifyContent:'center'}} onPress={() => this.props.navigation.navigate("CodigoDeBarra")}>

              <Image source={require('./images/barcode.png')} resizeMode='contain' style={{flex:.2 }} />

              <Text style={{flex:.8, fontSize: 15, textAlign: 'center'}}>Código de Barras</Text>      
             
          </TouchableOpacity>
          <View style={{ height: 0.5, width: "100%", backgroundColor: "#000" }} />
         
          <TouchableOpacity style={{height: 96 ,flexDirection:"row",alignItems:'center',justifyContent:'center'}} onPress={() => ToastExample.startCameraV2()}>

              <Image source={require('./images/qr_code.png')} resizeMode='contain'style={{flex:.2 }} />

              <Text style={{flex:.8, fontSize: 15, textAlign: 'center'}}>Código de Barras V2</Text>      
             
          </TouchableOpacity>
          <View style={{ height: 0.5, width: "100%", backgroundColor: "#000" }} />
          <TouchableOpacity style={{height: 96,flexDirection:"row",alignItems:'center',justifyContent:'center'}} onPress={() =>  this.props.navigation.navigate("Impressao")}>

              <Image source={require('./images/print.png')} resizeMode='contain' style={{flex:.2 }} />

              <Text style={{flex:.8, fontSize: 15, textAlign: 'center'}}>Impressão</Text>      
             
          </TouchableOpacity>
          <View style={{ height: 0.5, width: "100%", backgroundColor: "#000" }} />
          <TouchableOpacity style={{height: 96,flexDirection:"row",alignItems:'center',justifyContent:'center'}} onPress={() => this.props.navigation.navigate("NfcGedi")}>

              <Image source={require('./images/nfc2.png')} resizeMode='contain' style={{flex:.2 }} />

              <Text style={{flex:.8, fontSize: 15, textAlign: 'center'}}>NFC Leitura/Gravação</Text>      
             
          </TouchableOpacity>
         
      </View>
      
       
       
      
    </Fragment>
    );
  }
}


