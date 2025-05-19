import Lista from "/model/Lista.js";
import DaoLista from "/model/dao/DaoLista.js";
import ViewerCompartilharLista from "/viewer/ViewerCompartilharLista.js"
import DaoUsuario from "/model/dao/DaoUsuario.js";
import DaoProduto from "/model/dao/DaoProduto.js";

export default class CtrlCompartilharListas {
    #dao;
    #viewer;
    #daoUsuario;
    #daoProduto;
    #status;
    constructor(status){
        this.#dao = new DaoLista();
        this.#daoUsuario = new DaoUsuario();
        this.#viewer = new ViewerCompartilharLista(this);
        this.#daoProduto = new DaoProduto();
        this.#status = status;
        console.log(status);
        this.#atualizarContextoNavegacao();
    }

    async #atualizarContextoNavegacao(){
        if(this.#status == "compartilhando"){
            let uid = localStorage.getItem("uid");
            let conjListas = await this.#dao.obterListas(uid);
            this.#viewer.statusCompartilhar(conjListas);
        }
    }

    async atualizarEmail(){
        let uid = localStorage.getItem("uid");
        let usuario = await this.#daoUsuario.obterUsuarioPeloUID(uid);
        let emailKey = usuario.getEmail().trim().toLowerCase().replace(/\./g, ",");
        this.#daoUsuario.emailToUid(uid,emailKey);
    }

    async iniciarCompartilhar(rawEmail,listaId){
        let uid = localStorage.getItem("uid");
        let guestKey = rawEmail.replace(/\./g, ",");
        let convidadoId = await this.#daoUsuario.obterConvidado(guestKey);
        if(!convidadoId){
            alert("Usuário com esse e-mail não foi encontrado!");
            return;
        }

        await this.#daoUsuario.compartilharDono(uid,convidadoId,listaId);
        await this.#daoUsuario.compartilharConvidado(uid,convidadoId,listaId);
        this.#viewer.finalizarCompartilhar();

    }
    async iniciarCarregar(){
        let uid = localStorage.getItem("uid");
        let listas = await this.#daoUsuario.obterListasCompartilhadas(uid);
        this.#viewer.carregarListasCompartilhadas(listas);
    }
    async iniciarExibirDetalhesListaConvidado(listaId,donoId){
        let lista = await this.#dao.obterListaPeloListaId(listaId,donoId);
        let mapa = await this.mapearProdutosItens(listaId,donoId);
        let listaNome = lista.getNome();
        this.#viewer.exibirDetalhesListaConvidado(mapa,listaNome);
    }
    async mapearProdutosItens(listaId,donoId){
      let lista = await this.#dao.obterListaPeloListaId(listaId,donoId)
      let itens = lista.getItens();
      let resultadoFinal = [];
      for(let [key, item] of Object.entries(itens)){
        let produto = await this.#daoProduto.obterProdutoPeloProdutoId(item.produtoId,donoId);
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
}