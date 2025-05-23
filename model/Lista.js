import ModelError from "/model/ModelError.js";

export default class Lista {
    constructor(nome,data,itens,status){
        this.setItens(itens);
        this.setNome(nome);
        this.setData(data);
        if(status === undefined || status === null)
            this.setStatus("criada"); //Colocar depois o status correto, não sei qual era e coloquei criada. : Rafael
          else
            this.setStatus(status);
    }
    getListaId(){
        return this.listaId;
    }
    setListaId(listaId){
        Lista.validarListaId();
        this.listaId = listaId;
    }
    static validarListaId(listaId) {
        return true;
    }
    getItens(){
        return this.itens;
    }
    setItens(itens){
        Lista.validarItens();
        this.itens = itens;
    }
    static validarItens(itens) {
        return true;
    }
    getNome(){
        return this.nome;
    }
    setNome(nome){
        Lista.validarNome(nome);
        this.nome = nome;
    }
    static validarNome(nome) {
        if(nome == null || nome == "" || nome == undefined)
          throw new ModelError("Nome da Lista não pode ser Nulo!");
        if (nome.length > 32) 
          throw new ModelError("Nome da Lista deve ter até 20 caracteres!");
        const padraoNome = /^[\p{L}0-9\s\-\/]+$/u;
        if (!padraoNome.test(nome)) 
          throw new ModelError("Nome da Lista só pode conter letras e números!");
    }
    getData(){
        return this.data;
    }

    setData(data){
        Lista.validarData(data);
        this.data = data;
    }
    static validarData(data){
        if(data == null || data == "" || data == undefined)
            throw new ModelError("A data não pode ser nula!");
        const padraoData = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        if (!padraoData.test(data)) 
            throw new ModelError("A data não foi digitado corretamente! Ex:(01/01/2001)");
    }
    getStatus(){
        return this.status;
    }

    setStatus(status){
        Lista.validarStatus(status);
        this.status = status;
    }
    static validarStatus(status){
        if(status != 'criada' && status != "em andamento" && status != 'finalizada') //Colocar aqui os status que quiser, coloquei esses por exemplo! : Rafael
            throw new ModelError("Status inválido!");
            
    }

    
}