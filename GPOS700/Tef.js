import React, { Fragment, Component, useState } from "react";
import { SafeAreaView, Text, StatusBar, View, Button, Alert ,StyleSheet,DeviceEventEmitter,FlatList, TextInput, CheckBox} from "react-native";
import {NativeModules} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';

import RetornoGer7 from  './config_tef/operacaoRetornoGer7';
import RetornoMsiTef from  './config_tef/operacaoRetornoMsiTef';
import TefService from './services/serviceTef';
import RadioForm from 'react-native-simple-radio-button';






var RadioPagamento = [
  {label: 'Crédito', value: 'Crédito' },
  {label: 'Débito', value:'Debito'},
  {label: 'Voucher (Ger7)/Todos (M-Sitef)', value: 'Voucher' },
 
];
var RadioApi=[
  {label: 'Ger7', value: 'ger7' },
  {label: 'M-Sitef', value:'msitef'},
]
var ToastExample = NativeModules.ToastExample;

export default class Tef extends Component  {
  
 

  constructor(props) {    
    super(props);
    
    this.state = {
      input: '',
      arrayHolder: [
        
      ], 
      valor: '10,00',
      ip: '10.0.0.10',
      text:'',
      parcela: '1',
      checked: false,
      pagamento: '',
      tef: '',
      tipoTef: ''
     
    }
  }
  // recebe os dados enviados pela Ger7 ou M-Sitef, quando os recebe aciona a função _formatarInfoRecebida
  // eventTef é o nome do evento emitido 
  // .tef são os dados
  async componentDidMount(){
    DeviceEventEmitter.addListener("eventTef",event=>{ this._formatarInfoRecebida(event.tef)});


  }

  _formatarInfoRecebida(myjson){
  
        
    myjson = myjson.toString().split('\\n').join('')
    myjson = myjson.toString().split('\\r').join('')
    myjson = myjson.toString().split('\\').join('')
    myjson = myjson.toString().split('"{').join('{')
    myjson = myjson.toString().split('}"').join('}')
    var parsedJson = JSON.parse (myjson)


    
      
    if(this.state.tef=="ger7"){
      var retornoGer7 = new RetornoGer7();
      retornoGer7.fromJsonGer7(parsedJson);


      if (retornoGer7.getErrcode() != "0") {
        this.dialogoErroGer7(retornoGer7);
      }else {
          this.dialogoImpressao(retornoGer7.getPrint())
          this.dialogoTransacaoAprovadaGer7(retornoGer7);
        }
    }
    else{
      var retornoMsitef = new RetornoMsiTef();
      retornoMsitef.fromJsonMsiTef(parsedJson);
      if (retornoMsitef.getCodTrans().toString()=="" ||
            retornoMsitef.getCodTrans() == null  ) {
          //Caso ocorra um erro durante as ações, um dialogo de erro é chamado
          this.dialogoErroMsitef(retornoMsitef);
         
        } else {
          this.dialogoImpressao(retornoMsitef.textoImpressoEstabelecimento())
          this.dialogoTransacaoAprovadaMsitef(retornoMsitef);
        }
    }
    
     
  }
  enviarParametrosTef(tipoAcao,tipoTef,tefService) {
  
    

    // Verificando qual foi a tef selecionada, dependendo da Tef os seus parâmetros são formatados;
    if (tipoTef == "ger7") {
     
      switch (tipoAcao) {
        case "venda":
         
          parametroFormatado=tefService._formatarPametrosVendaGer7();
          break;
        case "cancelamento":
          parametroFormatado=tefService._formatarPametrosCancelamentoGer7();
          break;
        case "funcoes":
          parametroFormatado=tefService._formatarPametrosFuncaoGer7()
          break;
        case "reimpressao":
          parametroFormatado=tefService._formatarPametrosReimpressaoGer7();
          break;
      }
      ToastExample.realizarAcaoGer7( parametroFormatado);


   
    
      
    } else {  


      switch (tipoAcao) {
        
        case "venda":
          parametroFormatado =tefService._formatarPametrosVendaMsiTef();
          break;
        case "cancelamento":
          parametroFormatado=tefService._formatarPametrosCancelamentoMsiTef();
          break;
        case "funcoes":
          parametroFormatado=tefService._formatarPametrosFuncoesMsiTef();
          break;
        case "reimpressao":
          parametroFormatado=tefService._formatarPametrosReimpressaoMsiTef();
          break;
      }
 
      ToastExample.realizarAcaoMsiTef( parametroFormatado,tipoAcao);

      
    
     
    
    }


   
  }
  impressaoNota(texto){
    ToastExample.imprimeTexto(texto,"DEFAULT",20,false,false,false,"LEFT");
    ToastExample.fimImpressao();
  }
  realizarFuncoes(acao, tef,valor,ip,habilitarImpressao,parcelas,pagamento){
  
    var tefService = new TefService();
    var valorFormatado = valor
    this.state.tipoTef=tef;
   
    
    valorFormatado = valorFormatado.replace(/,/g, '')
    valorFormatado = valorFormatado.split('.').join('')
    if(valorFormatado.substring(0,2)=="R$"){
      valorFormatado=valorFormatado.substring(2)
    }
   
  

    tefService.setValorVenda(valorFormatado);
    tefService.setIpConfig(ip);
    tefService.setHabilitarImpressao(habilitarImpressao);
    tefService.setQuantParcelas(parcelas);
    tefService.setTipoPagamento(pagamento);
    this.enviarParametrosTef(acao,this.state.tipoTef, tefService);
  
  }
  dialogoImpressao(textoNota){
    Alert.alert(
      "Realizar Impressão",
      "Deseja realizar a impressão utilizando o codigo fonte da propria GPOS 700 ?",
      [
       
        {
          text: "Não",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Sim", onPress: () => this.impressaoNota(textoNota) }
      ],
      { cancelable: false }
    );

  }
  dialogoTransacaoAprovadaGer7(operacaoRetorno){
    Alert.alert('Transação Aprovada', "version: " + operacaoRetorno.getVersion()+ '\n'+
   "status: " + operacaoRetorno.getStatus()+'\n'+
   "config: " + operacaoRetorno.getConfig()+'\n'+
   "license: " + operacaoRetorno.getLicens()+'\n'+
   "terminal: " + operacaoRetorno.getTerminal()+'\n'+
   "merchant: " + operacaoRetorno.getMerchant()+'\n'+
   "id: " + operacaoRetorno.getId()+'\n'+
   "type: " + operacaoRetorno.getType()+'\n'+
   "product: " + operacaoRetorno.getProduct()+'\n'+
   "response: " + operacaoRetorno.getResponse()+'\n'+
   "authorization: " + operacaoRetorno.getAuthorization()+'\n'+
   "amount: " + operacaoRetorno.getAmount()+'\n'+
   "installments: " + operacaoRetorno.getInstallments()+'\n'+
   "instmode: " + operacaoRetorno.getInstmode()+'\n'+
   "stan: " + operacaoRetorno.getStan()+'\n'+
   "rrn: " + operacaoRetorno.getRrn()+'\n'+
   "time: " + operacaoRetorno.getTime()+'\n'+
   "track2: " + operacaoRetorno.getTrack2()+'\n'+
   "aid: " + operacaoRetorno.getAid()+'\n'+
   "cardholder: " + operacaoRetorno.getCardholder()+'\n'+
   "prefname: " + operacaoRetorno.getPrefname()+'\n'+
   "errcode: " + operacaoRetorno.getErrcode()+'\n'+
   "label: " + operacaoRetorno.getLabel())

  }
  dialogoErroGer7(operacaoRetorno){
    Alert.alert('Transação negada',  "version: " + operacaoRetorno.getVersion()+'\n'+
    "errcode: " + operacaoRetorno.getErrcode()+'\n'+
    "errmsg: " + operacaoRetorno.getErrmsg() )
  }
  dialogoTransacaoAprovadaMsitef(operacaoRetorno){
    Alert.alert('Transação aprovada', "CODRESP: " + operacaoRetorno.getCodResp()+'\n'+
    "COMP_DADOS_CONF: " + operacaoRetorno.getCompDadosConf()+'\n'+
    "CODTRANS: " + operacaoRetorno.getCodTrans()+'\n'+
    "CODTRANS (Name): " + operacaoRetorno.getNameTransCod()+'\n'+
    "VLTROCO: " + operacaoRetorno.getvlTroco()+'\n'+
    "REDE_AUT: " + operacaoRetorno.getRedeAut()+'\n'+
    "BANDEIRA: " + operacaoRetorno.getBandeira()+'\n'+
    "NSU_SITEF: " + operacaoRetorno.getNSUSitef()+'\n'+
    "NSU_HOST: " + operacaoRetorno.getNSUHOST()+'\n'+
    "COD_AUTORIZACAO: " + operacaoRetorno.getCodAutorizacao()+'\n'+
    "NUM_PARC: " + operacaoRetorno.getParcelas())
  }
  dialogoErroMsitef(operacaoRetorno){
    Alert.alert('Transação Negada', "CODRESP: " + operacaoRetorno.getCodResp()+'\n'+
    "Verique se o ip está correto !" )

  }
  render() {
    return (
        <SafeAreaView>
          <Text style={{color:'gray', fontSize: 22, fontWeight:'bold', marginLeft:15, marginRight:15, textAlign: 'center'}}>Exemplo TEF API - React-Native</Text>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
          <Text style={{color:'black', fontSize: 17, fontWeight:'bold', marginLeft:20, marginRight:15, textAlign:'left', marginTop: 8}}>Valor em R$</Text>
          <Text style={{color:'black', fontSize: 17, fontWeight:'bold',  marginLeft:55, textAlign:'left', marginTop: 8}}>IP </Text>
          <Text style={{color:'gray', fontSize: 13, fontWeight:'bold', marginRight:15, textAlign:'left', marginTop: 8}}>(somente para o M-Sitef)</Text>
         
          </View>
          
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
             
            <View style={{backgroundColor:'white',
          width:120,
          marginLeft:20,
          marginBottom:10, justifyContent: 'space-between',  flexDirection: 'row'}}>

            <TextInputMask
                type={'money'}
                options={{
                  precision: 2,
                  separator: ',',
                  delimiter: '.',
                  unit: 'R$',
                  suffixUnit: '',
              
                }}
                value={this.state.valor}
                onChangeText={text => {
                  this.setState({
                    valor: text
                  })
                }} 
              />
              
            </View>
            <View style={{
          width:150,
          marginRight:20,
          marginBottom:10, }}>
            <TextInput           
                        style={{height: 50,backgroundColor: 'white', fontSize: 17,}}  
                        placeholder="192.168.15.0"  
                        value={this.state.ip}
                        onChangeText={(text) => this.setState({ip: text})}  

                    />  
                   
          </View>
          
          </View>
          <Text style={{color:'black', fontSize: 17, fontWeight:'bold', marginLeft:20, marginRight:15, textAlign:'left'}}>Pagamento a ser utilizado</Text>
          <View style={{marginTop: 10, marginStart: 30 }}>
                  <RadioForm
                        radio_props={RadioPagamento}
                        initial={false}
                        onPress={(value) => this.setState({pagamento:value})}
                        buttonSize={20}
                        buttonOuterSize={20}
                        selectedButtonColor={'blue'}
                        buttonColor={'black'}
                        labelStyle={{ fontSize: 17,color:'black', marginTop: 3}}
                        disabled={false}
                        formHorizontal={false}
                        />  

          </View>
          <Text style={{color:'black', fontSize: 17, fontWeight:'bold', marginLeft:20, marginRight:15, textAlign:'left'}}>Número de Parcelas</Text>
          <View style={{backgroundColor:'white',
          width:300,
          marginStart:30,
          marginBottom:10, }}>
                 
                    <TextInputMask
                        type={'only-numbers'}
                        value={this.state.parcela}
                        onChangeText={text => {
                          this.setState({
                            parcela: text
                          })
                        }}
                      />
          </View>
          <Text style={{color:'black', fontSize: 17, fontWeight:'bold', marginLeft:20, marginRight:15, textAlign:'left', }}>Escolha a API</Text>
          <View style={{marginTop: 10, marginStart: 30, marginBottom: 8 }}>
                  <RadioForm
                        radio_props={RadioApi}
                        initial={false}
                        onPress={(value) => this.setState({tef:value})}
                        buttonSize={20}
                        buttonOuterSize={20}
                        selectedButtonColor={'blue'}
                        buttonColor={'black'}
                        labelStyle={{ fontSize: 15,color:'black', marginEnd: 100}}
                        disabled={false}
                        formHorizontal={true}
                        />  

          </View>
          <View style={{justifyContent: 'space-around', flexDirection: 'row',marginRight: 100, marginStart: 20}}>
              <CheckBox
               value={this.state.checked}
               onValueChange={() => this.setState({ checked: !this.state.checked })}
             
              />
              <Text style={{marginTop: 5, marginRight: 90}} >Habilitar impressão</Text>
          </View>

          <View style={{marginTop: 10, marginStart: 20, marginEnd: 20, marginBottom: 2}}>
          <Button
                        color= 'gray'
                        title="enviar transação"
                        onPress={() => this.realizarFuncoes('venda',this.state.tef, this.state.valor, this.state.ip, this.state.checked, this.state.parcela, this.state.pagamento)}
                    />
       
          </View>
          <View style={{marginTop: 8, marginStart: 20, marginEnd: 20, marginBottom: 2}}>
                    
                <Button
                        color= 'gray'
                        title="Cancelar transação"
                        onPress={() => this.realizarFuncoes('cancelamento',this.state.tef, this.state.valor, this.state.ip, this.state.checked, this.state.parcela, this.state.pagamento)}
                    />
          </View>
            
          <View style={{marginTop: 8, marginStart: 20, marginEnd: 20, marginBottom: 2}}>
                    
                    <Button
                            color= 'gray'
                            title="funções"
                            onPress={() => this.realizarFuncoes('funcoes',this.state.tef, this.state.valor, this.state.ip, this.state.checked, this.state.parcela, this.state.pagamento)}
                        />
          </View>
          <View style={{marginTop: 8, marginStart: 20, marginEnd: 20, marginBottom: 2}}>
                
                <Button
                        color= 'gray'
                        title="reimpressão"
                        onPress={() => this.realizarFuncoes('reimpressao',this.state.tef, this.state.valor, this.state.ip, this.state.checked, this.state.parcela, this.state.pagamento)}
                    />
          </View>
          

        </SafeAreaView>
    );
  }
}
