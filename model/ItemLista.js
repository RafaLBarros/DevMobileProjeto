import ModelError from "/model/ModelError.js";

export default class ItemLista {
    constructor(status,quantidade){
        this.setStatus(status);
        this.setQuantidade(quantidade);
    }
    getItemListaId(){
        return this.itemListaId;
    }
    setItemListaId(itemListaId){
        ItemLista.validarItemListaId();
        this.itemListaId = itemListaId;
    }
    getStatus(){
        return this.status;
    }
    setStatus(status){
        ItemLista.validarStatus(status);
        this.status = status;
    }
    static validarStatus(status){
            if(status != 'CONCLUIDO' && status != "EM ANDAMENTO") //Colocar aqui os status que quiser, coloquei esses por exemplo! : Rafael
                throw new ModelError("Status inválido!");
                
        }
    getQuantidade(){
        return this.quantidade;
    }
    
    setQuantidade(quantidade){
        ItemLista.validarQuantidade(quantidade);
        this.quantidade = quantidade;
    }
    static validarQuantidade(quantidade){
        if(quantidade == null || quantidade == "" || quantidade == undefined)
            throw new ModelError("A quantidade não pode ser nula!");
        if(quantidade < 1)
            throw new ModelError("A quantidade deve ser no mínimo 1!");
        const padraoQuantidade = /[0-9] */;
        if (!padraoQuantidade.test(quantidade)) 
            throw new ModelError("Quantidade só pode conter números!");
    }
}