import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, FlatList, View, Text, StatusBar, Image, TouchableOpacity} from 'react-native';

import Logo from './images/logo.png';

const MenuInicial = () => {
    const navigation = useNavigation();

    const buttons = [
        {id: 1, title: "Código de Barras", image:require('./images/barcode.png'), onPress: () => navigation.navigate("CodigoDeBarras") },
        {id: 2, title: "NFC- NDEF", image:require('./images/nfc.png'), onPress: () => navigation.navigate("NFC")},
        {id: 3, title: "Sensor de Presença", image:require('./images/sensor.png'), onPress: () => navigation.navigate("SensorPresenca")},
        {id: 4, title: "FALA G-Bot", image:require('./images/speaker.png'), onPress: () => navigation.navigate("FalaGBOT")},
        {id: 5, title: "Modo Quiosque", image:require('./images/kiosk.png'), onPress: () => navigation.navigate("ModoKiosk")},
        {id: 6, title: "TEF",image:require('./images/tef.png'), onPress: () => navigation.navigate("TEF")},
        {id: 7, title: "SAT",image:require('./images/sat.jpeg'), onPress: () => navigation.navigate("SAT")}
    ];

    const renderSeparator = () => {
        return (
            <View
                style={{
                height: 1,
                width: "86%",
                backgroundColor: "#CED0CE",
                }}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            <View style={styles.containerLogo}>
                <Image
                    style={styles.imageLogo}
                    source={Logo}                
                />
                <Text style={styles.textVersion}>React Native - 1.0.0 - G-BOT</Text>
            </View>
            
            <FlatList 
                data={buttons}
                key={item => String(item.id)}
                ItemSeparatorComponent={renderSeparator}
                renderItem={({item}) => (
                    <TouchableOpacity key={String(item.id)} onPress={item.onPress}>
                        <View style={styles.containerButtons}>
                            <Image source={item.image} style={styles.imageButton} resizeMethod='resize' />

                            <View style={styles.containerTitleButton}>
                                <Text style={styles.TextTitleButton}>{item.title}</Text>
                            </View>                                
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>     
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1
    },
    containerLogo: {
        width: '50%',
        height: '100%',

        justifyContent: 'center',
        alignItems: 'center'
    },
    containerListButtons: {
        width: '50%',
        height: '100%',
        backgroundColor: 'blue',

        justifyContent: 'center',
        alignItems: 'center'
    },
    imageLogo: {
        width: '80%',
        height: '30%',
        resizeMode: 'contain',
    },
    textVersion: {
        fontSize: 25,
        color: 'gray'
    },
    containerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',

        width: '100%',
        height: 60
    },
    imageButton: {
        width: 50,
        height: 50
    },
    containerTitleButton: {
        justifyContent: 'center',
        alignItems: 'center',

        width: '80%'
    },
    TextTitleButton: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'gray'
    }
});

export default MenuInicial;