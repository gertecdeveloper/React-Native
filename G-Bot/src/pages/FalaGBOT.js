import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, Alert} from 'react-native';
import Tts from 'react-native-tts';

const FalaGBOT = () => {
    const [ textInput, setTextInput] = useState('');

    const buttons = [
        {id: 1, text: 'FRASE 1', pharse: 'Sejam todos bem vindos a apresentação do G-Bot!'},
        {id: 2, text: 'FRASE 2', pharse: 'Possui reconhecimento facial!'},
        {id: 3, text: 'FRASE 3', pharse: 'Microfone e Leitor NFC!'},
        {id: 4, text: 'FRASE DIGITADA', pharse: textInput},
    ];

    function speak(text){
        Tts.setDefaultLanguage('pt-BR');
        Tts.setDefaultRate(0.4);

        if(text != ''){
            Tts.speak(text, {
                androidParams: {
                  KEY_PARAM_PAN: -1,
                  KEY_PARAM_VOLUME: 0.5,
                  KEY_PARAM_STREAM: 'STREAM_MUSIC',
                },
            });
        }else{
            Alert.alert("","Por favor digite uma palavra ou frase.");
        }        
    }

    return (
        <View style={styles.container}>
            <Text style={styles.textTitle}>Fala G-Bot</Text>

            <View style={styles.containerButtonsAndInput}>
                <View style={styles.containerButtons}>
                    {buttons.map(({text, pharse}, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.button}
                            onPress={() => {speak(pharse)}}
                        >
                            <Text style={styles.textButton}>{text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.containerInputText}>
                    <Text style={styles.textTitleInput}>Digite a sua Frase Aqui</Text>

                    <TextInput
                        style={styles.inputText}
                        placeholder="Digite sua frase"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        autoCorrect={false}
                        multiline
                        value={textInput}
                        onChangeText={setTextInput}
                    />
                </View>
            </View>
        </View>
    )
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
    containerInputText: {
        width: '55%',
        paddingLeft: 20,
    },
    containerButtonsAndInput: {
        width: '100%',
        height: 250,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },

    inputText: {
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#898c8a',
    },

    textButton: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    textTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#4a524c',
        marginVertical: 20
    },
    textTitleInput: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4a524c',
        alignSelf: 'center',
        marginBottom: 10
    }
})

export default FalaGBOT;