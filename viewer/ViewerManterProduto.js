import ViewerError from "/viewer/ViewerError.js";
//------------------------------------------------------------------------//

export default class ViewerManterProduto {

    #ctrl;
    
    
    constructor(ctrl) {

      this.#ctrl = ctrl;

      this.divCadastrarProduto = this.obterElemento('divCadastrarProduto');
      this.divEstoqueProduto = this.obterElemento('divEstoqueProduto');

      this.formProduto = this.obterElemento('formProduto');

      this.inputNomeProduto = this.obterElemento('inputNomeProduto');
      this.inputEstoqueProduto = this.obterElemento('inputEstoqueProduto');
      this.inputMinimoProduto = this.obterElemento('inputMinimoProduto');
      this.inputPesquisarProduto = this.obterElemento('inputPesquisarProduto');

      this.btnCadastrarProduto = this.obterElemento('btnCadastrarProduto');
      this.btnFiltrarProduto = this.obterElemento('btnFiltrarProduto');

      this.tabelaEstoqueProduto = this.obterElemento('tabelaEstoqueProduto');

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

  statusApresentacao(conjProdutos) {
    this.divEstoqueProduto.style.display = 'block';
    this.divCadastrarProduto.style.display = 'none';
    this.tabelaEstoqueProduto.innerHTML = '';
    for(const produto in conjProdutos){
      const row = `
      <tr>
          <td>${produto.getNome()}</td>
          <td>${produto.getQuantidade()}</td>
      </tr>
      `;
      this.tabelaEstoqueProduto.innerHTML += row;
    }
  }
  statusInclusao() {
    this.divEstoqueProduto.style.display = 'none';
    this.divCadastrarProduto.style.display = 'block';

  }



}
//------------------------------------------------------------------------//

function fnBtnCadastrarProduto() {
    const nome = this.viewer.inputNomeProduto.value;
    const quantidade = this.viewer.inputNomeProduto.value;
    const estoqueMinimo = this.viewer.inputNomeProduto.value;
    const dataCadastro = new Date().toISOString();
    this.viewer.getCtrl().incluir(nome,quantidade,estoqueMinimo,dataCadastro); 
    
}

function fnBtnFiltrarProduto() {
    // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
    // no botão para poder executar a instrução abaixo.
    this.viewer.getCtrl().iniciarFiltrarProduto();
    
}

