import React, { useState } from 'react';
import { Picker } from '@react-native-community/picker';
import { TextInputMask } from 'react-native-masked-text';
import { Text, View, Alert, TextInput, StyleSheet, DeviceEventEmitter, TouchableOpacity } from 'react-native';

import ValidaCodigo from '../../components/ValidacaoCodigo';
import OperacaoSat from '../../services/operacaoSat';
import RetornoSat from '../../configs/config_sat/retornoSat';

function configSat() {
    const [ codigoAtivacao, setCodigoAtivacao ] = useState(global.MyVar);
    
    const [ ipSat, setIpSat ] = useState('');
    const [ gatway, setGatway ] = useState('');
    const [ mascara, setMascara ] = useState('');
    const [ dns1, setDns1 ] = useState('');
    const [ dns2, setDns2 ] = useState('');

    const [ textInputRede, setTextInputRede ] = useState(true);
    const [ textInputDns, setTextInputDns ] = useState(false);
    const [ textInputProxy, setTextInputProxy ] = useState(false);

    const [ tipoRede, setTipoRede ] = useState('estatico');
    const [ habilitarDNS, setHabilitarDNS ] = useState('nao');
    const [ habilitarProxy, setHabilitarProxy ] = useState('nao usa');

    const [ proxyIp, setProxyIp ] = useState('');
    const [ porta, setPorta ] = useState('');
    const [ user, setUser ] = useState('');
    const [ password, setPassword ] = useState('');

    function dialogoSat(messageText){
        Alert.alert("Retorno", messageText);
    }

    function configRede(){
        // Salva  o código de ativação para o usuario não precisar ficar digitando em todas as telas
        global.MyVar = codigoAtivacao;

        // CRIA UMA INSTÂNCIA DO COMPONENTE QUE VALIDA O CÓDIGO
        var validationCodigo = new ValidaCodigo();

        if(validationCodigo.getValidation(codigoAtivacao)){

            //ENVIA PARA OPERAÇÃO SAT ONDE VAI CONECTAR COM O SAT DE ACORDO COM A FUNÇÃO
            var operacaoSat = new OperacaoSat();

            const args = {
                'funcao': 'EnviarConfRede', 
                'random': Math.floor(Math.random() * 9999999),
                'codigoAtivar': codigoAtivacao,
                'dadosXml': formatarEnvioConfigRede()
            };

            console.log(args['funcao'])

            operacaoSat.invocarOperacaoSat(args);
            

            DeviceEventEmitter.once("eventRede", event => {
                var retorno = event.rede;
                var retornoSat = new RetornoSat(args['funcao'], retorno);
                dialogoSat(operacaoSat.formataRetornoSat(retornoSat));
            });

        }else{
          dialogoSat("Código de Ativação deve ter entre 8 a 32 caracteres!");
      }
    };

    // Configuracao os dados a serem enviados para o Sat
    function formatarEnvioConfigRede(){
        var dadosXml = []
        // Monta as tags do XML sobre a parte de REDE

        dadosXml[0] = "";
        dadosXml[1] = "";
        dadosXml[2] = "";
        dadosXml[3] = "";
        dadosXml[4] = "";
        dadosXml[5] = "";
        dadosXml[6] = "";
        dadosXml[7] = "";
        dadosXml[8] = "";
        dadosXml[9] = "";
        dadosXml[10] = "";

        if (tipoRede == "estatico") {
            dadosXml[0] = "<tipoLan>IPFIX</tipoLan>";

            if (ipSat != '') { dadosXml[1] = "<lanIP>" + ipSat + "</lanIP>" };
            if (mascara != '') { dadosXml[2] = "<lanMask>" + mascara + "</lanMask>" };
            if (gatway != '') { dadosXml[3] = "<lanGW>" + gatway + "</lanGW>" };
    
            // Monta as tags do XML sobre a parte de DNS
            if (habilitarDNS == "sim") {
                if (dns1 != '') { dadosXml[4] = "<lanDNS1>" + dns1 + "</lanDNS1>" };
                if (dns2 != '') { dadosXml[5] = "<lanDNS2>" + dns2 + "</lanDNS2>" };
            } else {
                dadosXml[4] = "<lanDNS1>8.8.8.8</lanDNS1>";
                dadosXml[5] = "<lanDNS2>4.4.4.4</lanDNS2>";
            }
        }else{
            dadosXml[0] = "<tipoLan>DHCP</tipoLan>";
            dadosXml[1] = "";
            dadosXml[2] = "";
            dadosXml[3] = "";
            dadosXml[4] = "";
            dadosXml[5] = "";
        }
    
        // Monta as tags do XML sobre a parte de PROXY
        if (habilitarProxy == "nao usa") {
            dadosXml[6] = "<proxy>0</proxy >";
            dadosXml[7] = "";
            dadosXml[8] = "";
            dadosXml[9] = "";
            dadosXml[10] = "";
        } else if (habilitarProxy == "Proxy com configuração") {
            dadosXml[6] = "<proxy>1</proxy >";

            if (proxyIp != '') { dadosXml[7] = "<proxy_ip>" + proxyIp + "</proxy_ip>" };
            if (porta != '') { dadosXml[8] = "<proxy_porta>" + porta + "</proxy_porta>" };
            if (user != '') { dadosXml[9] = "<proxy_user>" + user + "</proxy_user>" };
            if (password != '') { dadosXml[10] = "<proxy_senha>" + password+ "</proxy_senha>" };
        } else {
            dadosXml[6] = "<proxy>2</proxy >";

            if (proxyIp != '') { dadosXml[7] = "<proxy_ip>" + proxyIp + "</proxy_ip>" };
            if (porta != '') { dadosXml[8] = "<proxy_porta>" + porta + "</proxy_porta>" };
            if (user != '') { dadosXml[9] = "<proxy_user>" + user + "</proxy_user>" };
            if (password != '') { dadosXml[10] = "<proxy_senha>" + password + "</proxy_senha>" }
        }

        return dadosXml;
    };

    function changeValueRede(s){        
        setTipoRede(s);
        // tipoRede = s;


        if(s == 'DHCP'){ 
             setTextInputRede(false);
            // this.setState({ textInputRede:false})
        }
        else{
            setTextInputRede(true);
            // this.setState({ textInputRede:true})
        }
    };

    function changeValueDns(s){
        setHabilitarDNS(s);
        // this.state.habilitarDNS = s;

        if(s == 'sim'){
            setTextInputDns(true);
            // this.setState({textInputDns:true})
        } else{
            setTextInputDns(false);
            // this.setState({textInputDns: false})
        }
    }

    function changeValueProxy(s){
        setHabilitarProxy(s);        
        // this.state.habilitarProxy = s;

        if(s == 'nao usa'){
            setTextInputProxy(false);
            // this.setState({textInputProxy: false});
        } else{
            setTextInputProxy(true);
            // this.setState({textInputProxy: true});
        }
    }

    return (
        <View style={styles.container}>        
            <View style={styles.contentContainer}>
                <View style={[styles.containerOptionsAndButtons, {width: '32%'}]}>                
                    <View style={styles.containerTitleAndInput}>
                        <Text style={styles.textOptions}>Código de Ativação: </Text>

                        <TextInput
                            style={[styles.inputText]}
                            autoCapitalize="none"
                            keyboardType='default'
                            autoCorrect={false}
                            value={codigoAtivacao}
                            onChangeText={setCodigoAtivacao}
                        />
                    </View>

                    <View style={styles.containerTitleAndInput}>
                        <Text style={styles.textOptions}>Tipo de Rede: </Text>
                        <Picker 
                            selectedValue={tipoRede}
                            style={{height: 30, width: 160 }}
                            onValueChange={(itemValue, itemIndex) => changeValueRede(itemValue)}
                        >      
                            <Picker.Item label="Estático" value="estatico" />
                            <Picker.Item label="DHCP" value="DHCP" />
                        </Picker>
                    </View>

                    <View style={styles.containerTitleAndInput}>
                        <Text style={styles.textOptions}>IP SAT: </Text>
                        <TextInputMask
                            type={'only-numbers'}
                            value={ipSat}
                            style={[styles.inputText, {width: '70%'}]}
                            onChangeText={setIpSat}
                            editable={textInputRede} 
                        />
                    </View>

                    <View style={styles.containerTitleAndInput}>
                        <Text style={styles.textOptions}>Máscara: </Text>
                        <TextInputMask
                            type={'only-numbers'}
                            value={mascara}
                            style={[styles.inputText, {width: '65%'}]}
                            onChangeText={setMascara}
                            editable={textInputRede} 
                        />
                    </View>

                    <View style={styles.containerTitleAndInput}>
                        <Text style={styles.textOptions}>Getway: </Text>
                        <TextInputMask
                            type={'only-numbers'}
                            value={gatway}
                            style={[styles.inputText, {width: '70%'}]}
                            onChangeText={setGatway}
                            editable={textInputRede} 
                        />
                    </View>
                </View>

                <View style={[styles.containerOptionsAndButtons, {width: '38%'}]}>                
                    <View style={styles.containerTitleAndInput}>
                        <Text style={styles.textOptions}>Proxy: </Text>
                        <Picker 
                            selectedValue={habilitarProxy}
                            style={{height: 30, width: 250 }}
                            onValueChange={(itemValue, itemIndex) => changeValueProxy(itemValue)}
                        >      
                            <Picker.Item label="Não usa proxy" value="nao usa" />
                            <Picker.Item label="Proxy com configurações" value="com configuracoes" />
                            <Picker.Item label="Proxy transparente" value="transparente" />
                        </Picker>
                    </View>

                    <View style={styles.containerTitleAndInput}>
                        <Text style={styles.textOptions}>Proxy IP: </Text>
                        <TextInputMask
                            type={'only-numbers'}
                            value={proxyIp}
                            style={[styles.inputText, {width: '64%'}]}
                            onChangeText={setProxyIp}
                            editable={textInputProxy} 
                        />
                    </View>

                    <View style={styles.containerTitleAndInput}>
                        <Text style={styles.textOptions}>Porta: </Text>
                        <TextInputMask
                            type={'only-numbers'}
                            value={porta}
                            style={[styles.inputText, {width: '70%'}]}
                            onChangeText={setPorta}
                            editable={textInputProxy} 
                        />
                    </View>

                    <View style={styles.containerTitleAndInput}>
                        <Text style={styles.textOptions}>User: </Text>
                        <TextInputMask
                            type={'only-numbers'}
                            value={user}
                            style={[styles.inputText, {width: '72%'}]}
                            onChangeText={setUser}
                            editable={textInputProxy} 
                        />
                    </View>

                    <View style={styles.containerTitleAndInput}>
                        <Text style={styles.textOptions}>Password: </Text>
                        <TextInputMask
                            type={'only-numbers'}
                            value={password}
                            style={[styles.inputText, {width: '62%'}]}
                            onChangeText={setPassword}
                            editable={textInputProxy} 
                        />
                    </View>
                </View>

                <View style={[styles.containerOptionsAndButtons, {width: '28%'}]}>                
                    <View style={styles.containerTitleAndInput}>
                        <Text style={styles.textOptions}>DNS: </Text>
                        <Picker 
                            selectedValue={habilitarDNS}
                            style={{height: 30, width: 200 }}
                            onValueChange={(itemValue, itemIndex) => changeValueDns(itemValue)}
                        >      
                            <Picker.Item label="Não" value="nao" />
                            <Picker.Item label="Sim" value="sim" />
                        </Picker>
                    </View>

                    <View style={styles.containerTitleAndInput}>
                        <Text style={styles.textOptions}>DNS 1: </Text>
                        <TextInputMask
                            type={'only-numbers'}
                            value={dns1}
                            style={[styles.inputText, {width: '72%'}]}
                            onChangeText={setDns1}
                            editable={textInputDns} 
                        />
                    </View>

                    <View style={styles.containerTitleAndInput}>
                        <Text style={styles.textOptions}>DNS 2: </Text>
                        <TextInputMask
                            type={'only-numbers'}
                            value={dns2}
                            style={[styles.inputText, {width: '72%'}]}
                            onChangeText={setDns2}
                            editable={textInputDns} 
                        />
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => configRede()}>
                <Text style={styles.textButton}> ENVIAR </Text>
            </TouchableOpacity>
        </View> 
    )
};

const styles = StyleSheet.create({
    button: {
        width: 400,
        height: 40,
        backgroundColor: '#c7c7c7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 5
    },

    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    contentContainer:{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    containerTitleAndInput:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginVertical: 7,
    },
    containerOptionsAndButtons: {
        width: '33%',
        alignItems: 'flex-start',
    },

    inputText: {
        width: '40%',
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        fontSize: 18,
        color: 'black',
        textAlignVertical: 'bottom',
        padding: 0
    },

    textButton: {
        fontSize: 17,
        fontWeight: 'bold'
    },
    textOptions:{
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    }
});

export default configSat
