import React, { useState } from 'react';
import {View, Text, TouchableOpacity, TextInput, StyleSheet, Alert} from 'react-native';

import EscritaNFC from './NFC/EscritaNFC';
import LeituraNFC from './NFC/LeituraNFC';

const NfcGedi = () => {
    const [ textInput, setTextInput] = useState('');
    const [ functionType, setFunctionType ] = useState('');
    const [ restartComponent, setRestartComponent ] = useState(false);

    const buttons = [
        {id: 1, text: 'GRAVAR NO CARTÃO', onPress: () => {setFunctionType('Gravar'), setRestartComponent(!restartComponent)}},
        {id: 2, text: 'LER CARTÃO', onPress: () => {setFunctionType('Ler'), setRestartComponent(!restartComponent)}},
        {id: 3, text: 'FORMATAR CARTÃO', onPress: () => setFunctionType('Formatar') },
        {id: 4, text: 'TESTE LEITURA/GRAVAÇÃO', onPress: () => setFunctionType('Teste')},
    ];

    function type(){
        switch (functionType) {
            case 'Gravar':
                if(textInput != ''){
                    return(
                        <EscritaNFC text={textInput} restartWrite={restartComponent}/>
                    );
                }else{
                    Alert.alert("","Por favor digite uma palavra ou frase.");
                    setFunctionType('');
                    return(
                        <>
                        </>
                    )
                }
            case 'Ler':
                return(
                    <LeituraNFC  restartWrite={restartComponent} />
                );
            case 'Formatar':
                Alert.alert("","Essa função não está permitida com esse plugin!")
            case 'Teste':
                Alert.alert("","Essa função não está permitida com esse plugin!")
            default:
                return(
                    <>
                    </>
                );
        }; 
    };

    return (
        <View style={styles.container}>
            <Text style={styles.textTitle}>NFC - NDEF</Text>

            <View style={styles.containerButtonsAndList}>
                <View style={styles.containerInputTextAndButtons}>
                    <TextInput
                        style={styles.inputText}
                        placeholder="Mensagem Para Gravar no Cartão"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={textInput}
                        onChangeText={setTextInput}
                    />

                    {buttons.map(({text, onPress}, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.button}
                            onPress={onPress}
                        >
                            <Text style={styles.textButton}>{text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.containerList}>
                    { type() }
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        width: 400,
        height: 40,
        backgroundColor: '#00a6ff',
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
    containerInputTextAndButtons: {
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerList: {
        width: '50%',
        paddingLeft: 20,
    },
    containerButtonsAndList: {
        flexDirection: 'row'
    },

    inputText: {
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        width: 400,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#898c8a',
        marginBottom: 10,
    },

    textButton: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#FFFFFF'
    },
    textList: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#898c8a',
        marginBottom: 20
    },
    textTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#4a524c',
        marginVertical: 20
    }
})

export default NfcGedi;