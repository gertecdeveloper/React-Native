import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MenuInicial from './MenuInicial';

import TEF from './pages/menus/Tef';
import SAT from './pages/menus/Sat';

import CodigoDeBarras from './pages/CodigoDeBarras';
import NFC from './pages/NfcGedi';
import SensorPresenca from './pages/SensorPresenca';
import FalaGBOT from './pages/FalaGBOT';
import ModoKiosk from './pages/ModoKiosk';

import AtivarSAT from './pages/sat_pages/ativarSat';
import AssociarSAT from './pages/sat_pages/associarSat';
import TesteSAT from './pages/sat_pages/testeSat';
import ConfigSAT from './pages/sat_pages/configSat';
import AlterarCodigoSAT from './pages/sat_pages/alterarCodigoSat';
import FerramentasSAT from './pages/sat_pages/ferramentasSat';

const AppStack = createStackNavigator();

export default function Routes(){
    return(
        <NavigationContainer>
            <AppStack.Navigator screenOptions={{headerShown: false}}>
                <AppStack.Screen name="MenuInicial" component={MenuInicial} />
                <AppStack.Screen name="CodigoDeBarras" component={CodigoDeBarras} />
                <AppStack.Screen name="SensorPresenca" component={SensorPresenca} />
                <AppStack.Screen name="FalaGBOT" component={FalaGBOT} />
                <AppStack.Screen name="ModoKiosk" component={ModoKiosk} />
                <AppStack.Screen name="NFC" component={NFC} />
                <AppStack.Screen name="TEF" component={TEF} />
                <AppStack.Screen name="SAT" component={SAT} />

                <AppStack.Screen name="AtivarSAT" component={AtivarSAT} />
                <AppStack.Screen name="AssociarSAT" component={AssociarSAT} />
                <AppStack.Screen name="TesteSAT" component={TesteSAT} />
                <AppStack.Screen name="ConfigSAT" component={ConfigSAT} />
                <AppStack.Screen name="AlterarCodigoSAT" component={AlterarCodigoSAT} />
                <AppStack.Screen name="FerramentasSAT" component={FerramentasSAT} />
            </AppStack.Navigator>
        </NavigationContainer>
    )
}