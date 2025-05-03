//------------------------------------------------------------------------//

export default class ViewerManterProduto {

    #ctrl;
    
    constructor(ctrl) {
      this.#ctrl = ctrl;
      
      this.divCadastrarProduto = obterElemento('divCadastrarProduto');
      this.divEstoqueProduto = obterElemento('divEstoqueProduto');

      this.formProduto = obterElemento('formProduto');

      this.inputNomeProduto = obterElemento('inputNomeProduto');
      this.inputEstoqueProduto = obterElemento('inputEstoqueProduto');
      this.inputMinimoProduto = obterElemento('inputMinimoProduto');
      this.inputPesquisarProduto = obterElemento('inputPesquisarProduto');

      this.btnCadastrarProduto = obterElemento('btnCadastrarProduto');
      this.btnFiltrarProduto = obterElemento('btnFiltrarProduto');

      this.btnCadastrarProduto.onclick = fnBtnCadastrarProduto;
      this.btnFiltrarProduto.onclick = fnBtnFiltrarProduto;
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

function fnBtnCadastrarProduto() {
    // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
    // no botão para poder executar a instrução abaixo.
    this.viewer.getCtrl().iniciarCadastrarProduto();
    
}

function fnBtnFiltrarProduto() {
    // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
    // no botão para poder executar a instrução abaixo.
    this.viewer.getCtrl().iniciarFiltrarProduto();
    
}

