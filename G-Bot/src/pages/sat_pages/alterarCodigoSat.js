import React, { useState } from 'react';
import { Picker } from '@react-native-community/picker';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, DeviceEventEmitter } from 'react-native';

import OperacaoSat from '../../services/operacaoSat';
import RetornoSat from '../../configs/config_sat/retornoSat';
import ValidaCodigo from '../../components/ValidacaoCodigo';

import '../../services/globalValue';

const alterarCodigoSat = () => {
    const [ opcao, setOpcao ] = useState('Codigo de ativacao');
    const [ codigoAtivacao, setCodigoAtivacao ] = useState(global.MyVar);
    const [ novoCodigoAtivacao, setNovoCodigoAtivacao ] = useState('');
    const [ confirmacaoCodigo, setConfirmacaoCodigo ] = useState('');

    function dialogoSat(messageText){
        Alert.alert("Retorno", messageText);
    }

    // Função para validar os valores digitos pelo usuario e realizar a ativação do SAT
    function alterarCodigoSat(){
        // Salva  o código de ativação para o usuario não precisar ficar digitando em todas as telas 
        global.MyVar = codigoAtivacao;

        var validationCodigo = new ValidaCodigo();

        if(validationCodigo.getValidation(codigoAtivacao) && validationCodigo.getValidation(novoCodigoAtivacao)){
            if(novoCodigoAtivacao == confirmacaoCodigo){
                //Caso todos os valores estejam corretos
                // Envia para o canal de ativação a função de alterar codigo do Sat
                var op = 0;
                 // No Java o Sat reconhece 1 - Como sendo a opção de mudar codigo de ativação
                // 2 como sendo a opção de alterar codigo de emergência
                if( opcao == "Codigo de ativacao"){
                    op = 1;
                } else{
                    op=2;
                }

                // ToastExample.alterarSat(Math.floor(Math.random() * 9999999),this.state.codigoAtivacao,this.state.codigoAtivacaoNovo,op);
                var operacaoSat = new OperacaoSat();

                const args = {
                    'funcao': 'TrocarCodAtivacao',
                    'random': Math.floor(Math.random() * 9999999).toString(),
                    'codigoAtivar': codigoAtivacao,
                    'codigoAtivarNovo': novoCodigoAtivacao,
                    'op': op.toString()
                };

                operacaoSat.invocarOperacaoSat(args);

                DeviceEventEmitter.once("eventAlterar", event => { 
                    var retorno = event.alterar;
                    var retornoSat = new RetornoSat(args['funcao'], retorno);
                    dialogoSat(operacaoSat.formataRetornoSat(retornoSat));
                });
            }else{
                dialogoSat("O Código de Ativação Novo e a Confirmação do Código de Ativação não correspondem!");
            }
        }else{
            dialogoSat("Código de Ativação deve ter entre 8 a 32 caracteres!")
        }
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.containerOptionsAndButtons}>
                <View style={styles.containerTitleAndInput}>
                    <Text style={styles.textOptions}>Opções: </Text>
                    <Picker 
                        selectedValue={opcao}
                        style={{height: 30, width: 230 }}
                        onValueChange={setOpcao}
                    >      
                        <Picker.Item label="Código de ativação" value="Codigo de ativacao" />
                        <Picker.Item label="Código de emergência" value="Codigo de emergencia" />
                    </Picker>
                </View>

                <View style={styles.containerTitleAndInput}>
                    <Text style={styles.textOptions}>Atual: </Text>
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
                    <Text style={styles.textOptions}>Novo: </Text>
                    <TextInput
                        style={styles.inputText}
                        autoCapitalize="none"
                        keyboardType='default'
                        autoCorrect={false}
                        value={novoCodigoAtivacao}
                        onChangeText={setNovoCodigoAtivacao}
                    />
                </View>

                <View style={styles.containerTitleAndInput}>
                    <Text style={styles.textOptions}>Confirmar: </Text>
                    <TextInput
                        style={styles.inputText}
                        autoCapitalize="none"
                        keyboardType='default'
                        autoCorrect={false}
                        value={confirmacaoCodigo}
                        onChangeText={setConfirmacaoCodigo}
                    />
                </View>
            
                <TouchableOpacity style={styles.button} onPress={alterarCodigoSat}>
                    <Text style={styles.textButton}> ALTERAR </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 300,
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
    containerInputsText:{
        width: '50%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    containerTitleAndInput:{
        width: '50%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginVertical: 10,
    },
    containerOptionsAndButtons: {
        height: 400,
        alignItems: 'center'
    },

    inputText: {
        width: '90%',
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

export default alterarCodigoSat;
