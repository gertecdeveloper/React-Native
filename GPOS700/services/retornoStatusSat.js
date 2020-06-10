
export default class RetornoStatusSat {
    constructor(retornoCompleto) {
      this._retorno = retornoCompleto; // Armazena a resposta completa não separadas por pipe
      this._dados = retornoCompleto.split("|");// Armazena a o split da mensagem completa separada por pipes
    }
  
   
   getRespostaCompletaPipe(){return this.this._retorno};
   getEstadoDeOperacao() {
      if (this._dados[27] == "0")
        return "DESBLOQUEADO";
      else if (this._dados[27] == "1")
        return "BLOQUEADO SEFAZ";
      else if (this._dados[27] == "2")
        return "BLOQUEIO CONTRIBUINTE";
      else if (this._dados[27] == "3")
        return "BLOQUEIO AUTÔNOMO";
      else if (this._dados[27] == "4") return "BLOQUEIO PARA DESATIVAÇÃO";
    }
  
   getNumeroSerieSat(){return this._dados[5] + "\n";}
   getTipoLan(){return this._dados[6] + "\n";}
   getIpSat(){return this._dados[7] + "\n";}
   getMacSat(){return this._dados[8] + "\n";}
   getMascara(){return this._dados[9] + "\n";}
   getGateway(){return this._dados[10] + "\n";}
   getDns1(){return this._dados[11] + "\n";}
   getDns2(){return this._dados[12] + "\n";}
   getStatusRede(){return this._dados[13] + "\n";}
   getNivelBateria(){return this._dados[14] + "\n";}
   getMemoriaDeTrabalhoTotal(){return this._dados[15] + "\n";}
   getMemoriaDeTrabalhoUsada(){return this._dados[16] + "\n";}
   getData(){
    return (this._dados[17].substring(6, 8) +
    "/" +
    this._dados[17].substring(4, 6) +
    "/" +
    this._dados[17].substring(0, 4) +
    "\n");

   }
       
   getHora(){
        return ( this._dados[17].substring(8, 10) +
        ":" +
        this._dados[17].substring(10, 12) +
        ":" +
        this._dados[17].substring(12, 14) +
        "\n");
   }
        
   getVersao(){return this._dados[18] + "\n";}
   getVersaoLeiaute(){return this._dados[19] + "\n";}
   getUltimoCfeEmitido(){return this._dados[20] + "\n";}
   getPrimeiroCfeMemoria(){return this._dados[21] + "\n";}
   getUltimoCfeMemoria(){return this._dados[22] + "\n";}
   getUltimaTransmissaoSefazData(){
       return (this._dados[23].substring(6, 8) +
       "/" +
       this._dados[23].substring(4, 6) +
       "/" +
       this._dados[23].substring(0, 4) +
       "\n");
   }
        
   getUltimaTransmissaoSefazHora(){
       return ( this._dados[23].substring(8, 10) +
       ":" +
       this._dados[23].substring(10, 12) +
       ":" +
       this._dados[23].substring(12, 14) +
       "\n");
   }
       
   getUltimaComunicacaoSefazData(){
       return ( this._dados[24].substring(6, 8) +
       "/" +
       this._dados[24].substring(4, 6) +
       "/" +
       this._dados[24].substring(0, 4) +
       "\n");
   }
       
  }
  