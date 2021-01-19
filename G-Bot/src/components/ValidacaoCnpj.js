const cnpjLenght = 14;

export default class ValidacaoCnpj{
    getClean(cnpj){
        console.log(cnpj);
        var cnpj_limpo = cnpj.split('.').join('').split('/').join('').split('-').join('');
        console.log(cnpj_limpo);

        return cnpj_limpo;
    }

    getSize(cnpj){
        if(cnpj.length != cnpjLenght){
            return true;
        }else{
            return false;
        }
    }
}