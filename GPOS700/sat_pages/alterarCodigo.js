import React, { Component } from "react";
import { Text, View, Alert,Picker,TextInput,Button,DeviceEventEmitter } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {NativeModules} from 'react-native';
import RetornoDinamicoSat from '../services/retornoDinamicoSat';


var ToastExample = NativeModules.ToastExample;

export default class AlterarCodigo extends Component {
  constructor(props) {
    super(props);

    this.state = {
        
        opcao:'Codigo de ativacao',
        codigoAtivacao:'',
        codigoAtivacaoNovo:'',
        confirmarCodigo:'',

     
    };
  }
  async componentDidMount(){
    DeviceEventEmitter.addListener("eventAlterar",event=>{ this.formatarInfo(event.alterar)});


  }

  formatarInfo(resultado){
      var retornoDinamicoSat = new RetornoDinamicoSat(resultado);
      this.dialogoSat(retornoDinamicoSat.getRespostaRecebida());


  }
  dialogoSat(messageText){
      Alert.alert("Retorno", messageText);

  }
  // Função para validar os valores digitos pelo usuario e realizar a ativação do SAT
  alterarCodigoSat(){
      if(this.state.codigoAtivacao.length>= 8 && this.state.codigoAtivacaoNovo.length<=32 &&
        this.state.codigoAtivacaoNovo.length >= 8 &&
        this.state.codigoAtivacaoNovo.length <= 32){
            if(this.state.codigoAtivacaoNovo==this.state.confirmarCodigo){
                //Caso todos os valores estejam corretos
        // Envia para o canal de ativação a função de alterar codigo do Sat
                var op = 0;
                 // No Java o Sat reconhece 1 - Como sendo a opção de mudar codigo de ativação
          // 2 como sendo a opção de alterar codigo de emergência
                if(this.state.opcao=="Codigo de ativacao"){
                    console.log("entrei no codigo")
                    op = 1;
                }
                else{
                    console.log("entrei no codigo2: "+this.state.opcao)
                    op=2;
                }
                ToastExample.alterarSat(Math.floor(Math.random() * 9999999),this.state.codigoAtivacao,this.state.codigoAtivacaoNovo,op);
            }else{
                this.dialogoSat("O Código de Ativação Novo e a Confirmação do Código de Ativação não correspondem!");
            }


      }  else{
          this.dialogoSat("Código de Ativação deve ter entre 8 a 32 caracteres!")
      }


  }

  render() {
     return (
      
         <SafeAreaView>
                <View style={{justifyContent:'space-between', flexDirection:'row', marginTop:20, marginBottom:10}}>
                    <Text style={{ fontSize:20, fontWeight:'bold' }} >Opções </Text>
                    <Picker
                        
                        selectedValue={this.state.opcao}
                        style={{height: 30, width: 200,marginEnd:100 }}
                      
                        onValueChange={(itemValue, itemIndex) =>this.setState({opcao:itemValue})}
                        >
                        
                        <Picker.Item label="Código de ativação" value="Codigo de ativacao" />
                        <Picker.Item label="Código de emergencia" value="Codigo de emergencia" />
                        
                      

                    </Picker>


                </View>
                <View style={{ marginBottom:10,flexDirection:'row',justifyContent:'space-between' }}>
                        <Text style={{fontSize:20, fontWeight: 'bold'}}>Atual</Text>
                        <TextInput           
                                    style={{height: 50,backgroundColor: 'white', fontSize: 17,width:250, marginRight:50}}  
                                    
                                    value={this.state.codigoAtivacao}
                                    onChangeText={(text) => this.setState({codigoAtivacao: text})}  
                                  

                                />  
                   
                 </View>
                 <View style={{ marginBottom:10,flexDirection:'row',justifyContent:'space-between' }}>
                        <Text style={{fontSize:20, fontWeight: 'bold'}}>Novo</Text>
                        <TextInput           
                                    style={{height: 50,backgroundColor: 'white', fontSize: 17,width:250, marginRight:50}}  
                                    
                                    value={this.state.codigoAtivacaoNovo}
                                    onChangeText={(text) => this.setState({codigoAtivacaoNovo: text})}  

                                />  
                   
                 </View>
                 <View style={{ marginBottom:10,flexDirection:'row',justifyContent:'space-between' }}>
                        <Text style={{fontSize:20, fontWeight: 'bold'}}>Confirmar</Text>
                        <TextInput           
                                    style={{height: 50,backgroundColor: 'white', fontSize: 17,width:250, marginRight:10}}  
                                    
                                    value={this.state.confirmarCodigo}
                                    onChangeText={(text) => this.setState({confirmarCodigo: text})}  

                                />  
                   
                 </View>
                 
                <View style={{marginTop: 30, marginStart: 20, marginEnd: 20, marginBottom: 2}}>
                
                    <Button
                        color= 'gray'
                        title="alterar"
                        onPress={() => this.alterarCodigoSat()}
                        />
                </View>
                    
            

         </SafeAreaView>
         
        
          
        
    
       
    );
  }

}


