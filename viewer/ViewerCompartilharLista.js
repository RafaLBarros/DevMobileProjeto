//------------------------------------------------------------------------//

export default class ViewerCompartilharLista {

    #ctrl;
    
    constructor(ctrl) {
      this.#ctrl = ctrl;
      this.divCompartilharLista  = this.obterElemento('divCompartilharLista'); 

      this.inputConvidadoEmail = this.obterElemento('inputConvidadoEmail');

      this.selectLista = this.obterElemento('selectLista');

      this.btnCompartilhar = this.obterELemento('btnCompartilhar');

      this.btnCompartilhar.onclick = fnBtnCompartilhar;
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

function fnBtnCompartilhar() {
    // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
    // no botão para poder executar a instrução abaixo.
    this.viewer.getCtrl().iniciarCompartilhar();
    
}


