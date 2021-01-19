import React, { useState } from 'react';
import {TextInputMask} from 'react-native-masked-text';
import MaskedInput from 'react-native-masked-input-text';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, DeviceEventEmitter, FlatList} from 'react-native';
import RadioForm from 'react-native-simple-radio-button';

import { NativeModules } from 'react-native';

import TefService from '../../services/serviceTef';
import RetornoMsiTef from  '../../configs/config_tef/operacaoRetornoMsiTef';


var RadioPayment = [
    {label: 'Crédito', value: 'Crédito' },
    {label: 'Débito', value:'Debito'},
    {label: 'Carteira Digital', value: 'Carteira Digital' },
    {label: 'Todos', value: 'Voucher' },
];

var RadioParcelamento = [
    {label: 'Parcelado Loja', value: 'loja' },
    {label: 'Parcelado Adm', value:'adm'},
];

var GertecGBOT = NativeModules.NativeModulesGBOT;

const Tef = () => {
    const [ listaCodigo, setListaCodigo ] = useState([]);

    const [ ip, setIP ] = useState('');
    const [ tef, setTef ] = useState('msitef');
    const [ debito, setDebito] = useState(true);
    const [ tipoTef, setTipoTef ] = useState('');
    const [ valor, setValor ] = useState('10,00');
    const [ parcelas, setParcelas] = useState('1');
    const [ pagamento, setPagamento] = useState('Crédito');
    const [ parcelamento, setParcelamento ] = useState('adm');

    var acao = '';

    function changeValueParcelas(pagamento){
        if( pagamento == 'Crédito'){
            setDebito(true);
            setPagamento('Crédito');
        }
        else {
            setDebito(false);
            setPagamento(pagamento);
            setParcelas('1');
        }
    }

    function realizarFuncoes(acaoButton, tef, valor, ip, habilitarImpressao, parcelas, pagamento){
        acao = acaoButton;
     
        var ehValido = true;
        var valorFormatado = valor;

        ip = ip.split(' ').join('');
       
        valorFormatado = valorFormatado.replace(/,/g, '');
        valorFormatado = valorFormatado.split('.').join('');

        if((/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip) && tef == 'msitef')){
            ehValido = true;
        }else{
            Alert.alert('É necessário colocar um IP válido');
            ehValido = false;
        };
        
        if(valorFormatado == '000' || valorFormatado == ''){
            Alert.alert('É necessário colocar um valor em R$ '+ '\n(maior que 0)')
            ehValido = false
        };
        
        if((parcelas == '0' || parcelas == '') && (pagamento == 'Crédito')){
            Alert.alert('É necessário colocar o número de parcelas desejadas '+ '\n(maior ou igual a 1)'+'\n(obs.: Opção por compra por crédito marcada)')
            ehValido = false;    
        };
               
        if(ehValido) {
            var tefService = new TefService();
            
            // this.state.tipoTef = tef;
            setTipoTef(tef);

            console.log('parcelamento', parcelamento);
            console.log('valorFormatado', valorFormatado);
            console.log('ip', ip);
            console.log('habilitarImpressao', habilitarImpressao);
            console.log('parcelas', parcelas);
            console.log('pagamento', pagamento);
            console.log('tipoTef', tipoTef);

            tefService.setParcelamento(parcelamento);
            tefService.setValorVenda(valorFormatado);
            tefService.setIpConfig(ip);
            tefService.setHabilitarImpressao(habilitarImpressao);
            tefService.setQuantParcelas(parcelas);        
            tefService.setTipoPagamento(pagamento);

            enviarParametrosTef(acao, tipoTef, tefService);
        };
    };

    function enviarParametrosTef(tipoAcao, tipoTef, tefService) {       
        var parametroFormatado = '' ;

        switch (tipoAcao) {
            case "venda":
                parametroFormatado = tefService._formatarPametrosVendaMsiTef();
                break;

            case "cancelamento":
                parametroFormatado = tefService._formatarPametrosCancelamentoMsiTef();
                break;
            case "funcoes":
                parametroFormatado = tefService._formatarPametrosFuncoesMsiTef();
                break;

            case "reimpressao":
                parametroFormatado = tefService._formatarPametrosReimpressaoMsiTef();
                break;                
        }

        console.log('Parametro Formatado: ', parametroFormatado);
        console.log('Tipo Ação: ', tipoAcao);
     
        GertecGBOT.realizarAcaoMsiTef(parametroFormatado, tipoAcao);
        // recebe os dados enviados M-Sitef, quando os recebe aciona a função _formatarInfoRecebida
        // eventSitef é o nome do evento emitido 
        // .msitef são os dados
        
        DeviceEventEmitter.once("eventSitef", event => {
            _formatarInfoRecebida(event.msitef);
        });
    };
    
    function _formatarInfoRecebida(myjson){  
        myjson = myjson.toString().split('\\r').join('')
        myjson = myjson.toString().split('"{').join('{')
        myjson = myjson.toString().split('}"').join('}')

        var parsedJson = JSON.parse(myjson)
          
        var retornoMsitef = new RetornoMsiTef();

        retornoMsitef.fromJsonMsiTef(parsedJson);
    
        if(retornoMsitef.getCodResp() == '0'){
            var impressao= '';
          
            if(retornoMsitef.textoImpressoCliente() != ''){   
              impressao+= retornoMsitef.textoImpressoCliente();
            };

            if(retornoMsitef.textoImpressoEstabelecimento() != ''){
              impressao += '\n\n-----------------------------     \n' //espaço entre os cupons 
              impressao += retornoMsitef.textoImpressoEstabelecimento();
            }
            
          
            if(impressao != ''){
              dialogoImpressao(impressao);
            }
        };

        console.log('acao in dialog: ', acao);

        if (( acao == 'venda' || acao == 'cancelamento')){
             
            if((retornoMsitef.getCodTrans().toString() == "" || retornoMsitef.getCodTrans() == null)) {
                //Caso ocorra um erro durante as ações, um dialogo de erro é chamado
                dialogoErroMsitef(retornoMsitef);
            }else{
                dialogoTransacaoAprovadaMsitef(retornoMsitef);
            }
        };
    };

    function dialogoImpressao(impressao){
        const copialistaCodigo = Array.from(listaCodigo);

        copialistaCodigo.unshift({
            id: Math.floor(Math.random() * 9999999).toString(),
            time:  new Date().toLocaleString('pt-BR'),
            text: impressao
        });

        setListaCodigo(copialistaCodigo);
    }

    function dialogoErroMsitef(operacaoRetorno){
        const copialistaCodigo = Array.from(listaCodigo);

        var messageText = 'Ocorreu um erro durante a realização da ação: ' + '\n' + "CODRESP: " + operacaoRetorno.getCodResp();

        copialistaCodigo.unshift({
            id: Math.floor(Math.random() * 9999999).toString(),
            time:  new Date().toLocaleString('pt-BR'),
            text: messageText
        });

        setListaCodigo(copialistaCodigo);
    };

    function dialogoTransacaoAprovadaMsitef(operacaoRetorno){
        Alert.alert('Ação executada com sucesso', "CODRESP: " + operacaoRetorno.getCodResp()+'\n'+
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
    };

    return (
        <View style={styles.container}>
            <Text style={styles.textTitle}>Exemplo M-Sitef - React Native</Text>

            <View style={styles.containerOptionsAndButtons}>
                <View style={styles.containerOptions}>
                    <View style={styles.containerInputsText}>
                        <View style={styles.containerValue}>
                            <Text style={styles.textOptions}>Valor em R$</Text>
                            <TextInputMask
                                type={'money'}
                                style={styles.inputText}
                                options={{
                                    precision: 2,
                                    separator: ',',
                                    delimiter: '.',
                                    unit: '',
                                    suffixUnit: '',                            
                                }}
                                value={valor}
                                onChangeText={setValor}
                            />
                        </View>

                        <View style={styles.containerIP}>
                            <Text style={styles.textOptions}>IP Servidor </Text>
                            <MaskedInput 
                                mask={'0.?0?.?0?.?0.?0?.?0?.?0.?0?.?0?.?0.?0?.?0?'}
                                placeholder={"192.168.0.1"}
                                keyboardType={'numeric'} 
                                style={styles.inputText}
                                value={ip}
                                onChangeText={setIP}
                            />
                        </View>
                    </View>

                    <View style={styles.containerRadiosOptions}>
                        <View style={styles.containerPayment}>
                            <Text style={styles.textOptions}>Pagamento a ser utilizado: </Text>
                            <RadioForm
                                radio_props={RadioPayment}
                                initial={0}
                                onPress={(value) => changeValueParcelas(value)}
                                buttonSize={10}
                                buttonOuterSize={20}
                                buttonColor={'gray'}
                                labelStyle={{ fontSize: 15, color:'black'}}
                                style={{marginVertical: 10}}
                                disabled={false}
                                formHorizontal={false}
                            /> 
                        </View>

                        <View style={styles.containerInstallments}>
                            <Text style={styles.textOptions}>Tipo de Parcelamento: </Text>
                            <RadioForm
                                radio_props={RadioParcelamento}
                                initial={0}
                                onPress={(value) => setParcelamento(value)}
                                buttonSize={10}
                                buttonOuterSize={20}
                                buttonColor={'gray'}
                                labelStyle={{ fontSize: 15, color:'black'}}
                                style={{marginVertical: 10}}
                                disabled={false}
                                formHorizontal={false}
                            />                           
                        </View>
                    </View>

                    <View style={styles.containerInstallmentNumbers}>
                        <Text style={styles.textOptions}>Número de Parcelas</Text>
                        <TextInput
                            style={styles.inputText}
                            placeholder="0"
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                            keyboardType='numeric'
                            autoCorrect={false}
                            value={parcelas}
                            onChangeText={setParcelas}
                        />
                    </View>

                    <View style={styles.containerButtons}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => realizarFuncoes('venda', tef, valor, ip, false, parcelas, pagamento)}
                        >
                            <Text style={styles.textButton}>ENVIAR TRANSAÇÃO</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => realizarFuncoes('cancelamento', tef, valor, ip, false, parcelas, pagamento)}
                        >
                            <Text style={styles.textButton}>CANCELAR TRANSAÇÃO</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => realizarFuncoes('funcoes', tef, valor, ip, false, parcelas, pagamento)}
                        >
                            <Text style={styles.textButton}>FUNÇÕES</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => realizarFuncoes('reimpressao', tef, valor, ip, false, parcelas, pagamento)}
                        >
                            <Text style={styles.textButton}>REIMPRESSÃO</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.containerListReturn}>
                    <Text style={styles.textOptions}>Retorno TEF</Text>
                    <FlatList
                        data={listaCodigo}
                        key={(index) => String(listaCodigo)}
                        renderItem={({item}, index) => (
                            <>
                                <Text key={index} style={styles.textList}>{item.time}:</Text>
                                <Text key={index} style={styles.textList}>{item.text}</Text>
                                <Text key={index} style={styles.textList}>-------------------------------------------</Text>
                            </>
                        )}
                    />
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    button: {
        width: 300,
        height: 35,
        backgroundColor: '#c7c7c7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 3,
        borderRadius: 5
    },

    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    containerButtons: {
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    containerInputsText:{
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    containerInstallmentNumbers:{
        width: '90%',
        justifyContent: 'space-evenly',
    },
    containerOptions: {
        width: '42%',
        height: 410,
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerOptionsAndButtons: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
    },
    containerRadiosOptions: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },    
    containerListReturn: {
        width: '50%',
        height: '90%',
        padding: 20,
        alignItems: 'center',
        backgroundColor: 'white',
    },  

    inputText: {
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        fontSize: 15,
        color: 'black',
        textAlignVertical: 'bottom',
        height: 25,
        padding: 0
    },

    textButton: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    textTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4a524c',
        marginVertical: 10
    },
    textOptions:{
        fontSize: 14,
        fontWeight: 'bold',
        color: '#898c8a',
    },
    textList: {
        fontSize: 14,
        alignSelf: 'flex-start',
        color: '#898c8a',
    },
});

export default Tef;