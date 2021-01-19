import Venda from '../configs/config_tef/venda';

export default class TefService {
    constructor(valor, tipoPagamento, quantParcelas, habilitarImpressao, ip, parcelamento){    
        this._ipConfig = ip;
        this._valorVenda = valor;
        this._tipoPagamento = tipoPagamento;
        this._quantParcelas = quantParcelas;
        this._habilitarImpressao = habilitarImpressao;
        this._parcelamento = parcelamento;
    }
  
    getIpConfig(){return this._ipConfig}
    getValorVenda(){return this._valorVenda}


    getTipoPagamento(){    
        if (this._tipoPagamento == "Crédito") {
            return ["1", "3"];
        } else if (this._tipoPagamento == "Debito") {
            return ["2", "2"];
        } else if (this._tipoPagamento == "Voucher") {
            return ["4", "0"];
        } else if (this._tipoPagamento == "Carteira Digital") {
            return ["0", "122"];
        } else {
            return ["0", "0"];
        }
    }

    getQuantParcelas(){return this._quantParcelas };

    getImpressaoHabilitada(){return this._habilitarImpressao };

    setValorVenda(valor) {this._valorVenda = valor };

    setTipoPagamento(tipo)  {this._tipoPagamento = tipo };

    setQuantParcelas(quantParcelas) { this._quantParcelas = quantParcelas };

    setHabilitarImpressao(value) { this._habilitarImpressao = value };

    setIpConfig(ip) {this._ipConfig = ip };

    getTipoParcelamento(){
        return this._parcelamento;
    }

    setParcelamento(parcelamento){
        this._parcelamento = parcelamento;
    }

    _formatarPametrosVendaMsiTef (){
        let mapMsiTef = new Map();
    
        mapMsiTef["empresaSitef"] = "00000000";
        mapMsiTef["enderecoSitef"] = this.getIpConfig();
        mapMsiTef["operador"] = "0001";
        mapMsiTef["data"] = "20200324";
        mapMsiTef["hora"] = "130358";
        mapMsiTef["numeroCupom"] = Math.floor(Math.random() * 9999999).toString();
        mapMsiTef["valor"] = this.getValorVenda();
        
        mapMsiTef["CNPJ_CPF"] = "03654119000176";
        mapMsiTef["comExterna"] = "0";

        mapMsiTef["modalidade"] = this.getTipoPagamento()[1];
        
        if (this.getTipoPagamento()[1] == "3") {
            if (this.getQuantParcelas() == 1 || this.getQuantParcelas() == 0) {
                mapMsiTef["transacoesHabilitadas"] = "26";
            
            
            } else if (this._parcelamento=='loja') {
                console.log('loja')
                // Essa informações habilida o parcelamento Loja
                mapMsiTef["transacoesHabilitadas"] = "27";
                
            } else {
                // Essa informações habilida o parcelamento ADM
                mapMsiTef["transacoesHabilitadas"] = "28";
            }

            mapMsiTef["numParcelas"] = this.getQuantParcelas().toString();
            mapMsiTef["restricoes"] = null

        } else if (this.getTipoPagamento()[1] == "2") {
            mapMsiTef["transacoesHabilitadas"] = "16";
            mapMsiTef["numParcelas"] =null
            mapMsiTef["restricoes"] = null

        } else if (this.getTipoPagamento()[1] == "0") {
            mapMsiTef["restricoes"] = "transacoesHabilitadas=16";
            mapMsiTef["transacoesHabilitadas"]=null
            mapMsiTef["numParcelas"] =null
        } else if (this.getTipoPagamento()[1] == "122") {
            mapMsiTef["transacoesHabilitadas"] = "7";
            mapMsiTef["numParcelas"] =null
            mapMsiTef["restricoes"] = null
        };

        mapMsiTef["isDoubleValidation"] = "0";
        mapMsiTef["caminhoCertificadoCA"] = "ca_cert_perm";
    
        return mapMsiTef;
    }

    _formatarPametrosCancelamentoMsiTef(){
        let mapMsiTef =new  Map();

        mapMsiTef["empresaSitef"] = "00000000";
        mapMsiTef["enderecoSitef"] = this.getIpConfig();
        mapMsiTef["operador"] = "0001";
        mapMsiTef["data"] = "20200324";
        mapMsiTef["hora"] = "130358";
        mapMsiTef["numeroCupom"] = Math.floor(Math.random() * 9999999).toString();
        mapMsiTef["valor"] = this.getValorVenda();
        mapMsiTef["CNPJ_CPF"] = "03654119000176";
        mapMsiTef["comExterna"] = "0";

        if (this._tipoPagamento == "Carteira Digital") {
            mapMsiTef["modalidade"] = "110";
            mapMsiTef["restricoes"] = null
            mapMsiTef["numParcelas"] =null
            mapMsiTef["transacoesHabilitadas"] = "8";
        } else {
            mapMsiTef["modalidade"] = "200";
            mapMsiTef["transacoesHabilitadas"] = null;
        }


        mapMsiTef["isDoubleValidation"] = "0";
        mapMsiTef["restricoes"] = null;
        mapMsiTef["caminhoCertificadoCA"] = "ca_cert_perm";

        return mapMsiTef;
    }

    _formatarPametrosFuncoesMsiTef() {
        let mapMsiTef = new Map();
        
        mapMsiTef["empresaSitef"] = "00000000";
        mapMsiTef["enderecoSitef"] = this.getIpConfig();
        mapMsiTef["operador"] = "0001";
        mapMsiTef["data"] = "20200324";
        mapMsiTef["hora"] = "130358";
        mapMsiTef["numeroCupom"] = Math.floor(Math.random() * 9999999).toString();
        mapMsiTef["valor"] = this.getValorVenda();
        mapMsiTef["CNPJ_CPF"] = "03654119000176";
        mapMsiTef["comExterna"] = "0";
        mapMsiTef["modalidade"] = "110";
        mapMsiTef["isDoubleValidation"] = "0";
        mapMsiTef["caminhoCertificadoCA"] = "ca_cert_perm";
        mapMsiTef["restricoes"] = "transacoesHabilitadas=16;26;27";
        // if (this.getImpressaoHabilitada()) {
        //   mapMsiTef["comprovante"] = "1";
        // } else {
        //   mapMsiTef["comprovante"] = "0";
        // }
        mapMsiTef["transacoesHabilitadas"] = null;
        mapMsiTef["numParcelas"] =null
   
        return mapMsiTef;
    }

    _formatarPametrosReimpressaoMsiTef (){
        let mapMsiTef = new Map();
    
        mapMsiTef["empresaSitef"] = "00000000";
        mapMsiTef["enderecoSitef"] = this.getIpConfig();
        mapMsiTef["operador"] = "0001";
        mapMsiTef["data"] = "20200324";
        mapMsiTef["hora"] = "130358";
        mapMsiTef["numeroCupom"] = Math.floor(Math.random() * 9999999).toString();
        mapMsiTef["valor"] = this.getValorVenda();
        mapMsiTef["CNPJ_CPF"] = "03654119000176";
        mapMsiTef["comExterna"] = "0";
        mapMsiTef["modalidade"] = "114";
        mapMsiTef["isDoubleValidation"] = "0";
        mapMsiTef["caminhoCertificadoCA"] = "ca_cert_perm";
    
        mapMsiTef["transacoesHabilitadas"] = null;
        mapMsiTef["numParcelas"] =null
        mapMsiTef["restricoes"] = null
        return mapMsiTef;
    }
}
