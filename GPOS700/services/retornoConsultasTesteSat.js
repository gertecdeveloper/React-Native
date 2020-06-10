// Esta classe serve como retorno para a seguintes funções do Sat: ConsultarSat, teste fim a fim, Cancelar Última venda, Consultar numero sessao
export default class RetornoConsultasTesteSat {
    constructor(retornoCompleto) {
      this._retorno = retornoCompleto;  // Armazena a resposta completa não separadas por pipe
      this._dados = retornoCompleto.split("|"); // Armazena a o split da mensagem completa separada por pipes
    }
  
   
    getRespostaCompletaPipe(){
        return this._retorno;  
    } 
    getRespostaRecebida (){
      // if(this._dados.length==1){
      //   return this._dados[0];
      // }
        return this._dados[2];
        
    } 
    
    
    getCodigoResposta(){
        return this._dados[1];
    }
  
  }
