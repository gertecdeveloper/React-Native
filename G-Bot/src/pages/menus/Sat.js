import React, {useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const Sat = () => {
    const navigation = useNavigation();

    // useEffect(() => {
    //     console.log('ENTROU NA APLICIAÇÃO SAT!');

    //     return () => {
    //         console.log('SAIU DA APLCIAÇÃO SAT!');
    //     }
    // },[])

    const buttons = [
        {id: 1, text: 'ATIVAÇÃO SAT', onPress: () => navigation.navigate("AtivarSAT")},
        {id: 2, text: 'ASSOCIAR ASSINATURA', onPress: () => navigation.navigate("AssociarSAT")},
        {id: 3, text: 'TESTE SAT', onPress: () => navigation.navigate("TesteSAT")},
        {id: 4, text: 'CONFIGURAÇÕES DE REDE', onPress: () => navigation.navigate("ConfigSAT")},
        {id: 5, text: 'ALTERAR CÓDIGO DE ATIVAÇÃO', onPress: () => navigation.navigate("AlterarCodigoSAT")},
        {id: 6, text: 'OUTRAS FERRAMENTAS', onPress: () => navigation.navigate("FerramentasSAT")}
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.textTitle}>GERSAT</Text>

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
    },

    textButton: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    textTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#4a524c',
        marginVertical: 30
    }
});

export default Sat;