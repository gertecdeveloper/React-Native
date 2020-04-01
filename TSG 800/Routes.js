import { createAppContainer } from 'react-navigation';
import App from './App';
import CodigoDeBarra from "./CodigoDeBarra";
import {createStackNavigator} from 'react-navigation-stack';
import NfcGedi from './NfcGedi';

import Impressao from './Impressao';

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
},

);

export default createAppContainer(Routes);