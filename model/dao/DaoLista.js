import { getDatabase, ref, query, onValue, onChildAdded, orderByChild, 
    child, orderByKey, equalTo, get, set, remove, push, runTransaction, update} 
from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

import Lista from "/model/Lista.js";
import ModelError from "/model/ModelError.js";

export default class DaoLista {
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
    if(DaoLista.promessaConexao == null) {
      DaoLista.promessaConexao = new Promise((resolve, reject) => {
        const db = getDatabase();
        if(db)
            resolve(db);
        else 
            reject(new ModelError("Não foi possível estabelecer conexão com o BD"));
      });
    }
    return DaoLista.promessaConexao;
  }
  async obterListaPeloListaId(listaId,usuarioUid) {
    // Recuperando a conexão com o Realtime Database
    let connectionDB = await this.obterConexao();   
    // Retornamos uma Promise que nos dará o resultado
    return new Promise((resolve) => {
      // Definindo uma 'ref' para o objeto no banco de dados
      let dbRefLista = ref(connectionDB,`users/${usuarioUid}/listas/${listaId}`);
      // Executando a consulta a partir da 'ref'
      let consulta = query(dbRefLista);
      // Obtendo os dados da query. Nos devolve uma Promise
      let resultPromise = get(consulta);
      // Recuperando o resultado usando 'then'
      resultPromise.then(dataSnapshot => {
        // Pego o valor (objeto) da consulta
        let listaSnap = dataSnapshot.val();
        console.log(listaSnap);
        // Se há algum objeto no Firebase dado como resposta
        if(listaSnap != null) {
          // Instancio um objeto Lista a partir do val()
          let lista = new Lista(listaSnap.nome, listaSnap.data, listaSnap.itens, listaSnap.status)
          lista.setListaId(dataSnapshot.key)
          resolve(lista);
        }
        else
          resolve(null);
      });
    });
  }

  async obterListas(usuarioUid) {
    // Recuperando a conexão com o Realtime Database
    let connectionDB = await this.obterConexao();      
    // Retornamos uma Promise que nos dará o resultado
    return new Promise((resolve) => {
      // Declaramos uma variável que referenciará o array com os objetos Lista
      let conjListas = [];      
      // Definindo uma 'ref' para o objeto no banco de dados      
      let dbRefLista = ref(connectionDB,`users/${usuarioUid}/listas`);
      // Executo a query a partir da 'ref' definida
      let consulta = query(dbRefLista);
      // Recupero a Promise com o resultado obtido
      let resultPromise = get(consulta);
      // Com o resultado, vamos montar o array de resposta
      resultPromise.then(dataSnapshot => {
        // Para cada objeto presente no resultado
        dataSnapshot.forEach(dataSnapshotObj => {
          // Recupero o objeto com val()
          let listaSnap = dataSnapshotObj.val();          
          // Instancio um objeto lista a partir do val()
          let lista = new Lista(listaSnap.nome, listaSnap.data, listaSnap.itens, listaSnap.status)
          lista.setListaId(dataSnapshotObj.key)
          conjListas.push(lista);
        });
        // Ao final do 'forEach', coloco o array como resolve da Promise a ser retornada
        resolve(conjListas);
      }).catch((e) => { console.log("#ERRO: " + e); resolve([])});
    });
  }

  async alterar(lista,usuarioUid) {
    // Recuperando a conexão com o Realtime Database
    let connectionDB = await this.obterConexao();    
    // Retornamos uma Promise que nos informará se a alteração foi realizada ou não
    return new Promise( (resolve, reject) => {
      // Monto a 'ref' para a entrada 'listas' para a alteração
      let dbRefListas = ref(connectionDB,`users/${usuarioUid}/listas`);
      // Inicio uma transação
      runTransaction(dbRefListas, (listas) => {       
        // Monto um child de 'cursos', onde vamos colocar a alteração do . Esse filho 
        // de 'cursos' que é formado pela 'ref' 'cursos' (dbReflistas) mais a sigla 
        // do novo curso
        let dbRefListaAlterado = child(dbRefListas,lista.getListaId());
        // 'set' também é utilizado para alterar um objeto no Firebase a partir de seu 
        // 'ref'. Como devolve uma promise, definimos o resultado pelo 'then'
        let setPromise = set(dbRefListaAlterado,lista);
        // Definimos o resultado da operação
        setPromise.then( value => {resolve(true)}).catch((e) => {console.log("#ERRO: " + e);resolve(false);});
      });
    });
  }
  async alterarCheckItem(usuarioUid,itemKey,marcado,listaId){
    // Recuperando a conexão com o Realtime Database
    let connectionDB = await this.obterConexao(); 
    return new Promise( (resolve, reject) => {
      let dbRefItem = ref(connectionDB, `users/${usuarioUid}/listas/${listaId}/itens/${itemKey}`);
      let setPromise = update(dbRefItem,{ concluido: marcado });
      setPromise.then( value => {resolve(true)}).catch((e) => {console.log("#ERRO: " + e);resolve(false);});
    })
  }

  async excluir(lista,usuarioUid) {
    // Recuperando a conexão com o Realtime Database
    let connectionDB = await this.obterConexao();    
    // Retornamos uma Promise que nos informará se a exclusão foi realizada ou não
    return new Promise( (resolve, reject) => {
      // Monto a 'ref' para a entrada 'listas' para a exclusão
      let dbRefListas = ref(connectionDB,`users/${usuarioUid}/listas`);
      // Inicio uma transação
      runTransaction(dbRefListas, (listas) => {       
        // Monto um child de 'listas', onde vamos promover a exclusão do lista. Esse filho 
        // de 'listas' que é formado pela 'ref' 'listas' (dbReflistas) mais a ID do lista
        let dbRefExcluirLista = child(dbRefListas,lista.getListaId());
        // 'remove'  é utilizado para excluir um  objeto no Firebase a partir de seu 
        // 'ref'. Como devolve uma promise, definimos o resultado pelo 'then'
        let setPromise = remove(dbRefExcluirLista,lista);
        // Definimos o resultado da operação
        setPromise.then( value => {resolve(true)}).catch((e) => {console.log("#ERRO: " + e);resolve(false);});
      });
    });
  }

  async incluir(lista,usuarioUid) {
    // Recuperando a conexão com o Realtime Database
    let connectionDB = await this.obterConexao();    
    // Retornamos uma Promise que nos informará se a inclusão foi realizada ou não
    return new Promise( (resolve, reject) => {
      // Monto a 'ref' para a entrada 'listas' para a inclusão
      let dbRefListas = ref(connectionDB,`users/${usuarioUid}/listas`);
      // Inicio uma transação
      runTransaction(dbRefListas, (listas) => {       
        // Monto um push de 'listas', onde vamos pendurar o novo lista. Esse push 
        // de 'listas' gera o id automaticamente para usarmos como referencia
        // para o novo lista
        let dbRefNovoLista = push(dbRefListas);
        //Coloco a chave no objeto de lista antes
        lista.setListaId(dbRefNovoLista.key);
        // 'set' é utilizado para incluir um novo objeto no Firebase a partir de seu 
        // 'ref'. Como devolve uma promise, definimos o resultado pelo 'then'
        let setPromise = set(dbRefNovoLista,lista);
        // Definimos o resultado da operação
        setPromise
          .then( value => {resolve(true)})
          .catch((e) => {console.log("#ERRO: " + e);resolve(false);});
      });
    });
  }
}