import React, { useState } from 'react';
import {TextInputMask} from 'react-native-masked-text';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, DeviceEventEmitter } from 'react-native';

import ValidaCodigo from '../../components/ValidacaoCodigo';
import ValidacaoCnpj from "../../components/ValidacaoCnpj";
import OperacaoSat from '../../services/operacaoSat';
import RetornoSat from '../../configs/config_sat/retornoSat';

const associarSat = () => {
    const [ cnpjContribuinte, setCnpjContribuinte ] = useState(global.CnpjContribuinte);
    const [ cnpjSoftwareHouse, setCnpjSoftwareHouse ] = useState(global.CnpjSoftwareHouse);
    const [ codigoAtivacao, setCodigoAtivacao ] = useState(global.MyVar);
    const [ assinatura, setAssinatura ] = useState(global.AssinaturaAC);

    function dialogoSat(messageText){
        Alert.alert("Retorno", messageText);
    }

    function associarSat(){
        // Salva  o código de ativação para o usuario não precisar ficar digitando em todas as telas 
        global.MyVar = codigoAtivacao;
        global.CnpjContribuinte = cnpjContribuinte;
        global.CnpjSoftwareHouse = setCnpjSoftwareHouse;
        global.AssinaturaAC = assinatura;

        // CRIA UMA INSTÂNCIAS DO COMPONENTE QUE VALIDA O CÓDIGO E CNPJ
        var validationCodigo = new ValidaCodigo();
        var validationCnpj = new ValidacaoCnpj();

        // Limpeza dos CNPJs
        var new_cnpj = validationCnpj.getClean(cnpjContribuinte);
        var new_cnpjSH = validationCnpj.getClean(cnpjSoftwareHouse);

        if(validationCodigo.getValidation(codigoAtivacao)){
            if(assinatura.length != 0 ){
                if(validationCnpj.getSize(new_cnpj) || validationCnpj.getSize(new_cnpjSH)){
                    dialogoSat("Verifique o CNPJ digitado!");
                }else{
                    //ENVIA PARA OPERAÇÃO SAT ONDE VAI CONECTAR COM O SAT DE ACORDO COM A FUNÇÃO
                    var operacaoSat = new OperacaoSat();

                    const args = {
                        'funcao': 'AssociarSAT', 
                        'random': Math.floor(Math.random() * 9999999).toString(),
                        'codigoAtivar': codigoAtivacao,
                        'cnpj': new_cnpj,
                        'cnpjSH': new_cnpjSH,
                        'assinatura': assinatura
                    };

                    operacaoSat.invocarOperacaoSat(args);
            
                    DeviceEventEmitter.once("eventAssociar", event => { 
                        var retorno = event.associar;
                        var retornoSat = new RetornoSat(args['funcao'], retorno);
                        dialogoSat(operacaoSat.formataRetornoSat(retornoSat));
                    });
                }
            }else {
                dialogoSat("Assinatura AC Inválida!");
            }
        }else {
            dialogoSat("Código de Ativação deve ter entre 8 a 32 caracteres!");
        }
    }
    

    return (
        <View style={styles.container}>        

            <View style={styles.containerOptionsAndButtons}>                
                <View style={styles.containerTitleAndInput}>
                    <Text style={styles.textOptions}>CNPJ Contribuinte: </Text>
                    <TextInputMask
                        type={'cnpj'}
                        style={styles.inputText}
                        keyboardType='numeric'
                        value={cnpjContribuinte}
                        onChangeText={setCnpjContribuinte}
                />
                </View>

                <View style={styles.containerTitleAndInput}>
                    <Text style={styles.textOptions}>CNPJ Software House: </Text>
                    <TextInputMask
                        type={'cnpj'}
                        style={styles.inputText}
                        keyboardType='numeric'
                        value={cnpjSoftwareHouse}
                        onChangeText={setCnpjSoftwareHouse}
                />
                </View>

                <View style={styles.containerTitleAndInput}>
                    <Text style={styles.textOptions}>Código de Ativação Sat: </Text>
                    <TextInput
                        style={styles.inputText}
                        autoCapitalize="none"
                        keyboardType='default'
                        autoCorrect={false}
                        value={codigoAtivacao}
                        onChangeText={setCodigoAtivacao}
                    />
                </View>

                <View style={styles.containerTitleAndInput}>
                    <Text style={styles.textOptions}>Assinatura AC: </Text>
                    <TextInput
                        style={styles.inputText}
                        autoCapitalize="none"
                        keyboardType='default'
                        autoCorrect={false}
                        value={assinatura}
                        onChangeText={setAssinatura}
                    />
                </View>
            
                <TouchableOpacity style={styles.button} onPress={associarSat}>
                    <Text style={styles.textButton}> ASSOCIAR </Text>
                </TouchableOpacity>
            </View>
        </View>
    );    
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
    containerTitleAndInput:{
        width: '50%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginVertical: 15,
    },
    containerOptionsAndButtons: {
        height: 400,
        alignItems: 'center'
    },

    inputText: {
        width: '60%',
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
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    }
});

export default associarSat;
