import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, DeviceEventEmitter, NativeModules, BackHandler, BackHandlerStatic } from 'react-native';

var GertecGBOT = NativeModules.NativeModulesGBOT;

const SensorPresenca = () => {
    const [ listaRetorno, setListaRetorno ] = useState([]);

    const buttons = [
        {id: 1, text: 'INICIAR SERVIÇO', onPress: () => {GertecGBOT.StartSensor(true)}},
        {id: 2, text: 'PARAR SERVIÇO', onPress: () => {GertecGBOT.StartSensor(false)}}
    ];

    useEffect(() => {
        let mounted = true;

        DeviceEventEmitter.once("resultadoSensor", event => {
            if(mounted){
                var retorno = event.resultado;
                console.log(retorno);
                ListReturn(retorno);
                mounted = false;
            }
        });

        BackHandler.addEventListener('hardwareBackPress', function(){
            GertecGBOT.StartSensor(false);
        });
        
        return () => {
            mounted = false;
        };
    },[listaRetorno]);


    function ListReturn(retorno){
        const copiaListaReturn = Array.from(listaRetorno);

        copiaListaReturn.unshift({
            id: Math.floor(Math.random() * 9999999).toString(),
            textResult: retorno
        });

        setListaRetorno(copiaListaReturn);
        console.log(listaRetorno);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.textTitle}>Sensor de Presença</Text>

            
            <View style={styles.containerButtonsAndList}>
                <View style={styles.containerButtons}>                
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
                    <FlatList
                        data={listaRetorno}
                        key={(index) => String(listaRetorno)}
                        renderItem={({item}, index) => (
                            <Text key={item.id} style={styles.textList}>{item.textResult}</Text>
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
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20
    },
    containerButtonsAndList: {
        height: 300,
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    containerList: {
        width: '60%',
        paddingLeft: 20,
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
    textList: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#898c8a',
        marginBottom: 10
    },
});

export default SensorPresenca;
