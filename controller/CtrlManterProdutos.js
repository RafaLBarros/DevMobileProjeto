import Produto from "/model/Produto.js";
import DaoProduto from "/model/dao/DaoProduto.js";
import ViewerManterProduto from "/viewer/ViewerManterProduto.js";
import Status from "/model/Status.js";

export default class CtrlManterProdutos {
    #dao;
    #viewer;
    #status;
    constructor(status){
        this.#dao = new DaoProduto();
        this.#viewer = new ViewerManterProduto(this);
        this.#status = status;
        this.#atualizarContextoNavegacao();
    }

    async #atualizarContextoNavegacao(){
        if(this.#status == Status.NAVEGANDO){
            let conjProdutos = await this.#dao.obterProdutos();
            this.#viewer.statusApresentacao(conjProdutos);
        }else if(this.#status == Status.INCLUINDO){
            this.#viewer.statusInclusao();
        }
    }


    async incluir(nome,quantidade,estoqueMin,dataCadastro) {
        if(this.#status == Status.INCLUINDO) {
          try {
            let produto = new Produto(nome, quantidade,estoqueMin,dataCadastro);
            await this.#dao.incluir(produto); 
            this.#status = Status.NAVEGANDO;
            this.#atualizarContextoNavegacao();
          }
          catch(e) {
            alert(e);
          }
        }    
      }

}