// Classe que formata a resposta obtida do Sat ao invocar a função "Extrair Log" Sat
import {utf8} from 'utf8';
import {base64} from 'react-native-base64';
export default class RetornoLogSat {
    constructor(retornoCompleto) {
      this._dados = retornoCompleto.split("|"); // Armazena a o split da mensagem completa separada por pipes

    }
  
   
   getRespostaRecebida(){
        return this._dados[2];
   } 
   getLog() {
      b64formatado = this._dados[5].toString().split(' ').join('').split("\n").join(" ").split(' ').join('');
      decoded = utf8.decode(base64.decode(b64formatado)); // username:password
      return decoded;
    }
    
}   