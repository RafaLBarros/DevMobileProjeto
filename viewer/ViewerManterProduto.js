import ViewerError from "/viewer/ViewerError.js";
import Produto from "/model/Produto.js";
//------------------------------------------------------------------------//

export default class ViewerManterProduto {

    #ctrl;
    
    
    constructor(ctrl) {

      this.#ctrl = ctrl;

      this.divCadastrarProduto = this.obterElemento('divCadastrarProduto');
      this.divEstoqueProduto = this.obterElemento('divEstoqueProduto');
      this.divSaidaProduto = this.obterElemento('divSaidaProduto');
      this.formProduto = this.obterElemento('formProduto');

      this.inputNomeProduto = this.obterElemento('inputNomeProduto');
      this.inputEstoqueProduto = this.obterElemento('inputEstoqueProduto');
      this.inputMinimoProduto = this.obterElemento('inputMinimoProduto');
      this.inputPesquisarProduto = this.obterElemento('inputPesquisarProduto');
      this.inputQuantidadeSaida = this.obterElemento('inputQuantidadeSaida');

      this.btnCadastrarProduto = this.obterElemento('btnCadastrarProduto');
      this.btnFiltrarProduto = this.obterElemento('btnFiltrarProduto');
      this.btnRegistrarSaida = this.obterElemento('btnRegistrarSaida');

      this.tabelaEstoqueProduto = this.obterElemento('tabelaEstoqueProduto');

      this.selectSaidaProduto = this.obterElemento('selectSaidaProduto');

      this.spanQuantidadeDisponivel = this.obterElemento('spanQuantidadeDisponivel');

      this.btnCadastrarProduto.onclick = fnBtnCadastrarProduto;
      this.btnFiltrarProduto.onclick = fnBtnFiltrarProduto;
      this.btnRegistrarSaida.onclick = fnBtnRegistrarSaida;

      this.selectSaidaProduto.onchange = fnSelectSaidaProduto;

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
    this.ocultarTodasAsDivs();
    location.href = '/paginas/manterProduto.html#estoque';
    this.divEstoqueProduto.style.display = 'block';
    this.divCadastrarProduto.style.display = 'none';
    this.divSaidaProduto.style.display = 'none';
    this.tabelaEstoqueProduto.innerHTML = '';
    for(let produto of conjProdutos){
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
    location.href = '/paginas/manterProduto.html#cadastro';
    this.divEstoqueProduto.style.display = 'none';
    this.divCadastrarProduto.style.display = 'block';
    this.divSaidaProduto.style.display = 'none';

  }

  statusExclusao(conjProdutos){
    this.ocultarTodasAsDivs();
    location.href = '/paginas/manterProduto.html#saida';
    this.divEstoqueProduto.style.display = 'none';
    this.divCadastrarProduto.style.display = 'none';
    this.divSaidaProduto.style.display = 'block';

    for(let produto of conjProdutos){
      let option = document.createElement("option");
      option.value = produto.getProdutoId();
      option.textContent = produto.getNome();
      this.selectSaidaProduto.appendChild(option);
    }

    if (this.selectSaidaProduto.value) {
      this.exibirQuantidadeDisponivel(this.selectSaidaProduto.value);
    }
  }

  async exibirQuantidadeDisponivel(produtoId){
    this.spanQuantidadeDisponivel.textContent = `Disponível: `;
    let quantidade = await this.#ctrl.obterQuantidadeAtual(produtoId);
    if(quantidade){
      this.spanQuantidadeDisponivel.textContent = `Disponível: ${quantidade}`;
    }else{
      this.spanQuantidadeDisponivel.textContent = `Disponível: 0`;
    }
    
  }

  ocultarTodasAsDivs() {
  this.divCadastrarProduto.style.display = 'none';
  this.divEstoqueProduto.style.display = 'none';
  this.divSaidaProduto.style.display = 'none';
  }




}
//------------------------------------------------------------------------//

function fnBtnCadastrarProduto() {
    event.preventDefault();
    const nome = this.viewer.inputNomeProduto.value;
    const quantidade = this.viewer.inputEstoqueProduto.value;
    const estoqueMinimo = this.viewer.inputMinimoProduto.value;
    this.viewer.getCtrl().incluir(nome,quantidade,estoqueMinimo); 
    
}

function fnBtnFiltrarProduto() {
    event.preventDefault();
    // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
    // no botão para poder executar a instrução abaixo.
    this.viewer.getCtrl().iniciarFiltrarProduto();
    
}

function fnSelectSaidaProduto() {
  let produtoId = this.viewer.selectSaidaProduto.value;
  this.viewer.exibirQuantidadeDisponivel(produtoId);
}

function fnBtnRegistrarSaida() {
  event.preventDefault();
  let produtoId = this.viewer.selectSaidaProduto.value;
  let quantidade = parseInt(this.viewer.inputQuantidadeSaida.value);
  this.viewer.getCtrl().iniciarRegistrarSaida(produtoId,quantidade);
}

