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
      let uid = localStorage.getItem("uid");
      let mapa = await this.mapearProdutosItens(listaId);
      let lista = await this.#dao.obterListaPeloListaId(listaId,uid);
      let listaStatus = lista.getStatus();
      this.#viewer.exibirDetalhesLista(mapa,listaId,listaStatus);
    }

    async mapearProdutosItens(listaId){
      let uid = localStorage.getItem("uid");
      let lista = await this.#dao.obterListaPeloListaId(listaId,uid)
      let itens = lista.getItens();
      let resultadoFinal = [];
      for(let [key, item] of Object.entries(itens)){
        let produto = await this.#daoProduto.obterProdutoPeloProdutoId(item.produtoId,uid);
        resultadoFinal.push({
          itemId: key,
          produtoId: item.produtoId,
          nome: produto.getNome(),
          status: item.concluido,
          quantidade: item.quantidade
        })
      }
      return resultadoFinal;
    }

    async atualizarCheckItem(itemKey,marcado,listaId){
      let uid = localStorage.getItem("uid");
      await this.#dao.alterarCheckItem(uid,itemKey,marcado,listaId)

    }
    async iniciarAdicionarProduto(){
      let conjProdutos = await this.obterProdutosUsuario();
      this.#viewer.atualizarAdicionarProduto(conjProdutos);
    }

    async iniciarAdicionarItemCon(listaId,produtoId,quantidade){
      let uid = localStorage.getItem("uid");
      let lista = await this.#dao.obterListaPeloListaId(listaId,uid);
      console.log(lista);
        // Garante que lista.itens existe
      if (!lista.getItens()){
        alert("Erro ao acessar a Lista, Lista Vazia");
        return;
      }

      // Encontra a próxima chave numérica disponível
      let itens = lista.getItens()
      let indices = Object.keys(itens).map(Number);
      let proximoIndice = indices.length > 0 ? Math.max(...indices) + 1 : 0;

      // Cria o novo item
      let novoItem = {
        produtoId: produtoId,
        quantidade: quantidade,
        concluido: false
      };

      // Adiciona ao objeto
      itens[proximoIndice] = novoItem;
      lista.setItens(itens);
      await this.#dao.alterar(lista,uid);
      this.iniciarDetalhesLista(lista.getListaId());
    }

    async iniciarFinalizarLista(listaId){
      let uid = localStorage.getItem("uid");
      let lista = await this.#dao.obterListaPeloListaId(listaId,uid)
      if (!lista.getItens()){
        alert("Lista Vazia");
        return
      }
      let itens = lista.getItens();
      let somaPorProduto = {};
      for(let [key, item] of Object.entries(itens)){
        if(item.concluido){
          somaPorProduto[item.produtoId] = (somaPorProduto[item.produtoId] || 0) + item.quantidade;
        }
      }
      if(Object.keys(somaPorProduto).length === 0) {
        alert("Marque ao menos um item para finalizar!");
        return;
      }
      for (const [produtoId, somaQtd] of Object.entries(somaPorProduto)) {
        let produto = await this.#daoProduto.obterProdutoPeloProdutoId(produtoId,uid);
        let atual = produto.getQuantidade() || 0;
        let novaQuantidade = parseInt(atual,10) + parseInt(somaQtd,10);
        let novoProduto = new Produto(produto.getNome(),novaQuantidade,produto.getEstoqueMin(),produto.getDataCadastro());
        novoProduto.setProdutoId(produto.getProdutoId());
        await this.#daoProduto.alterar(novoProduto,uid);
      };
      let novaLista = new Lista(lista.getNome(),lista.getData(),lista.getItens(),"finalizada")
      novaLista.setListaId(lista.getListaId());
      await this.#dao.alterar(novaLista,uid);
      alert("Compra Finalizada e Estoque Atualizado!");
      this.#viewer.finalizarApresentacao();
    }

    async iniciarRemoverLista(listaId){
      let uid = localStorage.getItem("uid");
      let lista = await this.#dao.obterListaPeloListaId(listaId,uid);
      this.#dao.excluir(lista,uid);
      let conjListas = await this.#dao.obterListas(uid);
      this.#viewer.statusApresentacao(conjListas);
    }
  }