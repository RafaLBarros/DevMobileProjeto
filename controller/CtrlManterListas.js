import Lista from "/model/Lista.js";
import DaoLista from "/model/dao/DaoLista.js";
import DaoProduto from "/model/dao/DaoProduto.js";
import Produto from "/model/Produto.js";
import ViewerManterLista from "/viewer/ViewerManterLista.js";
import Status from "/model/Status.js";

export default class CtrlManterLista {
    #dao;
    #viewer;
    #status;
    #daoProduto;
    constructor(status){
        this.#dao = new DaoLista();
        this.#daoProduto = new DaoProduto();
        this.#viewer = new ViewerManterLista(this);
        this.#status = status;
        this.#atualizarContextoNavegacao();
    }

    async #atualizarContextoNavegacao(){
        if(this.#status == Status.NAVEGANDO){
            let uid = localStorage.getItem("uid");
            let conjListas = await this.#dao.obterListas(uid);
            this.#viewer.statusApresentacao(conjListas);
        }else if(this.#status == Status.INCLUINDO){
            this.#viewer.statusInclusao();
        }
    }


    async incluir(nome,conjItens) {
        if(this.#status == Status.INCLUINDO) {
          try {
            let data = new Date().toLocaleDateString('pt-BR');
            let status = "em andamento";
            let dataAtual = new Date();
            let dataFormatada = dataAtual.toLocaleDateString("pt-BR");
            let nomeComData = `${nome} - ${dataFormatada}`;
            let lista = new Lista(nomeComData,data,conjItens,status);
            let uid = localStorage.getItem("uid");
            await this.#dao.incluir(lista,uid); 
            this.#status = Status.NAVEGANDO;
            this.#atualizarContextoNavegacao();
          }
          catch(e) {
            alert(e);
          }
        }    
    }
    async obterProdutosUsuario(){
      let uid = localStorage.getItem("uid");
      let conjProdutos = await this.#daoProduto.obterProdutos(uid);
      return conjProdutos;
    }

    async iniciarDetalhesLista(listaId){
      let mapa = await this.mapearProdutosItens(listaId);
      this.#viewer.exibirDetalhesLista(mapa);
    }

    async mapearProdutosItens(listaId){
      let uid = localStorage.getItem("uid");
      let lista = await this.#dao.obterListaPeloListaId(listaId,uid)
      let itens = lista.getItens();
      let resultadoFinal = [];
      for(let item of itens){
        let produto = await this.#daoProduto.obterProdutoPeloProdutoId(item.produtoId,uid);
        resultadoFinal.push({
          produtoId: item.produtoId,
          nome: produto.getNome(),
          status: item.concluido,
          quantidade: item.quantidade
        })
      }
      return resultadoFinal;
    }


}