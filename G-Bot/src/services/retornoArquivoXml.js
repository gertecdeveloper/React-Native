export default class RetornoArquivoXml{
    constructor(){
        this.cancelamento = '<?xml version="1.0" encoding="UTF-8"?>'+
        '<CFeCanc>'+
            '<infCFe chCanc="trocarCfe">'+
                '<ide>'+
                    '<CNPJ>16716114000172</CNPJ>'+
                    '<signAC>SGR-SAT SISTEMA DE GESTAO E RETAGUARDA DO SAT</signAC>'+
                    '<numeroCaixa>001</numeroCaixa>'+
                '</ide>'+
                '<emit/>'+
                '<dest/>'+
                '<total />'+
            '</infCFe>'+
        '</CFeCanc>';

       this.venda='<CFe>'+
        '<infCFe versaoDadosEnt="0.08">'+
            '<ide>'+
                '<CNPJ>16716114000172</CNPJ>'+
                '<signAC>SGR-SAT SISTEMA DE GESTAO E RETAGUARDA DO SAT</signAC>'+
                '<numeroCaixa>123</numeroCaixa>'+
            '</ide>'+
            '<emit>'+
                '<CNPJ>03654119000176</CNPJ>'+
                '<IE>000052619494</IE>'+
                '<IM>123123</IM>'+
                '<indRatISSQN>N</indRatISSQN>'+
            '</emit>'+
            '<dest/>'+
            '<det nItem="1">'+
                '<prod>'+
                    '<cProd>0020</cProd>'+
                    '<xProd>Trib ICMS Isento -  PIS e COFINS ST aliquota 0.0250</xProd>'+
                    '<NCM>60052300</NCM>'+
                    '<CFOP>5020</CFOP>'+
                    '<uCom>kg</uCom>'+
                    '<qCom>1.0000</qCom>'+
                    '<vUnCom>30.00</vUnCom>'+
                    '<indRegra>A</indRegra>'+
                '</prod>'+
                '<imposto>'+
                    '<ICMS>'+
                        '<ICMSSN102>'+
                            '<Orig>2</Orig>'+
                            '<CSOSN>400</CSOSN>'+
                        '</ICMSSN102>'+
                    '</ICMS>'+
                    '<PIS>'+
                        '<PISAliq>'+
                            '<CST>02</CST>'+
                            '<vBC>30.00</vBC>'+
                            '<pPIS>0.0250</pPIS>'+
                        '</PISAliq>'+
                    '</PIS>'+
                    '<PISST>'+
                        '<vBC>30.00</vBC>'+
                        '<pPIS>0.0250</pPIS>'+
                    '</PISST>'+
                    '<COFINS>'+
                        '<COFINSAliq>'+
                            '<CST>02</CST>'+
                            '<vBC>30.00</vBC>'+
                            '<pCOFINS>0.0250</pCOFINS>'+
                        '</COFINSAliq>'+
                    '</COFINS>'+
                    '<COFINSST>'+
                        '<vBC>30.00</vBC>'+
                        '<pCOFINS>0.0250</pCOFINS>'+
                    '</COFINSST>'+
                '</imposto>'+
            '</det>'+
            '<total/>'+
            '<pgto>'+
                '<MP><cMP>01</cMP>'+
                    '<vMP>30.00</vMP>'+
                '</MP>'+
            '</pgto>'+
       '</infCFe>'+
    '</CFe>'
    
    }
    getArq_cancelamentoXml(){
        return this.cancelamento;
       
    }
    getArq_vendaXml(){
        return this.venda;
    }
}