//------------------------------------------------------------------------//

export default class ViewerCopiarLista {

    #ctrl;
    
    constructor(ctrl) {
      this.#ctrl = ctrl;
      
      this.divCopiarLista = obterElemento('divCopiarLista');
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