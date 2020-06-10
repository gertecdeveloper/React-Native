import React, { Component } from "react";
import { Text, View, Alert,Picker,TextInput,Button, DeviceEventEmitter } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {TextInputMask} from 'react-native-masked-text';
import {NativeModules} from 'react-native';
import RetornoDinamicoSat from '../services/retornoDinamicoSat';
var ToastExample = NativeModules.ToastExample;
export default class AtivarSat extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
            cnpj:'',
            codigoAtivacao:'',
            confirmacaoCodigo:''
         
        };
      }
    async componentDidMount(){
        DeviceEventEmitter.addListener("eventAtivar",event=>{ this.formatarInfo(event.ativar)});


    }
    formatarInfo(retorno){
        // Instância a classe que formata o retorno da função "Associar" Sat
            // Com este objeto é possivel acessar as informações recebidas do Sat, de uma forma simplificada.
        var retornoAtivarSat = new RetornoDinamicoSat(retorno);
        this.dialogoSat(retornoAtivarSat.getRespostaRecebida());

    }
    dialogoSat(messageText){
        Alert.alert("Retorno", messageText);
    }
    ativarSat(){
        var cnpj = this.state.cnpj.toString();
        cnpj = cnpj.split('.').join('').split('/').join('').split('-').join(''); 
        if(this.state.codigoAtivacao.length>=8 && this.state.codigoAtivacao.length<=32){
            if(this.state.codigoAtivacao==this.state.confirmacaoCodigo){
                if(cnpj.length!=14){
                    this.dialogoSat("Verifique o CNPJ digitado!");
                }else{
                    // Envia para o canal de ativação a função de ativar Sat
                    ToastExample.ativarSat(Math.floor(Math.random() * 9999999), this.state.codigoAtivacao,this.state.cnpj);
                }
            }else{
                this.dialogoSat("O Código de Ativação e a Confirmação do Código de Ativação não correspondem!");
            }
        }else{
            this.dialogoSat("Código de Ativação deve ter entre 8 a 32 caracteres!");
        }
    }
      
    
      render() {
         return (
          
             <SafeAreaView>
                    <View style={{ marginBottom:10 , marginTop: 20}}>
                            <Text style={{fontSize:20, fontWeight: 'bold'}}>CNPJ Contribuinte</Text>
                            <View style={{backgroundColor:'white',
                                    width:300,
                                    marginStart:30,
                                    marginBottom:10, }}>
                            <TextInputMask
                                    type={'cnpj'}
                                   
                                    value={this.state.cnpj}
                                    onChangeText={text => {
                                        this.setState({
                                        cnpj: text
                                        })
                                    }}
                                    />
                            </View>
                       
                     </View>
                     
                     
                     <View style={{ marginBottom:10,justifyContent:'space-between' }}>
                            <Text style={{fontSize:20, fontWeight: 'bold'}}>Código de Ativação Sat</Text>
                            <TextInput           
                                        style={{height: 50,backgroundColor: 'white', fontSize: 17,width:300, marginStart:30}}  
                                        
                                        value={this.state.codigoAtivacao}
                                        onChangeText={(text) => this.setState({codigoAtivacao: text})}  
    
                                    />  
                       
                     </View>
                     <View style={{ marginBottom:10,justifyContent:'space-between' }}>
                            <Text style={{fontSize:20, fontWeight: 'bold'}}>Confirmação do Código</Text>
                            <TextInput           
                                        style={{height: 50,backgroundColor: 'white', fontSize: 17,width:300, marginStart: 30}}  
                                        
                                        value={this.state.confirmacaoCodigo}
                                        onChangeText={(text) => this.setState({confirmacaoCodigo: text})}  
    
                                    />  
                       
                     </View>
                     
                    <View style={{marginTop: 30, marginStart: 20, marginEnd: 20, marginBottom: 2}}>
                    
                        <Button
                            color= 'gray'
                            title="ativar"
                            onPress={() => this.ativarSat()}
                            />
                    </View>
                        
                
    
             </SafeAreaView>
             
            
              
            
        
           
        );
      }
    


 


    
}