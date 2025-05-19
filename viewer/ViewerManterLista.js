import ViewerError from "/viewer/ViewerError.js";
//------------------------------------------------------------------------//

export default class ViewerManterLista {

    #ctrl;
    
    constructor(ctrl) {
      this.#ctrl = ctrl;
      
      this.divCadastrarLista = this.obterElemento('divCadastrarLista');
      this.divConsultarLista = this.obterElemento('divConsultarLista');
      this.divDetalhesLista = this.obterElemento('detalhesLista');
      this.divProdutoForm = this.obterElemento('novoProdutoForm');

      this.inputNomeLista = this.obterElemento('inputNomeLista');
      this.inputQuantidade = this.obterElemento('inputQuantidade');
      
      this.btnAdicionarItemCad = this.obterElemento('btnAdicionarItemCad');
      this.btnCadastrarLista = this.obterElemento('btnCadastrarLista');
      this.btnAdicionarProduto = this.obterElemento('btnAdicionarProduto');
      this.btnFinalizarLista = this.obterElemento('btnFinalizarLista');
      this.btnAdicionarItemCon = this.obterElemento('btnAdicionarItemCon');
      this.btnCancelarItem = this.obterElemento('btnCancelarItem');
      this.btnRemoverLista = this.obterElemento('btnRemoverLista');

      this.selectConsultarLista = this.obterElemento('selectConsultarLista');
      this.selectProduto = this.obterElemento('selecionarProduto');

      this.tableItemLista = this.obterElemento('tableItemLista');

      this.tbodyItemLista = this.obterElemento('tbodyItemLista');

      this.btnAdicionarItemCad.onclick = fnBtnAdicionarItemCad;
      this.btnCadastrarLista.onclick = fnBtnCadastrarLista;
      this.btnAdicionarProduto.onclick = fnBtnAdicionarProduto;
      this.btnFinalizarLista.onclick = fnBtnFinalizarLista;
      this.btnAdicionarItemCon.onclick = fnBtnAdicionarItemCon;
      this.btnCancelarItem.onclick = fnBtnCancelarItem; 
      this.btnRemoverLista.onclick = fnBtnRemoverLista;

      this.selectConsultarLista.onchange = fnSelectConsultarLista;
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

  obterElementoPelaClasse(classeElemento) {
    let elemento = document.querySelector(classeElemento);
    if(elemento == null) 
      throw new ViewerError("Não encontrei um elemento com classe '" + classeElemento + "'");
    // Adicionando o atributo 'viewer' no elemento do Viewer. Isso permitirá
    // que o elemento guarde a referência para o objeto Viewer que o contém.
    elemento.viewer = this;
    return elemento;
  }

  obterElementos(classeElemento) {
    let elemento = document.querySelectorAll(classeElemento);
    if(elemento == null) 
      throw new ViewerError("Não encontrei elementos com classe '" + classeElemento + "'");
    // Adicionando o atributo 'viewer' no elemento do Viewer. Isso permitirá
    // que o elemento guarde a referência para o objeto Viewer que o contém.
    elemento.viewer = this;
    return elemento;
  }

  //------------------------------------------------------------------------//

  getCtrl() { 
    return this.#ctrl;
  }

  statusApresentacao(conjListas) {
    location.href = 'manterLista.html#init';
    this.divConsultarLista.style.display = 'block';
    this.divCadastrarLista.style.display = 'none';
    this.selectConsultarLista.innerHTML = `<option value="">Selecione uma lista</option>`;
    this.divDetalhesLista.style.display = 'none';
    for(let lista of conjListas){
      const opt = document.createElement("option");
      opt.value = lista.getListaId()
      opt.textContent = lista.getNome();
      this.selectConsultarLista.appendChild(opt);
    }
  }  
  statusInclusao() {
    location.href = 'manterLista.html#cadastro';
    this.divConsultarLista.style.display = 'none';
    this.divCadastrarLista.style.display = 'block';

  }
  exibirDetalhesLista(mapa,listaId,listaStatus){
    let div = this.divDetalhesLista;
    div.style.display = 'inline-block';
    div.innerHTML = "";
    let finalizada = listaStatus === "finalizada";
    let html = `
      <table class="lista-table">
        <thead>
          <tr><th>Produto</th><th>Quantidade</th><th>Concluído</th></tr>
        </thead>
        <tbody>
    `;

    for (let item of mapa){
      let nomeProd = item.nome;
      html += `
        <tr>
          <td>${nomeProd}</td>
          <td>${item.quantidade}</td>
          <td>
            <input
              type="checkbox"
              class="concluido-checkbox"
              data-item-key="${item.itemId}"
              ${item.status ? "checked" : ""}
              ${finalizada ? "disabled" : ""}>
          </td>
        </tr>
      `;
    };
    html += `
        </tbody>
      </table>
    `;
    div.innerHTML = html;

    if (finalizada) {
      this.btnRemoverLista.style.display = "none";
      this.btnAdicionarProduto.style.display = "none";
      this.btnFinalizarLista.style.display = "none";
      this.divProdutoForm.style.display = "none";
    } else {
      this.btnRemoverLista.style.display = "inline-block";
      this.btnAdicionarProduto.style.display = "inline-block";
      this.btnFinalizarLista.style.display = "inline-block";
      this.divDetalhesLista.querySelectorAll(".concluido-checkbox").forEach(cb => {
        cb.addEventListener("change", async e => {
          let marcado = e.target.checked;
          let itemKey = e.target.dataset.itemKey;
          this.getCtrl().atualizarCheckItem(itemKey,marcado,listaId)
        });
      });
    }
    
  }

  atualizarAdicionarProduto(conjProdutos){
    this.selectProduto.innerHTML = `<option value="">Selecione um produto</option>`;
    for(let produto of conjProdutos){
      let o = document.createElement("option");
      o.value = produto.getProdutoId();
      o.textContent = produto.getNome();
      this.selectProduto.appendChild(o);
    }
    this.divProdutoForm.style.display = "block";
  }

  finalizarApresentacao(){
    this.divDetalhesLista.innerHTML = "<p>Compra finalizada.</p>";
    this.btnAdicionarItemCon.style.display = this.btnFinalizarLista.style.display = "none";
    this.btnRemoverLista.style.display = "none";
    esconderForm();
  }

  atualizarListaRemovida(){
    alert("Lista Remova!")
    this.divDetalhesLista.innerHTML = "";
    this.btnAdicionarProduto.style.display = "none";
    this.btnFinalizarLista.style.display = "none";
    this.btnRemoverLista.style.display = "none";
  }

}
//------------------------------------------------------------------------//

// Função para popular o select com os produtos do usuário
async function popularSelectProdutos(produtosUsuario) {
    let selectProduto = document.createElement("select");
    selectProduto.classList.add("select-produto");

    let optionDefault = document.createElement("option");
    optionDefault.value = "";
    optionDefault.textContent = "Selecionar Produto";
    selectProduto.appendChild(optionDefault);

    for (let key in produtosUsuario) {
        let produto = produtosUsuario[key];
        let option = document.createElement("option");
        option.value = await produto.getProdutoId();
        option.textContent = produto.getNome();
        selectProduto.appendChild(option);
    }
    return selectProduto;
}

async function fnBtnAdicionarItemCad() {
    // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
    // no botão para poder executar a instrução abaixo.
    let lastRow = this.viewer.tbodyItemLista.lastElementChild;
    if (lastRow) {
        let lastSelect = lastRow.querySelector(".select-produto");
        if (!lastSelect || !lastSelect.value) {
            alert("Por favor, selecione um produto para o item anterior antes de adicionar outro.");
            return;
        }
    }
    let newRow = document.createElement("tr");

    let tdProduto = document.createElement("td");
    tdProduto.classList.add("item-column");
    let  produtos = await this.viewer.getCtrl().obterProdutosUsuario();
    let selectProduto = await popularSelectProdutos(produtos);
    tdProduto.appendChild(selectProduto);

    let tdQuantidade = document.createElement("td");
    tdQuantidade.classList.add("quantidade-column");
    let inputQuantidade = document.createElement("input");
    inputQuantidade.type = "number";
    inputQuantidade.value = 1;
    inputQuantidade.min = 1;
    tdQuantidade.appendChild(inputQuantidade);
    
    let tdAcoes = document.createElement("td");
    let btnRemover = document.createElement("button");
    btnRemover.classList.add("btn-remover");

    let imgRemover = document.createElement("img");
    imgRemover.src = "/Imagens/lixo.png";
    imgRemover.alt = "Remover";
    imgRemover.style.width = "20px";
    imgRemover.style.height = "20px";

    btnRemover.appendChild(imgRemover);

    function remover(){
      newRow.remove();
    }
    btnRemover.onclick = remover;

    tdAcoes.appendChild(btnRemover);
    newRow.appendChild(tdProduto);
    newRow.appendChild(tdQuantidade);
    newRow.appendChild(tdAcoes);
    this.viewer.tbodyItemLista.appendChild(newRow);
}

function fnBtnCadastrarLista() {
    event.preventDefault();
    let nome = this.viewer.inputNomeLista.value;
        if (!nome) {
        alert("Por favor, insira um nome para a lista.");
        return;
    }
    let tabelaRows = this.viewer.obterElementos(".lista-table tbody tr");
    if (tabelaRows.length === 0) {
        alert("A lista não pode estar vazia.");
        return;
    }
    let conjItens = []
    let algumItemEmBranco = false;
    tabelaRows.forEach(row => {
        let selectProduto = row.querySelector(".select-produto");
        let inputQuantidade = row.querySelector("input[type='number']");
        if (selectProduto && inputQuantidade) {
            let produtoId = selectProduto.value;
            let quantidade = parseInt(inputQuantidade.value);
            if (!produtoId) {
                alert("Por favor, selecione um produto para todos os itens da lista.");
                algumItemEmBranco = true;
                return;
            }
            conjItens.push({
                produtoId: produtoId,
                quantidade: quantidade,
                concluido: false
            });
        }
    });
    if (algumItemEmBranco) {
        return;
    }
    this.viewer.getCtrl().incluir(nome,conjItens); 
}

function fnBtnAdicionarProduto() {

  this.viewer.getCtrl().iniciarAdicionarProduto();

}

function fnBtnFinalizarLista() {
    // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
    // no botão para poder executar a instrução abaixo.
    if (!confirm("Deseja finalizar a compra?")) return;
    let listaId = this.viewer.selectConsultarLista.value;
    this.viewer.getCtrl().iniciarFinalizarLista(listaId);
    
}

function fnBtnAdicionarItemCon() {
    // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
    // no botão para poder executar a instrução abaixo.
    let produtoId = this.viewer.selectProduto.value;
    let quantidade = parseInt(this.viewer.inputQuantidade.value, 10);
    if (!produtoId || isNaN(quantidade) || quantidade < 1) {
    alert("Preencha corretamente os campos.");
    return;
    }
    let listaId = this.viewer.selectConsultarLista.value;
    this.viewer.getCtrl().iniciarAdicionarItemCon(listaId,produtoId,quantidade);
    
}

function fnBtnCancelarItem() {
    // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
    // no botão para poder executar a instrução abaixo.
    this.viewer.getCtrl().iniciarCancelarItem();
    
}

function fnBtnRemoverLista() {
    if (!confirm("Deseja realmente remover esta lista?")) return;
    let listaId = this.viewer.selectConsultarLista.value;
    this.viewer.getCtrl().iniciarRemoverLista(listaId);
    
}


function fnSelectConsultarLista(){
  let listaId = this.viewer.selectConsultarLista.value;
  this.viewer.getCtrl().iniciarDetalhesLista(listaId);
}