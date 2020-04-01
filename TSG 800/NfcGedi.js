import React, { Fragment, Component } from "react";
import { SafeAreaView, TextInput, View, Button ,Alert} from "react-native";
import {NativeModules} from 'react-native';



var ToastExample = NativeModules.ToastExample;



export default class NfcGedi extends Component{
  constructor(props) {  
    super(props);  
    this.state = {text: ''};  

}    
_gravar(text){
   if(text==null || text=='' ){
        Alert.alert('Digite uma mensagem...')
        if(text=='')text=null;
    }
    if (text!=null){
      ToastExample.nfcGravar(this.state.input)

    }

}

  render(){
    return(
      <SafeAreaView>
        <View>
          <TextInput           
              style={{height: 50,backgroundColor: 'white', fontSize: 15, borderColor: 'blue'}}
              placeholderTextColor="blue" 
              placeholder="Mensagem para gravar no cartão"  
              onChangeText={(text) => this.setState({input: text})}  

            />
              <View style={{ height: 0.5, width: "100%", backgroundColor: "blue" }} />
        </View>
      
      <View style={{marginTop:20, marginEnd: 30, marginStart: 30}}>
          <Button
           
            color= 'blue'
            title="GRAVAR NO CARTÃO"
            onPress={() => this._gravar(this.state.input)}
          />
       <View/>
        <View  style={{marginTop:40}}>
        <Button
            color= 'blue'
            title="LER CARTÃO"
            onPress={() => ToastExample.nfcLeitura()}
          />
          
        </View>
        <View  style={{marginTop:40}}>
        <Button
            color= 'blue'
            title="FORMATAR CARTÃO"
            onPress={() =>  ToastExample.nfcFormatar()}
          />
          
        </View>
        <View  style={{marginTop:40}}>
        <Button
            color= 'blue'
            title="TESTE LEITURA/GRAVAÇÃO"
            onPress={() =>  ToastExample.nfcLeituraGravação()}
          />
        </View>
          
      </View>
          
      </SafeAreaView>
      
    );
  }
}
 