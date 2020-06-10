//* Cada função invocada do Sat retorna uma mensagem diferente, mas algumas possuem padrões, por isso algumas classes "Dinamicas" foram criadas.

// Esta classe serve como retorno para a seguintes funções do Sat: Ativar Sat, Configurações de Rede, Alterar codigo de ativação, Bloquear sat, Desbloquear sat , atualizar software;
export default class RetornoDinamicoSat{

    constructor(retornoCompleto){
        this._retorno = retornoCompleto; // Armazena a resposta completa não separadas por pipe
        this._dados= retornoCompleto.split("|"); // Armazena a resposta completa não separadas por pipe

    }
    getRespostaCompletaPipe(){
        return this._retorno;
    }
    getRespostaRecebida(){
        return this._dados[2];
    }
    

}
