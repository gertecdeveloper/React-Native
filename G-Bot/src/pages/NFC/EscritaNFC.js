import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';

import NFC from '../../images/ic_nfc.png';

const EscritaNFC = ({text, restartWrite}) => {
    const [ sucessfully, setSucessufully ] = useState('');

    useEffect(() => {
        setSucessufully('');
        _testNdef();

        return () => {
            _cleanUp();
        };
    },[restartWrite]);

    const _cleanUp = () => {
        NfcManager.cancelTechnologyRequest().catch(() => 0);
    }
    
    const _testNdef = async () => {
        console.log(text);
        console.log(restartWrite);
        try {
            let resp = await NfcManager.requestTechnology(NfcTech.Ndef, {
                alertMessage: 'Ready to write some NFC tags!'
            });

            // console.warn('resp: ', resp);

            let ndef = await NfcManager.getNdefMessage();
            // console.warn(ndef);

            let bytes = buildUrlPayload(text);

            await NfcManager.writeNdefMessage(bytes);

            // console.warn('successfully write ndef');
            setSucessufully('Sucesso ao gravar informação!')

            _cleanUp();
        } catch (ex) {
        //   console.warn('ex', ex);
          _cleanUp();
        }
    };

    function buildUrlPayload(valueToWrite) {
        return Ndef.encodeMessage([
            Ndef.uriRecord(valueToWrite),
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.textTitle}>Gravar Cartão NFC</Text>

            <Image
                style={styles.imageLogo}
                source={NFC}
            />

            <View style={styles.containerMessageWrite}>
                {sucessfully == '' ? (
                    <Text style={styles.textWrite}>Aproxime o Cartão</Text>
                ):(
                    <Text style={styles.textWrite}>{sucessfully}</Text>
                )}                
            </View>            
        </View>
    )
};

const styles = StyleSheet.create({
    container:{
        alignItems: 'center'
    },
    containerMessageWrite:{
        alignItems: 'center',
    },

    imageLogo: {
        width: 170,
        height: 170,
        resizeMode: 'contain',
    },
    textTitle:{
        fontSize: 22,
    },
    textWrite:{
        fontSize: 14,
        color: 'gray'
    }
})

export default EscritaNFC;