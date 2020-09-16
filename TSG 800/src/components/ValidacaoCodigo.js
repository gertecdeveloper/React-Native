const maxLenght = 32;
const minLenght = 8;

export default class ValidacaoCodigo{
    getValidation(cnpj){
        console.log('XXXX> ', cnpj);

        if(cnpj.length >= minLenght && cnpj.length <= maxLenght){
            return true;
        }
        
        return false;
    }
}