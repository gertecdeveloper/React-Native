import React, { Component } from "react";
import { Text, View, Alert,Picker,TextInput,Button, DeviceEventEmitter } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DialogInput from 'react-native-dialog-input';
import {NativeModules} from 'react-native';
import RetornoConsultasTesteSat from '../services/retornoConsultasTesteSat';
import RetornoStatusSat from '../services/retornoStatusSat';
var ToastExample = NativeModules.ToastExample;
export default class TesteSat extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
            isDialogVisible1:false,
            isDialogVisible2:false,
            codigoAtivacao:'',
            inputCancela: '',
            inputConsulta:'',
            funcao: ''

          
         
        };
    }
    async componentDidMount(){
        DeviceEventEmitter.addListener("eventTeste",event=>{ this.formatarInfo(event.teste)});


    }
    formatarInfo(resultado){
      
        
        if(this.state.funcao=="ConsultarStatusOperacional") {
            
         var status = new RetornoStatusSat(resultado);
          this.dialogoSat("Número de Série do SAT: " +
              status.getNumeroSerieSat() +
              "Tipo de Lan: " +
              status.getTipoLan() +
              "IP SAT: " +
              status.getIpSat() +
              "MAC SAT: " +
              status.getMacSat() +
              "Máscara: " +
              status.getMascara() +
              "Gateway: " +
              status.getGateway() +
              "DNS 1: " +
              status.getDns1() +
              "DNS 2: " +
              status.getDns2() +
              "Status da Rede: " +
              status.getStatusRede() +
              "Nível da Bateria: " +
              status.getNivelBateria() +
              "Memória de Trabalho Total: " +
              status.getMemoriaDeTrabalhoTotal() +
              "Memória de Trabalho Usada: " +
              status.getMemoriaDeTrabalhoUsada() +
              "Data: " +
              status.getData() +
              "Hora: " +
              status.getHora() +
              "Versão: " +
              status.getVersao() +
              "Versão de Leiaute: " +
              status.getVersaoLeiaute() +
              "Último CFe-Sat Emitido: " +
              status.getUltimoCfeEmitido() +
              "Primeiro CFe-Sat Em Memória: " +
              status.getPrimeiroCfeMemoria() +
              "Último CFe-Sat Em Memória: " +
              status.getUltimoCfeMemoria() +
              "Última Transmissão de CFe-SAT para SEFAZ - Data: " +
              status.getUltimaTransmissaoSefazData() +
              "Última Transmissão de CFe-SAT para SEFAZ - Hora: " +
              status.getUltimaTransmissaoSefazHora() +
              "Data da Última Comunicação com a SEFAZ:" +
              status.getUltimaComunicacaoSefazData() +
              "Estado de Operação do SAT: " +
              status.getEstadoDeOperacao());
        }
        else if (this.state.funcao == "ConsultarSat" ||this.state.funcao == "EnviarTesteFim" ||this.state.funcao == "CancelarUltimaVenda" ||this.state.funcao == "ConsultarNumeroSessao"||"EnviarTesteVendas") {
            var  retornoConsultasTesteSat =  new RetornoConsultasTesteSat(resultado);
          this.dialogoSat(retornoConsultasTesteSat.getCodigoResposta() +
              " - " +
              retornoConsultasTesteSat.getRespostaRecebida());
         

        }
       
    }
    dialogoSat(messageText){
        Alert.alert("Retorno", messageText);
    }
    testeSat(texto,funcao){
        this.setState({funcao:funcao})
        if(funcao=="CancelarUltimaVenda"){
            this.setState({inputCancela:texto});
        }else if(funcao== "ConsultarNumeroSessao"){
          
                this.setState({inputConsulta: texto});
            
        }
        this.setState({isDialogVisible1: false});
        this.setState({isDialogVisible2:false});
        if(this.state.codigoAtivacao.length>=8 && this.state.codigoAtivacao.length<=32){
            ToastExample.testeSat(funcao,Math.floor(Math.random() * 9999999),this.state.codigoAtivacao, this.state.inputCancela, this.state.inputConsulta);

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
                            title="consultar sat"
                            onPress={() => this.testeSat('',"ConsultarSat")}
                        
                            />
                    </View>
                    <View style={{marginTop: 15, marginStart: 20, marginEnd: 20}}>
                            <Button
                            color= 'gray'
                            title="status"
                            onPress={() => this.testeSat('',"ConsultarStatusOperacional")}
                            />
                    </View>
                    <View style={{marginTop: 15, marginStart: 20, marginEnd: 20}}>
                            <Button
                            color= 'gray'
                            title="teste fim a fim"
                            onPress={() => this.testeSat('', "EnviarTesteFim")}
                            />
                     </View>
                     <View style={{marginTop: 15, marginStart: 20, marginEnd: 20}}>
                            <Button
                            color= 'gray'
                            title="enviar dados de venda"
                            onPress={() => this.testeSat('',"EnviarTesteVendas")}
                            />
                    </View>
                    <View style={{marginTop: 15, marginStart: 20, marginEnd: 20}}>
                            <Button
                            color= 'gray'
                            title="cancelar venda"
                            onPress={() => this.setState({isDialogVisible1:true})}
                            />
                            <DialogInput isDialogVisible={this.state.isDialogVisible1}
                                title={"CANCELAR VENDA"}
                                message={"Digite a chave de cancelamento"}
                                hintInput ={""}
                                submitInput={ (inputCancela) => {this.testeSat(inputCancela, "CancelarUltimaVenda")} }
                                closeDialog={ () => {this.setState({isDialogVisible1:false})}}>
                            </DialogInput>
                    </View>
                    <View style={{marginTop: 15, marginStart: 20, marginEnd: 20}}>
                            <Button
                            color= 'gray'
                            title="consultar sessão"
                            onPress={() => this.setState({isDialogVisible2: true})}
                            />
                       <DialogInput isDialogVisible={this.state.isDialogVisible2}
                                title={"CONSULTAR SESSÃO"}
                                message={"Digite o numero da sessao"}
                                hintInput ={""}
                                submitInput={ (inputConsulta) => {this.testeSat(inputConsulta,"ConsultarNumeroSessao")} }
                                closeDialog={ () => {this.setState({isDialogVisible2:false})}}>
                            </DialogInput>
                    </View>
                        
                
    
             </SafeAreaView>
         )
        }


    
}