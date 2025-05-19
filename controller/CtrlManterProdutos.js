import Produto from "/model/Produto.js";
import DaoProduto from "/model/dao/DaoProduto.js";
import ViewerManterProduto from "/viewer/ViewerManterProduto.js";
import Status from "/model/Status.js";
import DaoLista from "/model/dao/DaoLista.js";

export default class CtrlManterProdutos {
    #dao;
    #viewer;
    #status;
    #daoLista;
    constructor(status){
        this.#daoLista = new DaoLista();
        this.#dao = new DaoProduto();
        this.#viewer = new ViewerManterProduto(this);
        this.#status = status;
        this.#atualizarContextoNavegacao();
    }

    async #atualizarContextoNavegacao(){
      console.log("Atualizando navegação com status:", this.#status);
        if(this.#status == Status.NAVEGANDO){
            console.log("Entrei no if navegando");
            let uid = localStorage.getItem("uid");
            let conjProdutos = await this.#dao.obterProdutos(uid);
            this.#viewer.statusApresentacao(conjProdutos);
        }else if(this.#status == Status.INCLUINDO){
            console.log("Entrei no if incluindo");
            this.#viewer.statusInclusao();
        }else if(this.#status == Status.EXCLUINDO){
            console.log("Entrei no if excluindo");
            let uid = localStorage.getItem("uid");
            let conjProdutos = await this.#dao.obterProdutos(uid);
            this.#viewer.statusExclusao(conjProdutos);
        }
    }


    async incluir(nome,quantidade,estoqueMin) {
      if(this.#status == Status.INCLUINDO) {
        try {
          let uid = localStorage.getItem("uid");
          let dataCadastro = new Date().toLocaleDateString('pt-BR');
          let produto = new Produto(nome, parseInt(quantidade,10),parseInt(estoqueMin,10),dataCadastro);
          await this.#dao.incluir(produto,uid); 
          this.#status = Status.NAVEGANDO;
          this.#atualizarContextoNavegacao();
        }
        catch(e) {
          alert(e);
        }
      }    
    }
    async removerProduto(produtoId){
      let uid = localStorage.getItem("uid");
      let listas = await this.#daoLista.obterListas(uid);
      for(let lista of listas){
        let itens = lista.getItens();
        for(let item of itens){
          if(item.produtoId === produtoId){
            return alert(`Não é possível remover. Produto presente na lista “${lista.getNome()}”.`)
            
          }
        }
      }
      let produto = await this.#dao.obterProdutoPeloProdutoId(produtoId,uid);
      console.log(produto);
      await this.#dao.excluir(produto,uid);
      alert("Produto removido com sucesso!");
      this.#status = Status.NAVEGANDO;
      this.#atualizarContextoNavegacao();
    }
    
    async obterQuantidadeAtual(produtoId){
      let uid = localStorage.getItem("uid");
      let produto = await this.#dao.obterProdutoPeloProdutoId(produtoId,uid);
      return produto.getQuantidade();
    }

    async iniciarRegistrarSaida(produtoId,quantidade){
      let uid = localStorage.getItem("uid");
      let produto = await this.#dao.obterProdutoPeloProdutoId(produtoId,uid);
      if(quantidade < 0){
        alert("Quantidade não pode ser negativa!")
        return;
      }
      let novoEstoque = produto.getQuantidade() - quantidade;
      if(novoEstoque < 0){
        alert("Quantidade Insuficiente em Estoque")
        return
      }
      let novoProduto = new Produto(produto.getNome(),novoEstoque,produto.getEstoqueMin(),produto.getDataCadastro());
      novoProduto.setProdutoId(produto.getProdutoId());
      await this.#dao.alterar(novoProduto,uid);
      this.#viewer.exibirQuantidadeDisponivel(novoProduto.getProdutoId());
    }

}