import ModelError from "/model/ModelError.js";

export default class Produto {
    constructor(nome,quantidade,estoqueMin,dataCadastro){
        this.setNome(nome);
        this.setQuantidade(quantidade);
        this.setEstoqueMin(estoqueMin);
        this.setDataCadastro(dataCadastro);
    }
    getProdutoId(){
        return this.produtoId;
    }
    setProdutoId(produtoId){
        Produto.validarProdutoId();
        this.produtoId = produtoId;
    }
    static validarProdutoId(produtoId) {
        return true;
    }
    getNome(){
        return this.nome;
    }
    setNome(nome){
        Produto.validarNome(nome);
        this.nome = nome;
    }
    static validarNome(nome) {
        if(nome == null || nome == "" || nome == undefined)
          throw new ModelError("Nome do Produto não pode ser Nulo!");
        if (nome.length > 20) 
          throw new ModelError("Nome do Produto deve ter até 20 caracteres!");
        const padraoNome = /^[A-Za-zÀ-ÖØ-öø-ÿÇç\s]+$/;
        if (!padraoNome.test(nome)) 
          throw new ModelError("Nome do Produto Inválido");
    }
    getQuantidade(){
        return this.quantidade;
    }

    setQuantidade(quantidade){
        Produto.validarQuantidade(quantidade);
        this.quantidade = quantidade;
    }
    static validarQuantidade(quantidade){
        if(quantidade === null || quantidade === "" || quantidade === undefined)
            throw new ModelError("A quantidade não pode ser nula!");;
        if(quantidade < 0)
            throw new ModelError("A quantidade deve ser no mínimo 0!");
        const padraoQuantidade = /^[0-9]+$/;
        if (!padraoQuantidade.test(quantidade)) 
            throw new ModelError("Quantidade Inválida!");
    }
    getEstoqueMin(){
        return this.estoqueMin;
    }

    setEstoqueMin(estoqueMin){
        Produto.validarEstoqueMin(estoqueMin);
        this.estoqueMin = estoqueMin;
    }
    static validarEstoqueMin(estoqueMin){
        if(estoqueMin === null || estoqueMin === "" || estoqueMin === undefined)
            throw new ModelError("O Estoque Mínimo não pode ser nulo!");
        let estoqueMinInt = parseInt(estoqueMin);
        if(estoqueMinInt < 0)
            throw new ModelError("O Estoque Mínimo deve ser no mínimo 0!");
        const padraoEstoqueMin = /^[0-9]+$/;
        if (!padraoEstoqueMin.test(estoqueMin)) 
            throw new ModelError("Estoque Mínimo Inválido!");
    }
    getDataCadastro(){
        return this.dataCadastro;
    }

    setDataCadastro(dataCadastro){
        Produto.validarDataCadastro(dataCadastro);
        this.dataCadastro = dataCadastro;
    }
    static validarDataCadastro(dataCadastro){
        if(dataCadastro == null || dataCadastro == "" || dataCadastro == undefined)
            throw new ModelError("A data não pode ser nula!");
        const padraoData = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        if (!padraoData.test(dataCadastro)) 
            throw new ModelError("A data não foi digitado corretamente! Ex:(01/01/2001)");
    }
}