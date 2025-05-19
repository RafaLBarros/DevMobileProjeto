import ViewerError from "/viewer/ViewerError.js";
//------------------------------------------------------------------------//

export default class ViewerCompartilharLista {

    #ctrl;
    
    constructor(ctrl) {
      this.#ctrl = ctrl;
      this.divCompartilharLista  = this.obterElemento('divCompartilharLista'); 
      this.divListasConvidado = this.obterElemento('divListasConvidado');
      this.divDetalhes = this.obterElemento('detalhesLista');

      this.inputConvidadoEmail = this.obterElemento('inputConvidadoEmail');

      this.selectLista = this.obterElemento('selectLista');
      this.selectListaConvidado = this.obterElemento('selectListasConvidado')

      this.btnCompartilhar = this.obterElemento('btnCompartilhar');
      this.btnListaConvidados = this.obterElemento('btnListaConvidados')

      this.btnCompartilhar.onclick = fnBtnCompartilhar;
      this.btnListaConvidados.onclick = fnBtnListaConvidados;
      
      this.selectListaConvidado.onchange = fnSelectListaConvidado;
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

  statusCompartilhar(conjListas){
    location.href = '/paginas/compartilharLista.html#compartilhar';
    this.divListasConvidado.style.display = 'none';
    this.divCompartilharLista.style.display = 'block';
    this.selectLista.innerHTML = "<option value=''>Selecione uma lista</option>";
    for(let lista of conjListas){
      let opt = document.createElement("option");
      opt.value       = lista.getListaId();
      opt.textContent = lista.getNome();
      this.selectLista.appendChild(opt);
    }

    this.getCtrl().atualizarEmail();

  }

  finalizarCompartilhar(){
    alert("Lista Compartilhada com Sucesso!")
    this.selectLista.value = "";
    this.inputConvidadoEmail.value = "";
  }
  
  carregarListasCompartilhadas(listas){
    location.href = '/paginas/compartilharLista.html#convidado';
    this.divCompartilharLista.style.display = 'none';
    this.divListasConvidado.style.display = 'block';
    this.selectListaConvidado.innerHTML = `<option value="">Selecione uma lista</option>`;
    console.log(listas);
    for (const [chave, nome] of Object.entries(listas)) {
      const opt = document.createElement("option");
      opt.value = chave;
      opt.textContent = nome;
      this.selectListaConvidado.appendChild(opt);
    }
  }
  exibirDetalhesListaConvidado(mapa,listaNome){

    let html = `
    <h2>${listaNome}</h2>
    <table>
      <thead>
        <tr><th>Produto</th><th>Quantidade</th><th>Concluído</th></tr>
      </thead>
      <tbody>`;
    for(let item of mapa){
      html += `
        <tr>
          <td>${item.nome}</td>
          <td>${item.quantidade}</td>
          <td>${item.status ? '✔️' : '—'}</td>
        </tr>`;
    }
    html += `
      </tbody>
    </table>`; 

    this.divDetalhes.innerHTML = html;

  }

}
//------------------------------------------------------------------------//

function fnBtnCompartilhar() {
    let rawEmail = this.viewer.inputConvidadoEmail.value.trim().toLowerCase();
    let listaId = this.viewer.selectLista.value;
    if (!rawEmail || !listaId) {
      alert("Preencha o e-mail e selecione uma lista.");
      return;
    }

    this.viewer.getCtrl().iniciarCompartilhar(rawEmail,listaId);
    
}

function fnBtnListaConvidados(){
  
  this.viewer.getCtrl().iniciarCarregar();
}

function fnSelectListaConvidado(){
  this.viewer.divDetalhes.innerHTML = "";
  const [donoId, listaId] = this.viewer.selectListaConvidado.value.split('/');
  this.viewer.getCtrl().iniciarExibirDetalhesListaConvidado(listaId,donoId)
}


