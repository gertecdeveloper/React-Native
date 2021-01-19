import React, { useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, DeviceEventEmitter} from 'react-native';

import OperacaoSat from '../../services/operacaoSat';
import RetornoSat from '../../configs/config_sat/retornoSat';

import ValidaCodigo from '../../components/ValidacaoCodigo';

const ferramentasSat = () => {
    const [ codigoAtivacao, setCodigoAtivacao ] = useState(global.MyVar);

    function dialogoSat(messageText){
        Alert.alert("Retorno", messageText);
    }

    function ferramentasSat(funcao){
        // Salva  o código de ativação para o usuario não precisar ficar digitando em todas as telas 
        global.MyVar = codigoAtivacao;

        var validationCodigo = new ValidaCodigo();

        if(validationCodigo.getValidation(codigoAtivacao)){
            //ENVIA PARA OPERAÇÃO SAT ONDE VAI CONECTAR COM O SAT DE ACORDO COM A FUNÇÃO
            var operacaoSat = new OperacaoSat();

            const args = {
                'funcao': funcao, 
                'random': Math.floor(Math.random() * 9999999).toString(),
                'codigoAtivar': codigoAtivacao
            };

            operacaoSat.invocarOperacaoSat(args);
            
            DeviceEventEmitter.once("eventFerramenta", event => { 
                var retorno = event.ferramenta;
                var retornoSat = new RetornoSat(args['funcao'], retorno);
                dialogoSat(operacaoSat.formataRetornoSat(retornoSat));
            });
        }else{
            dialogoSat("Código de Ativação deve ter entre 8 a 32 caracteres!");
        }
     }

    return (
        <View style={styles.container}>
            <View style={styles.containerOptionsAndButtons}>
                <Text style={styles.textOptions}>Código de Ativação Sat: </Text>
                <TextInput
                    style={styles.inputText}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={codigoAtivacao}
                    onChangeText={setCodigoAtivacao}
                />

                <View style={styles.containerButtons}>                
                    <TouchableOpacity style={styles.button} onPress={() => ferramentasSat("BloquearSat")}>
                        <Text style={styles.textButton}>BLOQUEAR SAT</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => ferramentasSat("DesbloquearSat")}>
                        <Text style={styles.textButton}>DESBLOQUEAR SAT</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => ferramentasSat("ExtrairLog")}>
                        <Text style={styles.textButton}>EXTRAIR LOG</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => ferramentasSat("AtualizarSoftware")}>
                        <Text style={styles.textButton}>ATUALIZAR SOFTWARE</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => ferramentasSat("Versao")}>
                        <Text style={styles.textButton}>VERIFICAR VERSÃO</Text>
                    </TouchableOpacity>
                </View>
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
        alignItems: 'center'
    },
    containerButtons: {
        width: '35%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    containerTitleAndInput:{
        width: 500,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    containerOptionsAndButtons: {
        height: 400,
        width: '35%',
        alignItems: 'center',
        justifyContent: 'center'
    },

    inputText: {
        width: '100%',
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        fontSize: 18,
        color: 'black',
        textAlignVertical: 'bottom',
        height: 30,
        padding: 0,
    },

    textButton: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    textOptions:{
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 10,
        alignSelf: 'flex-start'
    }
});

export default ferramentasSat;
