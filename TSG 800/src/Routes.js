import {createAppContainer} from 'react-navigation';
import App from '../App';
import CodigoDeBarra from "./pages/CodigoDeBarra";
import {createStackNavigator} from 'react-navigation-stack';

import NfcGedi from './pages/NfcGedi';
import Impressao from './pages/Impressao';
import Sat from './pages/Sat';

import AlterarCodigo from './pages/sat_pages/alterarCodigo';
import AssociarSat from './pages/sat_pages/associarSat';
import AtivarSat from './pages/sat_pages/ativarSat';
import ConfigSat from './pages/sat_pages/configSat';
import FerramentasSat from './pages/sat_pages/ferramentasSat';
import TesteSat from './pages/sat_pages/testeSat';

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