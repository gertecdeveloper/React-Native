// Classe que formata a resposta obtida do Sat ao invocar a função Associar Sat
export default class RetornoAssociarSat{
    constructor(retornoCompleto){
        this._retorno = retornoCompleto; // Armazena a resposta completa não separadas por pipe
        this._dados = retornoCompleto.split("|"); // Armazena a o split da mensagem completa separada por pipes
    }
    getRespostaCompletaPipe(){
        return this._retorno;
    }
    getRespostaRecebida(){

        return this._dados[3];
    }
    getCodigoResposta(){

        return this._dados[2];
    }
    
}