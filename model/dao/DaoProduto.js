import { getDatabase, ref, query, onValue, onChildAdded, orderByChild, 
    child, orderByKey, equalTo, get, set, remove, push, runTransaction } 
from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

import Produto from "/model/Produto.js";
import ModelError from "/model/ModelError.js";

export default class DaoProduto {
    static promessaConexao = null;
    constructor() {
        this.obterConexao();
    }

    /*
   *  Devolve uma Promise com a referência para o BD. Sempre que 'obterConexao' for chamado, 
   *  será necessário usar o await para recuperar o IDBDatabase.
   */ 
  async obterConexao() {
    // Como 'promessaConexao' é um atributo estático, usamos o nome da classe 
    // para acessá-lo
    if(DaoProduto.promessaConexao == null) {
      DaoProduto.promessaConexao = new Promise((resolve, reject) => {
        const db = getDatabase();
        if(db)
            resolve(db);
        else 
            reject(new ModelError("Não foi possível estabelecer conexão com o BD"));
      });
    }
    return DaoProduto.promessaConexao;
  }
  async obterProdutoPeloProdutoId(produtoId) {
    // Recuperando a conexão com o Realtime Database
    let connectionDB = await this.obterConexao();   
    // Retornamos uma Promise que nos dará o resultado
    return new Promise((resolve) => {
      // Definindo uma 'ref' para o objeto no banco de dados
      let dbRefProduto = ref(connectionDB,'produto/' + produtoId );
      // Executando a consulta a partir da 'ref'
      let consulta = query(dbRefProduto);
      // Obtendo os dados da query. Nos devolve uma Promise
      let resultPromise = get(consulta);
      // Recuperando o resultado usando 'then'
      resultPromise.then(dataSnapshot => {
        // Pego o valor (objeto) da consulta
        let produtoSnap = dataSnapshot.val();
        // Se há algum objeto no Firebase dado como resposta
        if(produtoSnap != null) {
          // Instancio um objeto Produto a partir do val()
          resolve(new Produto(produtoSnap.produtoId, produtoSnap.nome, produtoSnap.estoque_inicial, produtoSnap.estoque_minimo, 
                            produtoSnap.data_cadastro));
        }
        else
          resolve(null);
      });
    });
  }

  async obterProdutos(gerarDTOs) {
    // Recuperando a conexão com o Realtime Database
    let connectionDB = await this.obterConexao();      
    // Retornamos uma Promise que nos dará o resultado
    return new Promise((resolve) => {
      // Declaramos uma variável que referenciará o array com os objetos Produto
      let conjProdutos = [];      
      // Definindo uma 'ref' para o objeto no banco de dados      
      let dbRefProdutos = ref(connectionDB,'produtos');
      // Executo a query a partir da 'ref' definida
      let consulta = query(dbRefProdutos);
      // Recupero a Promise com o resultado obtido
      let resultPromise = get(consulta);
      // Com o resultado, vamos montar o array de resposta
      resultPromise.then(dataSnapshot => {
        // Para cada objeto presente no resultado
        dataSnapshot.forEach(dataSnapshotObj => {
          // Recupero o objeto com val()
          let produtoSnap = dataSnapshotObj.val();          
          // Instancio um objeto Produto a partir do val()
          conjProdutos.push(new Produto(produtoSnap.produtoId, produtoSnap.nome, produtoSnap.estoque_inicial, produtoSnap.estoque_minimo, 
            produtoSnap.data_cadastro));
        });
        // Ao final do 'forEach', coloco o array como resolve da Promise a ser retornada
        resolve(conjProdutos);
      }).catch((e) => { console.log("#ERRO: " + e); resolve([])});
    });
  }

  async alterar(produto) {
    // Recuperando a conexão com o Realtime Database
    let connectionDB = await this.obterConexao();    
    // Retornamos uma Promise que nos informará se a alteração foi realizada ou não
    return new Promise( (resolve, reject) => {
      // Monto a 'ref' para a entrada 'produtos' para a alteração
      let dbRefProdutos = ref(connectionDB,'produtos');
      // Inicio uma transação
      runTransaction(dbRefProdutos, (produtos) => {       
        // Monto um child de 'cursos', onde vamos colocar a alteração do . Esse filho 
        // de 'cursos' que é formado pela 'ref' 'cursos' (dbRefProdutos) mais a sigla 
        // do novo curso
        let dbRefProdutoAlterado = child(dbRefProdutos,produto.getProdutoId());
        // 'set' também é utilizado para alterar um objeto no Firebase a partir de seu 
        // 'ref'. Como devolve uma promise, definimos o resultado pelo 'then'
        let setPromise = set(dbRefProdutoAlterado,produto);
        // Definimos o resultado da operação
        setPromise.then( value => {resolve(true)}).catch((e) => {console.log("#ERRO: " + e);resolve(false);});
      });
    });
  }

  async excluir(produto) {
    // Recuperando a conexão com o Realtime Database
    let connectionDB = await this.obterConexao();    
    // Retornamos uma Promise que nos informará se a exclusão foi realizada ou não
    return new Promise( (resolve, reject) => {
      // Monto a 'ref' para a entrada 'produtos' para a exclusão
      let dbRefProdutos = ref(connectionDB,'produtos');
      // Inicio uma transação
      runTransaction(dbRefProdutos, (produtos) => {       
        // Monto um child de 'produtos', onde vamos promover a exclusão do produto. Esse filho 
        // de 'produtos' que é formado pela 'ref' 'produtos' (dbRefProdutos) mais a ID do Produto
        let dbRefExcluirProduto = child(dbRefProdutos,produto.getProdutoId());
        // 'remove'  é utilizado para excluir um  objeto no Firebase a partir de seu 
        // 'ref'. Como devolve uma promise, definimos o resultado pelo 'then'
        let setPromise = remove(dbRefExcluirProduto,produto);
        // Definimos o resultado da operação
        setPromise.then( value => {resolve(true)}).catch((e) => {console.log("#ERRO: " + e);resolve(false);});
      });
    });
  }

  async incluir(produto) {
    // Recuperando a conexão com o Realtime Database
    let connectionDB = await this.obterConexao();    
    // Retornamos uma Promise que nos informará se a inclusão foi realizada ou não
    return new Promise( (resolve, reject) => {
      // Monto a 'ref' para a entrada 'produtos' para a inclusão
      let dbRefProdutos = ref(connectionDB,'produtos');
      // Inicio uma transação
      runTransaction(dbRefProdutos, (produtos) => {       
        // Monto um push de 'produtos', onde vamos pendurar o novo produto. Esse push 
        // de 'produtos' gera o id automaticamente para usarmos como referencia
        // para o novo produto
        let dbRefNovoProduto = push(dbRefProdutos);
        //Coloco a chave no objeto de produto antes
        produto.setProdutoId(dbRefNovoProduto.key);
        // 'set' é utilizado para incluir um novo objeto no Firebase a partir de seu 
        // 'ref'. Como devolve uma promise, definimos o resultado pelo 'then'
        let setPromise = set(dbRefNovoProduto,produto);
        // Definimos o resultado da operação
        setPromise
          .then( value => {resolve(true)})
          .catch((e) => {console.log("#ERRO: " + e);resolve(false);});
      });
    });
  }
}
