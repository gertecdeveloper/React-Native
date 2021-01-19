import React, { useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, NativeModules} from 'react-native';
// import { immersiveModeOff, immersiveModeOn} from 'react-native-android-immersive-mode';

var GertecGBOT = NativeModules.NativeModulesGBOT;

const ModoKiosk = () => {
    const [ kiosk, setKiosk ] = useState(false);

    function activeKioskMode(active){
        if(active == 'ativado'){
            setKiosk(true);
            GertecGBOT.AtivarKioskMode(active);
            
        }else if (active == 'desativado'){
            setKiosk(false);
            GertecGBOT.AtivarKioskMode(active);
        }
    }

    return (
        <View style={styles.container}>

            { kiosk ? (
                <Text style={styles.textOptions}>Modo Kiosk Ativado</Text>
            ):(
                <Text style={styles.textOptions}>Modo Kiosk Desativado</Text>
            )}


            <View style={styles.containerButtons}>                
                <TouchableOpacity style={styles.button} onPress={() => activeKioskMode('ativado')}>
                    <Text style={styles.textButton}>START KIOSK MODE</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => activeKioskMode('desativado')}>
                    <Text style={styles.textButton}>STOP KIOSK MODE</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        width: '40%',
        height: 40,
        backgroundColor: '#c7c7c7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 5
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerButtons: {
        width: '70%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
    },

    textButton: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    textTitle: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#4a524c',
        marginVertical: 30
    },
    textOptions:{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#898c8a',
    }
});

export default ModoKiosk;
