import React, { Component } from "react";
import { Text, View, Alert,Picker,TextInput,Button, DeviceEventEmitter } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {TextInputMask} from 'react-native-masked-text';
import RetornoAssociarSat from '../services/retornoAssociarSat';
import {NativeModules} from 'react-native';
var ToastExample = NativeModules.ToastExample;
export default class AssociarSat extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
            codigoAtivacao: '',
            assinaturaAc: '',
            cnpj: '',
            cnpjSH: '',
         
        };
      }
      async componentDidMount(){
        DeviceEventEmitter.addListener("eventAssociar",event=>{ this.formatarInfo(event.associar)});
    
    
      }
    formatarInfo(retorno){
        // Instância a classe que formata o retorno da função "Associar" Sat
            // Com este objeto é possivel acessar as informações recebidas do Sat, de uma forma simplificada.
        var retornoAssociarSat = new RetornoAssociarSat(retorno);
        this.dialogoSat(retornoAssociarSat.getRespostaRecebida());

    }
    dialogoSat(messageText){
        Alert.alert("Retorno", messageText);

    }
    associarSat(){
        var cnpj = this.state.cnpj.toString();
        var cnpjSH = this.state.cnpjSH.toString();
        cnpjSH = cnpjSH.split('.').join('').split('/').join('').split('-').join('');
        cnpj = cnpj.split('.').join('').split('/').join('').split('-').join(''); 
      
        if(this.state.codigoAtivacao.length >= 8 && this.state.codigoAtivacao.length <= 32){
            if(this.state.assinaturaAc.length!=0){
                if(cnpj.length !=14 ||cnpjSH.length!=14 ){
                    this.dialogoSat("Verifique o CNPJ digitado!");
                }else{
                    
                    ToastExample.associarSat(Math.floor(Math.random() * 9999999),this.state.codigoAtivacao,cnpj,cnpjSH,this.state.assinaturaAc);
                    
                }

            }else {
                dialogoSat("Assinatura AC Inválida!");
              }
        }else {
            dialogoSat("Código de Ativação deve ter entre 8 a 32 caracteres!");
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
                     
                     <View style={{ marginBottom:10, }}>
                            <Text style={{fontSize:20, fontWeight: 'bold'}}>CNPJ Software House</Text>
                            <View style={{backgroundColor:'white',
                                    width:300,
                                    marginStart:30,
                                    marginBottom:10, }}>
                            <TextInputMask
                                    type={'cnpj'}
                                    value={this.state.cnpjSH}
                                    onChangeText={text => {
                                        this.setState({
                                        cnpjSH: text
                                        })
                                    }}
                                    />
                            </View>
                       
                     </View>
                     <View style={{ marginBottom:10,flexDirection:'row',justifyContent:'space-between' }}>
                            <Text style={{fontSize:20, fontWeight: 'bold'}}>Código de Ativação</Text>
                            <TextInput           
                                        style={{height: 50,backgroundColor: 'white', fontSize: 17,width:160, marginRight:10}}  
                                        
                                        value={this.state.codigoAtivacao}
                                        onChangeText={(text) => this.setState({codigoAtivacao: text})}  
    
                                    />  
                       
                     </View>
                     <View style={{ marginBottom:10,flexDirection:'row',justifyContent:'space-between' }}>
                            <Text style={{fontSize:20, fontWeight: 'bold'}}>Assinatura AC</Text>
                            <TextInput           
                                        style={{height: 50,backgroundColor: 'white', fontSize: 17,width:200, marginRight:10}}  
                                        
                                        value={this.state.assinaturaAc}
                                        onChangeText={(text) => this.setState({assinaturaAc: text})}  
    
                                    />  
                       
                     </View>
                     
                    <View style={{marginTop: 30, marginStart: 20, marginEnd: 20, marginBottom: 2}}>
                    
                        <Button
                            color= 'gray'
                            title="associar"
                            onPress={() => this.associarSat()}
                            />
                    </View>
                        
                
    
             </SafeAreaView>
             
            
              
            
        
           
        );
      }
    


    
}