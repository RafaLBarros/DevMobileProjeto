//------------------------------------------------------------------------//

export default class ViewerManterLista {

    #ctrl;
    
    constructor(ctrl) {
      this.#ctrl = ctrl;
      
      this.divCadastrarLista = obterElemento('divCadastrarLista');
      this.divConsultarLista = obterElemento('divConsultarLista');
      this.divDetalhesLista = obterElemento('detalhesLista');
      this.divProdutoForm = obterElemento('novoProdutoForm');

      this.inputNomeLista = obterElemento('inputNomeLista');
      this.inputQuantidade = obterElemento('inputQuantidade');
      
      this.btnAdicionarItemCad = obterElemento('btnAdicionarItemCad');
      this.btnCadastrarLista = obterElemento('btnCadastrarLista');
      this.btnAdicionarProduto = obterElemento('btnAdicionarProduto');
      this.btnSalvarLista = obterElemento('btnSalvarLista');
      this.btnAdicionarItemCon = obterElemento('btnAdicionarItemCon');
      this.btnCancelarItem = obterElemento('btnCancelarItem');

      this.selectConsultarLista = obterElemento('selectConsultarLista');
      this.selectProduto = obterElemento('selecionarProduto');

      this.btnAdicionarItemCad.onclick = fnBtnAdicionarItemCad;
      this.btnCadastrarLista.onclick = fnBtnCadastrarLista;
      this.btnAdicionarProduto.onclick = fnBtnAdicionarProduto;
      this.btnSalvarLista.onclick = fnBtnSalvarLista;
      this.btnAdicionarItemCon.onclick = fnBtnAdicionarItemCon;
      this.btnCancelarItem.onclick = fnBtnCancelarItem; 
    }
  
  //------------------------------------------------------------------------//

  obterElemento(idElemento) {
    let elemento = document.getElementById(idElemento);
    if(elemento == null) 
      throw new ViewerError("Não encontrei um elemento com id '" + idElemento + "'");
    // Adicionando o atributo 'viewer' no elemento do Viewer. Isso permitirá
    // que o elemento guarde a referência para o objeto Viewer que o contém.
    elemento.viewer = this;
    return elemento;
  }

  //------------------------------------------------------------------------//

  getCtrl() { 
    return this.#ctrl;
  }

}
//------------------------------------------------------------------------//

function fnBtnAdicionarItemCad() {
    // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
    // no botão para poder executar a instrução abaixo.
    this.viewer.getCtrl().iniciarAdicionarItemCad();
    
}

function fnBtnCadastrarLista() {
    // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
    // no botão para poder executar a instrução abaixo.
    this.viewer.getCtrl().iniciarCadastrarLista();
    
}

function fnBtnAdicionarProduto() {
    // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
    // no botão para poder executar a instrução abaixo.
    this.viewer.getCtrl().iniciarAdicionarProduto();
    
}

function fnBtnSalvarLista() {
    // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
    // no botão para poder executar a instrução abaixo.
    this.viewer.getCtrl().iniciarSalvarLista();
    
}

function fnBtnAdicionarItemCon() {
    // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
    // no botão para poder executar a instrução abaixo.
    this.viewer.getCtrl().iniciarAdicionarItemCon();
    
}

function fnBtnCancelarItem() {
    // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
    // no botão para poder executar a instrução abaixo.
    this.viewer.getCtrl().iniciarCancelarItem();
    
}