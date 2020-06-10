import React, { Component } from "react";
import { Text, View, Alert,Picker,TextInput,Button,DeviceEventEmitter } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {NativeModules} from 'react-native';
import RetornoDinamicoSat from '../services/retornoDinamicoSat';
import RetornoLogSat from '../services/retornoLogSat'
var ToastExample = NativeModules.ToastExample;
export default class FerramentasSat extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
            
         
            value:'',
            codigoAtivacao:'',
         
        };
    }
    async componentDidMount(){
        DeviceEventEmitter.addListener("eventFerramenta",event=>{ this.formatarInfo(event.ferramenta)});


    }
    formatarInfo(retorno){
        // Instância a classe que formata o retorno da funções "Bloquear,desbloquear, atualizar" Sat
            // Com este objeto é possivel acessar as informações recebidas do Sat, de uma forma simplificada.
        var retornoDinamicoSat = new RetornoDinamicoSat(retorno);
        if (this.state.value == "BloquearSat" ||
            this.state.value == "DesbloquearSat" ||
            this.state.value == "AtualizarSoftware") {
          this.dialogoSat(retornoDinamicoSat.getRespostaRecebida());
        } else if (this.state.value == "ExtrairLog") {
          var retornoLogSat = new RetornoLogSat(retorno);
          this.dialogoSat(retornoLogSat.getRespostaRecebida());
          // print(retornoLogSat.getLog); Caso queria ver o log completo
        } else {
          // Caso for verificar versão não precisa formatar a resposta, pois é uma string unica
          this.dialogoSat(retorno);
        }
       

    }
    dialogoSat(messageText){
        Alert.alert("Retorno", messageText);
    }
     ferramentasSat(funcao){
         this.state.value=funcao;
        if(this.state.codigoAtivacao.length>=8 && this.state.codigoAtivacao.length<=32){
            ToastExample.ferramentasSat(funcao,Math.floor(Math.random() * 9999999),this.state.codigoAtivacao);
        }else{
            this.dialogoSat("Código de Ativação deve ter entre 8 a 32 caracteres!");
        }
     }
    
      render() {
         return (
          
             <SafeAreaView>
                   
                    <View style={{ marginBottom:10,justifyContent:'space-between', marginTop: 30 }}>
                            <Text style={{fontSize:20, fontWeight: 'bold'}}>Código de Ativação Sat</Text>
                            <TextInput           
                                        style={{height: 50,backgroundColor: 'white', fontSize: 17,width:300, marginStart: 30}}  
                                        
                                        value={this.state.codigoAtivacao}
                                        onChangeText={(text) => this.setState({codigoAtivacao: text})}  
                                      
    
                                    />  
                       
                     </View>
                     
                   
                     
                    <View style={{marginTop: 15, marginStart: 20, marginEnd: 20}}>
                    
                        <Button
                            color= 'gray'
                            title="bloquear sat"
                            onPress={() => this.ferramentasSat("BloquearSat")}
                        
                            />
                    </View>
                    <View style={{marginTop: 15, marginStart: 20, marginEnd: 20}}>
                            <Button
                            color= 'gray'
                            title="desbloquear sat"
                            onPress={() => this.ferramentasSat("DesbloquearSat")}
                            />
                    </View>
                    <View style={{marginTop: 15, marginStart: 20, marginEnd: 20}}>
                            <Button
                            color= 'gray'
                            title="extrair log"
                            onPress={() => this.ferramentasSat("ExtrairLog")}
                            />
                     </View>
                     <View style={{marginTop: 15, marginStart: 20, marginEnd: 20}}>
                            <Button
                            color= 'gray'
                            title="atualizar software"
                            onPress={() => this.ferramentasSat("AtualizarSoftware")}
                            />
                    </View>
                    <View style={{marginTop: 15, marginStart: 20, marginEnd: 20}}>
                            <Button
                            color= 'gray'
                            title="verificar versão"
                            onPress={() => this.ferramentasSat("Versao")}
                            />
                    </View>
                        
                
    
             </SafeAreaView>
         )
        }

    
    
}