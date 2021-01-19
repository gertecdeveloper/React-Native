const maxLenght = 32;
const minLenght = 8;

export default class ValidacaoCodigo{
    getValidation(codigo){
        // console.log(codigo);
        if(codigo.length >= minLenght && codigo.length <= maxLenght){
            return true;
        }else{
            return false;
        }
    }
}