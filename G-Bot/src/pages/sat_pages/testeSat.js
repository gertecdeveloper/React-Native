import React, { useState, useEffect } from 'react';
import DialogInput from 'react-native-dialog-input';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, DeviceEventEmitter, FlatList} from 'react-native';

import RetornoArquivoXml from '../../services/retornoArquivoXml';
import OperacaoSat from '../../services/operacaoSat';
import RetornoSat from '../../configs/config_sat/retornoSat';
import ValidaCodigo from '../../components/ValidacaoCodigo';

const testeSat = () => {
    const [ listaCodigo, setListaCodigo ] = useState([]);

    const [ isDialogVisible1, setIsDialogVisible1 ] = useState(false);
    const [ isDialogVisible2, setIsDialogVisible2 ] = useState(false);
    const [ codigoAtivacao, setCodigoAtivacao ] = useState(global.MyVar);

    const [ xmlVenda, setXmlVenda ] = useState('');
    const [ xmlCancelamento, setXmlCancelamento ] = useState('');

    var inputCancela = global.ChaveConsulta;
    var inputConsulta = '111';

    useEffect(() => {
        createFileXML();
    },[]);

    async function createFileXML(){
        var retornoArqXml = new RetornoArquivoXml();

        var xmlVenda_local = '';
        var xmlCancelamento_local = '';

        xmlVenda_local = await createFile(retornoArqXml.getArq_vendaXml(),'arq_venda.xml');
        xmlCancelamento_local = await createFile(retornoArqXml.getArq_cancelamentoXml(), 'arq_cancelamento.xml');

        setXmlVenda(xmlVenda_local);
        setXmlCancelamento(xmlCancelamento_local);
    }

    async function createFile(writeFile, filename){
        // Cria o arquivo xml no seu dispositivo para ser lido e transformado em base64
        const RNFS = require('react-native-fs');

        var path = RNFS.DocumentDirectoryPath + '/' + filename;

        RNFS.writeFile(path, writeFile,'utf8').then((success) => {
            console.log('FILE WRITTEN!');
          })
          .catch((err) => {
            console.log('erro');
        });
        
        var k = await transformarbase64(path);
        return await transformarbase64(path);
    };

    async function transformarbase64(path) {
        const RNFS = require('react-native-fs');
       
        // lê o arquivo que será criado no caminho especificado do dispositivo
        const  file1 = await RNFS.readFile(path,'base64');
    
        return file1;
    };

    function dialogoSat(messageText){
        const copialistaCodigo = Array.from(listaCodigo);

        copialistaCodigo.unshift({
            id: Math.floor(Math.random() * 9999999).toString(),
            time:  new Date().toLocaleString('pt-BR'),
            text: messageText            
        });

        setListaCodigo(copialistaCodigo);
    }

    function testeSat(texto, funcao){
        // Salva  o código de ativação para o usuario não precisar ficar digitando em todas as telas 
        global.MyVar = codigoAtivacao;
        global.ChaveConsulta = inputCancela;

        // CRIA UMA INSTÂNCIA DO COMPONENTE QUE VALIDA O CÓDIGO
        console.log(texto);
        var validationCodigo = new ValidaCodigo();

        console.log(funcao);

        if(funcao == "CancelarUltimaVenda"){
            inputCancela = texto;
        }else if(funcao == "ConsultarNumeroSessao"){
            inputConsulta = texto;
        }
      
        setIsDialogVisible1(false);
        setIsDialogVisible2(false);

        if(funcao == "ConsultarSat" || validationCodigo.getValidation(codigoAtivacao)){    
            //ENVIA PARA OPERAÇÃO SAT ONDE VAI CONECTAR COM O SAT DE ACORDO COM A FUNÇÃO
            var operacaoSat = new OperacaoSat();

            const args = {
                'funcao': funcao, 
                'random': Math.floor(Math.random() * 9999999).toString(),
                'codigoAtivar': codigoAtivacao,
                'cancela': inputCancela,
                'sessao': inputConsulta,
                'xmlVenda': xmlVenda,
                'xmlCancelamento': xmlCancelamento
            };
            
            operacaoSat.invocarOperacaoSat(args);

            DeviceEventEmitter.once("eventTeste", event => {
                var retorno = event.teste;
                var retornoSat = new RetornoSat(args['funcao'], retorno);
                dialogoSat(operacaoSat.formataRetornoSat(retornoSat));
            });
        }else{
            Alert.alert("Retorno", "Código de Ativação deve ter entre 8 a 32 caracteres!");
            // dialogoSat();
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerOptionsAndButtons}>
                <View style={styles.containerButtons}>                
                    <Text style={[styles.textOptions, {alignSelf: 'flex-start'}]}>Código de Ativação Sat: </Text>
                    <TextInput
                        style={styles.inputText}
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={codigoAtivacao}
                        onChangeText={setCodigoAtivacao}
                    />

                    <TouchableOpacity style={styles.button} onPress={() => testeSat('', 'ConsultarSat')}>
                        <Text style={styles.textButton}>CONSULTAR SAT</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() =>  testeSat('',"ConsultarStatusOperacional")}>
                        <Text style={styles.textButton}>STATUS OPERACIONAL</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => testeSat('', "EnviarTesteFim")}>
                        <Text style={styles.textButton}>TESTE FIM A FIM</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => testeSat('',"EnviarTesteVendas")}>
                        <Text style={styles.textButton}>ENVIAR DADOS DE VENDA</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => setIsDialogVisible1(true)}>
                        <Text style={styles.textButton}>CANCELAR VENDA</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => setIsDialogVisible2(true)}>
                        <Text style={styles.textButton}>CONSULTAR SESSÃO</Text>
                    </TouchableOpacity>

                    <DialogInput
                        isDialogVisible={isDialogVisible1}
                        initValueTextInput={inputCancela}
                        title={"CANCELAR VENDA"}
                        message={"Digite a chave de cancelamento"}
                        submitInput={ (inputCancela) => {testeSat(inputCancela, "CancelarUltimaVenda")} }
                        closeDialog={ () => setIsDialogVisible1(false)}
                    />

                    <DialogInput
                        isDialogVisible={isDialogVisible2}
                        initValueTextInput={inputConsulta}
                        title={"CONSULTAR SESSÃO"}
                        message={"Digite o numero da sessao"}
                        textInputProps={{keyboardType:'numeric'}}    
                        submitInput={ (inputConsulta) => {testeSat(inputConsulta,"ConsultarNumeroSessao")} }
                        closeDialog={ () => setIsDialogVisible2(false)}
                    />
                </View>

                
                <View style={styles.containerListReturn}>
                    <Text style={styles.textOptions}>Retorno Teste SAT</Text>
                    <FlatList
                        data={listaCodigo}
                        key={(index) => String(listaCodigo)}
                        renderItem={({item}, index) => (
                            <>
                                <Text key={index} style={styles.textList}>{item.time}:</Text>
                                <Text key={index} style={styles.textList}>{item.text}</Text>
                                <Text key={index} style={styles.textList}>-------------------------------------------</Text>
                            </>
                        )}
                    />
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 40,
        backgroundColor: '#c7c7c7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 5
    },

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    containerButtons: {
        width: '35%',
        height: 400,
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerOptionsAndButtons: {
        width: '100%',
        height: 500,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    containerListReturn: {
        width: '50%',
        height: 400,
        padding: 20,
        alignItems: 'flex-start',
        backgroundColor: 'white',
    },  

    inputText: {
        width: '100%',
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        fontSize: 18,
        color: 'black',
        textAlignVertical: 'bottom',
        height: 30,
        padding: 0,
        marginBottom: 10,
    },

    textButton: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    textOptions:{
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
        alignSelf: 'center'
    },
    textList: {
        fontSize: 14,
        alignSelf: 'flex-start',
        color: '#898c8a',
    },
});

export default testeSat;