import { getDatabase, ref, query, onValue, onChildAdded, orderByChild, 
    child, orderByKey, equalTo, get, set, remove, push, runTransaction } 
from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

import ItemLista from "/model/ItemLista.js";
import ModelError from "/model/ModelError.js";

export default class DaoItemLista {
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
    if(DaoItemLista.promessaConexao == null) {
      DaoItemLista.promessaConexao = new Promise((resolve, reject) => {
        const db = getDatabase();
        if(db)
            resolve(db);
        else 
            reject(new ModelError("Não foi possível estabelecer conexão com o BD"));
      });
    }
    return DaoItemLista.promessaConexao;
  }
  async obterItemListaPeloItemListaId(itemListaId,usuario,lista) {
    // Recuperando a conexão com o Realtime Database
    let connectionDB = await this.obterConexao();   
    // Retornamos uma Promise que nos dará o resultado
    return new Promise((resolve) => {
      // Definindo uma 'ref' para o objeto no banco de dados
      let dbRefItemLista = ref(connectionDB,'users/'+usuario.getUid()+'listas/'+lista.getListaId()+'itens/' + itemListaId );
      // Executando a consulta a partir da 'ref'
      let consulta = query(dbRefItemLista);
      // Obtendo os dados da query. Nos devolve uma Promise
      let resultPromise = get(consulta);
      // Recuperando o resultado usando 'then'
      resultPromise.then(dataSnapshot => {
        // Pego o valor (objeto) da consulta
        let itemListaSnap = dataSnapshot.val();
        // Se há algum objeto no Firebase dado como resposta
        if(itemListaSnap != null) {
          // Instancio um objeto ItemLista a partir do val()
          resolve(new ItemLista(itemListaSnap.itemListaId, itemListaSnap.nome, itemListaSnap.estoque_inicial, itemListaSnap.estoque_minimo, 
                            itemListaSnap.data_cadastro));
        }
        else
          resolve(null);
      });
    });
  }

  async obterItemListas(usuario,lista) {
    // Recuperando a conexão com o Realtime Database
    let connectionDB = await this.obterConexao();      
    // Retornamos uma Promise que nos dará o resultado
    return new Promise((resolve) => {
      // Declaramos uma variável que referenciará o array com os objetos ItemLista
      let conjItemListas = [];      
      // Definindo uma 'ref' para o objeto no banco de dados      
      let dbRefItemListas = ref(connectionDB,'users/'+usuario.getUid()+'listas/'+lista.getListaId()+'itens/');
      // Executo a query a partir da 'ref' definida
      let consulta = query(dbRefItemListas);
      // Recupero a Promise com o resultado obtido
      let resultPromise = get(consulta);
      // Com o resultado, vamos montar o array de resposta
      resultPromise.then(dataSnapshot => {
        // Para cada objeto presente no resultado
        dataSnapshot.forEach(dataSnapshotObj => {
          // Recupero o objeto com val()
          let itemListaSnap = dataSnapshotObj.val();          
          // Instancio um objeto ItemLista a partir do val()
          conjItemListas.push(new ItemLista(itemListaSnap.status, itemListaSnap.quantidade));
        }); 
        // Ao final do 'forEach', coloco o array como resolve da Promise a ser retornada
        resolve(conjItemListas);
      }).catch((e) => { console.log("#ERRO: " + e); resolve([])});
    });
  }

  async alterar(itemLista,usuario,lista) {
    // Recuperando a conexão com o Realtime Database
    let connectionDB = await this.obterConexao();    
    // Retornamos uma Promise que nos informará se a alteração foi realizada ou não
    return new Promise( (resolve, reject) => {
      // Monto a 'ref' para a entrada 'ItemListas' para a alteração
      let dbRefItemListas = ref(connectionDB,'users/'+usuario.getUid()+'listas/'+lista.getListaId()+'itens/');
      // Inicio uma transação
      runTransaction(dbRefItemListas, (itens) => {       
        // Monto um child de 'cursos', onde vamos colocar a alteração do . Esse filho 
        // de 'cursos' que é formado pela 'ref' 'cursos' (dbRefItemListas) mais a sigla 
        // do novo curso
        let dbRefItemListaAlterado = child(dbRefItemListas,itemLista.getItemListaId());
        // 'set' também é utilizado para alterar um objeto no Firebase a partir de seu 
        // 'ref'. Como devolve uma promise, definimos o resultado pelo 'then'
        let setPromise = set(dbRefItemListaAlterado,itemLista);
        // Definimos o resultado da operação
        setPromise.then( value => {resolve(true)}).catch((e) => {console.log("#ERRO: " + e);resolve(false);});
      });
    });
  }

  async excluir(itemLista,usuario,lista) {
    // Recuperando a conexão com o Realtime Database
    let connectionDB = await this.obterConexao();    
    // Retornamos uma Promise que nos informará se a exclusão foi realizada ou não
    return new Promise( (resolve, reject) => {
      // Monto a 'ref' para a entrada 'ItemListas' para a exclusão
      let dbRefItemListas = ref(connectionDB,'users/'+usuario.getUid()+'listas/'+lista.getListaId()+'itens/');
      // Inicio uma transação
      runTransaction(dbRefItemListas, (itens) => {       
        // Monto um child de 'ItemListas', onde vamos promover a exclusão do ItemLista. Esse filho 
        // de 'ItemListas' que é formado pela 'ref' 'ItemListas' (dbRefItemListas) mais a ID do ItemLista
        let dbRefExcluirItemLista = child(dbRefItemListas,itemLista.getItemListaId());
        // 'remove'  é utilizado para excluir um  objeto no Firebase a partir de seu 
        // 'ref'. Como devolve uma promise, definimos o resultado pelo 'then'
        let setPromise = remove(dbRefExcluirItemLista,itemLista);
        // Definimos o resultado da operação
        setPromise.then( value => {resolve(true)}).catch((e) => {console.log("#ERRO: " + e);resolve(false);});
      });
    });
  }

  async incluir(itemLista,usuario,lista) {
    // Recuperando a conexão com o Realtime Database
    let connectionDB = await this.obterConexao();    
    // Retornamos uma Promise que nos informará se a inclusão foi realizada ou não
    return new Promise( (resolve, reject) => {
      // Monto a 'ref' para a entrada 'ItemListas' para a inclusão
      let dbRefItemListas = ref(connectionDB,'users/'+usuario.getUid()+'listas/'+lista.getListaId()+'itens/');
      // Inicio uma transação
      runTransaction(dbRefItemListas, (itens) => {       
        // Monto um push de 'ItemListas', onde vamos pendurar o novo ItemLista. Esse push 
        // de 'ItemListas' gera o id automaticamente para usarmos como referencia
        // para o novo ItemLista
        let dbRefNovoItemLista = push(dbRefItemListas);
        //Coloco a chave no objeto de ItemLista antes
        itemLista.setItemListaId(dbRefNovoItemLista.key);
        // 'set' é utilizado para incluir um novo objeto no Firebase a partir de seu 
        // 'ref'. Como devolve uma promise, definimos o resultado pelo 'then'
        let setPromise = set(dbRefNovoItemLista,itemLista);
        // Definimos o resultado da operação
        setPromise
          .then( value => {resolve(true)})
          .catch((e) => {console.log("#ERRO: " + e);resolve(false);});
      });
    });
  }
}