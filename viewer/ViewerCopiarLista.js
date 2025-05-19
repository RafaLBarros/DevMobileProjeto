import ViewerError from "/viewer/ViewerError.js";
//------------------------------------------------------------------------//

export default class ViewerCopiarLista {

    #ctrl;
    
    constructor(ctrl) {
      this.#ctrl = ctrl;
      
      this.divCopiarLista = this.obterElemento('divCopiarLista');
      this.selectCopiarListas = this.obterElemento('selectCopiarListas');

      this.btnCopiarLista = this.obterElemento('btnCopiarLista');

      this.btnCopiarLista.onclick = fnBtnCopiarLista;

      this.selectCopiarListas.onchange = fnSelectCopiarListas;
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

  statusCopiar(conjListas){
    this.selectCopiarListas.innerHTML = `<option value="">-- Escolha uma lista --</option>`;
    for(let lista of conjListas){
      let opt = document.createElement("option");
      opt.value = lista.getListaId();
      opt.textContent = lista.getNome();
      this.selectCopiarListas.appendChild(opt);
    }

  }

}
//------------------------------------------------------------------------//

function fnBtnCopiarLista(){
  let listaId = this.viewer.selectCopiarListas.value
  if(!listaId){
    alert("Selecione uma Lista para copiar!");
    return;
  }

  this.viewer.getCtrl().copiarLista(listaId);

}

function fnSelectCopiarListas(){
  this.viewer.btnCopiarLista.style.display = this.viewer.selectCopiarListas.value ? "inline-block" : "none";
}