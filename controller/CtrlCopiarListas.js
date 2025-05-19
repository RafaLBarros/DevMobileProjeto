import Lista from "/model/Lista.js";
import DaoLista from "/model/dao/DaoLista.js";
import ViewerCopiarLista from "/viewer/ViewerCopiarLista.js"

export default class CtrlCopiarListas {
    #dao;
    #viewer;

    constructor(){
        this.#dao = new DaoLista();
        this.#viewer = new ViewerCopiarLista(this);
        this.#atualizarContextoNavegacao();
    }

    async #atualizarContextoNavegacao(){
        let uid = localStorage.getItem("uid");
        let conjListas = await this.#dao.obterListas(uid);
        this.#viewer.statusCopiar(conjListas);

    }

    async copiarLista(listaId){
        let uid = localStorage.getItem("uid");
        let lista = await this.#dao.obterListaPeloListaId(listaId,uid);
        let partes = lista.getNome().split(" - ");
        let originalDate = partes.length > 1 ? partes[partes.length - 1] : null;
        let baseName = partes.length > 1 ? partes.slice(0, -1).join(" - ") : lista.getNome();

        let dataAtual = new Date();
        let dataFormatada = dataAtual.toLocaleDateString("pt-BR");

        if(originalDate === dataFormatada) {
            alert("Não é possivel copiar uma lista no mesmo dia!");
            return;
        }

        let novoNome = `${baseName} - ${dataFormatada}`;
        let itens = lista.getItens();
        for (let [key, item] of Object.entries(itens)) {
            if (item.concluido === true) {
                item.concluido = false;
            }
        }
        let novaLista = new Lista(novoNome,dataFormatada,itens,"em andamento")
        novaLista.setListaId(lista.getListaId());
        await this.#dao.incluir(novaLista,uid);
        alert("Lista copiada com sucesso!")
        let conjListas = await this.#dao.obterListas(uid);
        this.#viewer.statusCopiar(conjListas);
    }
}