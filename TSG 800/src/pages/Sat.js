import React, { Component } from "react";
import { Platform, StyleSheet, FlatList, Text, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class Sat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      GridListItems: [
        { key: "ATIVAÇÃO SAT",onPress: ()=>this.props.navigation.navigate("ativarSat") },
        { key: "ASSOCIAR ASSINATURA" ,onPress: ()=>this.props.navigation.navigate("associarSat")},
        { key: "TESTE SAT",onPress: ()=>this.props.navigation.navigate("testeSat") },
        { key: "CONFIGURAÇÕES DE REDE",onPress: ()=>this.props.navigation.navigate("configSat") },
        { key: "ALTERAR CÓDIGO DE ATIVAÇÃO",onPress: ()=>this.props.navigation.navigate("alterarCodigo") },
        { key: "OUTRAS FERRAMENTAS",onPress: ()=>this.props.navigation.navigate("ferramentasSat") },
       
      ]
    };
  }

 

  render() {
     return (
      
         <SafeAreaView>
             <Text style={{fontSize: 22, textAlign: 'center', fontWeight: 'bold', height: 50,marginTop: 15, color: '#707070'}}>GERSAT- Aplicativo de Ativação</Text>
             <View style={{ height: 1.5, marginEnd: 22, backgroundColor: "orange",marginStart: 22, marginTop: -15 }} />
              
              <View style={styles.container}>
             
                <FlatList
                    data={ this.state.GridListItems }
                    renderItem={ ({item}) =>
                    <View style={styles.GridViewContainer}>
                        <TouchableOpacity onPress={item.onPress}>
                            
                            
                                <Text style={styles.GridViewTextLayout}  > {item.key} </Text>
                        
                          </TouchableOpacity> 
                       </View>}
                    numColumns={2}
                />
           </View>

         </SafeAreaView>
         
        
          
        
    
       
    );
  }

}


const styles = StyleSheet.create({
  container: {
    marginTop:30,
    justifyContent: "center",
    backgroundColor: "white"
  },
  headerText: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
    fontWeight: "bold"
  },
  GridViewContainer: {
   flex:1,
   justifyContent: 'center',
   alignItems: 'center',
   height: 100,
   margin: 5,
   backgroundColor: '#000080',
   marginTop: 15
},
GridViewTextLayout: {
   fontSize: 15,
   fontWeight: 'bold',
   justifyContent: 'center',
   color: '#fff',
   padding: 10,
 }
});