import React, { useState } from 'react';
import {TextInputMask} from 'react-native-masked-text';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, DeviceEventEmitter, Alert } from 'react-native';

import ValidaCodigo from '../../components/ValidacaoCodigo';
import ValidacaoCnpj from "../../components/ValidacaoCnpj";

import OperacaoSat from '../../services/operacaoSat';
import RetornoSat from '../../configs/config_sat/retornoSat';

const ativarSat = () => {
    const [ cnpj, setCnpj ] = useState('');
    const [ codigoAtivacao, setCodigoAtivacao ] = useState(global.MyVar);
    const [ confirmacaoCodigo, setConfirmacaoCodigo ] = useState('');

    function dialogoSat(messageText){
        Alert.alert("Retorno", messageText);
        console.log(messageText);
    }

    function AtivarSAT(){
        global.MyVar = codigoAtivacao;
        
        var validationCodigo = new ValidaCodigo();
        var validationCnpj = new ValidacaoCnpj();
        
        var new_cnpj = validationCnpj.getClean(cnpj);

        if(validationCodigo.getValidation(codigoAtivacao)){            
            if(codigoAtivacao == confirmacaoCodigo){
                if(validationCnpj.getSize(new_cnpj)){
                    dialogoSat("Verifique o CNPJ digitado!");
                }else{
                    //ENVIA PARA OPERAÇÃO SAT ONDE VAI CONECTAR COM O SAT DE ACORDO COM A FUNÇÃP
                    var operacaoSat = new OperacaoSat();

                    const args = {
                        'funcao': 'AtivarSAT',
                        'random': Math.floor(Math.random() * 9999999).toString(),
                        'codigoAtivar': codigoAtivacao,
                        'cnpj': new_cnpj
                    };

                    operacaoSat.invocarOperacaoSat(args);
                    
                    //RECEBE OS DADOS QUE FORAM ENVIADOS NA REPOSTA
                    DeviceEventEmitter.once("eventAtivar", event=> { 
                        var retorno = event.ativar;
                        var retornoSat = new RetornoSat(args['funcao'], retorno);
                        dialogoSat(operacaoSat.formataRetornoSat(retornoSat));
                    });
                }
            }else{
                dialogoSat("O Código de Ativação e a Confirmação do Código de Ativação não correspondem!");
            }
        }else{
            //console.log('XXXX: ', validationCnpj.getValidation(this.state.codigoAtivacao));
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
                        value={cnpj}
                        onChangeText={setCnpj}
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
                    <Text style={styles.textOptions}>Confirmação do Código: </Text>
                    <TextInput
                        style={styles.inputText}
                        autoCapitalize="none"
                        keyboardType='default'
                        autoCorrect={false}
                        value={confirmacaoCodigo}
                        onChangeText={setConfirmacaoCodigo}
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={AtivarSAT}>
                    <Text style={styles.textButton}> ATIVAR </Text>
                </TouchableOpacity>
            </View>
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

export default ativarSat;