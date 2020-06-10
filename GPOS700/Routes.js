import { createAppContainer } from 'react-navigation';
import App from './App';
import CodigoDeBarra from "./CodigoDeBarra";
import {createStackNavigator} from 'react-navigation-stack';
import NfcGedi from './NfcGedi';
import NfcId from './NfcId';
import Impressao from './Impressao';
import Tef from './Tef';
import Sat from './Sat';
import AlterarCodigo from './sat_pages/alterarCodigo';
import AssociarSat from './sat_pages/associarSat';
import AtivarSat from './sat_pages/ativarSat';
import ConfigSat from './sat_pages/configSat';
import FerramentasSat from './sat_pages/ferramentasSat';
import TesteSat from './sat_pages/testeSat';
const Routes = createStackNavigator({
  Home: {
    screen: App,
    navigationOptions: {
      headerShown: false,
    }
  },
  CodigoDeBarra: {
    screen: CodigoDeBarra,
    navigationOptions: {
      headerShown: false,
    },
  },
 
  NfcId: {
      screen: NfcId,
      navigationOptions: {
        headerShown: false,
    },
  },
   NfcGedi: {
      screen: NfcGedi,
      navigationOptions: {
      headerShown: false,
    }
  },
  Impressao: {
    screen: Impressao,
    navigationOptions: {
    headerShown: false,
    }
  },
  Tef: {
    screen: Tef,
    navigationOptions: {
    headerShown: false,
    }
  },
  Sat: {
    screen: Sat,
    navigationOptions: {
    headerShown: false,
    }
  },
  alterarCodigo: {
    screen: AlterarCodigo,
    navigationOptions: {
    headerShown: false,
    }
  },
  associarSat: {
    screen: AssociarSat,
    navigationOptions: {
    headerShown: false,
    }
  },
  ativarSat: {
    screen: AtivarSat,
    navigationOptions: {
    headerShown: false,
    }
  },
  configSat: {
    screen: ConfigSat,
    navigationOptions: {
    headerShown: false,
    }
  },
  ferramentasSat: {
    screen: FerramentasSat,
    navigationOptions: {
    headerShown: false,
    }
  },
  testeSat: {
    screen:TesteSat,
    navigationOptions: {
    headerShown: false,
    }
  },
},

);

export default createAppContainer(Routes);