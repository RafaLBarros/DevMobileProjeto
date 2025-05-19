"use strict";

// A cláusula 'import' é utilizada sempre que uma classe precisar conhecer a estrutura
// de outra classe. No arquivo referenciado após o 'from' é necessário informar o que
// para a ser visível para a classe que utiliza o import. Para isso, lá colocamos a 
// indicação 'export'
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, query, onValue, onChildAdded, orderByChild, 
        child, orderByKey, equalTo, get, set, remove, push, runTransaction } 
  from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Importamos a definição da classe Usuario
import Usuario from "/model/Usuario.js";
// Importamos a definição da classe ModelError
import ModelError from "/model/ModelError.js";

const firebaseConfig = {
    apiKey: "AIzaSyAlgaQN8Oq7tsS6UhymWriTzTga1qmg-ZI",
    authDomain: "rlb-lasalle-firebase.firebaseapp.com",
    databaseURL: "https://rlb-lasalle-firebase-default-rtdb.firebaseio.com",
    projectId: "rlb-lasalle-firebase",
    storageBucket: "rlb-lasalle-firebase.firebasestorage.app",
    messagingSenderId: "488497251520",
    appId: "1:488497251520:web:32e3bf3f71040ef1c69925",
    measurementId: "G-DMLGRWXSP9"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/*
 * DAO --> Data Access Object
 * A responsabilidade de um DAO é fazer uma ponte entre o programa e o 
 * recurso de persistência dos dados (ex. SGDB)
 */

export default class DaoUsuario {
  
  //-----------------------------------------------------------------------------------------//

  // único atributo presente em DaoUsuario. Observe que é um atributo estático; ou seja,
  // se tivermos mais de um objeto DaoUsuario, todos vão compartilhar o mesmo atributo
  // conexão.
  static promessaConexao = null;

  // Construtor: vai tentar estabelecer uma conexão com o IndexedDB
  constructor() {
    console.log("criei um daousuario");
    this.obterConexao();
  }

  //-----------------------------------------------------------------------------------------//
  
  /*
   *  Devolve uma Promise com a referência para o BD. Sempre que 'obterConexao' for chamado, 
   *  será necessário usar o await para recuperar o IDBDatabase.
   */ 
  async obterConexao() {
    // Como 'promessaConexao' é um atributo estático, usamos o nome da classe 
    // para acessá-lo
    if(DaoUsuario.promessaConexao == null) {
      DaoUsuario.promessaConexao = new Promise(function(resolve, reject) {
        const db = getDatabase();
        if(db)
            resolve(db);
        else 
            reject(new ModelError("Não foi possível estabelecer conexão com o BD"));
      });
    }
    return DaoUsuario.promessaConexao;
  }
  
  //-----------------------------------------------------------------------------------------//
  // Exemplo de consulta baseada na chave de indexação dos objetos de uma determinada entrada
  // No caso de Usuário, os objetos estão indexados pelo UID
  //-----------------------------------------------------------------------------------------//

  async obterUsuarioPeloUID(uid) {
     let connectionDB = await this.obterConexao();          
    return new Promise((resolve) => {
      // Monto uma referência para o objeto que desejo recuperar
      let dbRefUsuario = ref(connectionDB,'users/' + uid );
      // Monto a consulta a partir da referência
      let consulta = query(dbRefUsuario);
      // Executo a consulta. Ela devolve uma Promise
      let resultPromise = get(consulta);
      resultPromise.then(dataSnapshot => {
        // Se a consulta teve um resultado, então pegamos o conteúdo (val()) do objeto
        let usr = dataSnapshot.val();
        if(usr != null) 
          // Crio um objeto Usuario a partir do objeto JSON retornado por val().
          resolve(new Usuario(usr.nome, usr.email));
          
        else
          // Retorno nul se o val() também for nulo.
          resolve(null);
      });
    });
  }

  //-----------------------------------------------------------------------------------------//

  async incluir(usuario) {
    createUserWithEmailAndPassword(auth, usuario.getEmail(), usuario.getSenha())
        .then((userCredential) => {
            console.log("Usuário cadastrado:", userCredential.user);
            // Salvar o nome e email do usuário no Realtime Database
            const db = getDatabase();
            const userRef = ref(db, 'users/' + userCredential.user.uid);
            set(userRef, {
                nome: usuario.getNome(),
                email: usuario.getEmail() 
            }).then(() => {
                alert("Cadastro realizado com sucesso!");
            }).catch((error) => {
                console.error("Erro ao salvar nome do usuário:", error.message);
                alert("Erro ao salvar nome: " + error.message);
            });
        })
        .catch((error) => {
            console.error("Erro no cadastro:", error.message);
            alert("Erro: " + error.message);
        });
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(usuario) {
    let connectionDB = await this.obterConexao();    
    //--------- PROMISE --------------//
    let resultado = new Promise( (resolve, reject) => {   
      let dbRefUsuario = ref(connectionDB,'users/' + usuario.getUid());

      let setPromise = set(dbRefUsuario, new Usuario(usuario));
      setPromise.then( value => {resolve(true)},  erro => {reject(erro)});
    });
    return resultado;
  }
  
  //-----------------------------------------------------------------------------------------//

  async excluir(usuario) {
    let connectionDB = await this.obterConexao();    
    //--------- PROMISE --------------//
    let resultado = new Promise( (resolve, reject) => {   
      let dbRefUsuario = ref(connectionDB,'users/' + usuario.getUid());

      let setPromise = remove(dbRefUsuario);
      setPromise.then( value => {resolve(true)},  erro => {reject(erro)});
    });
    return resultado;
  }
  //-----------------------------------------------------------------------------------------//

  async emailToUid(usuarioUid,emailKey){
    let connectionDB = await this.obterConexao();    
    let resultado = new Promise( (resolve, reject) => {   
      let dbRefEmail = ref(connectionDB,`emailToUid/${emailKey}`);
      let setPromise = set(dbRefEmail, usuarioUid);
      setPromise.then( value => {resolve(true)},  erro => {reject(erro)});
    });
    return resultado;
  }
  async obterConvidado(chaveConvidado){
    let connectionDB = await this.obterConexao();          
    return new Promise((resolve) => {
      // Monto uma referência para o objeto que desejo recuperar
      let dbRefUsuario = ref(connectionDB,`emailToUid/${chaveConvidado}`);
      // Monto a consulta a partir da referência
      let consulta = query(dbRefUsuario);
      // Executo a consulta. Ela devolve uma Promise
      let resultPromise = get(consulta);
      resultPromise.then(dataSnapshot => {
        let usr = dataSnapshot.val();
        if(usr != null) 
          resolve(usr);     
        else
          resolve(null);
      });
    });
  }
  async compartilharDono(uid,convidadoId,listaId){
    let connectionDB = await this.obterConexao();          
    return new Promise( (resolve, reject) => {

      let dbRefUsuarios = ref(connectionDB,`users/${uid}/listas/${listaId}/convidados/${convidadoId}`);

      runTransaction(dbRefUsuarios, (users) => {       

        let setPromise = set(dbRefUsuarios,true);

        setPromise
          .then( value => {resolve(true)})
          .catch((e) => {console.log("#ERRO: " + e);resolve(false);});
      });
    });
  }
  async compartilharConvidado(uid,convidadoId,listaId){
    let connectionDB = await this.obterConexao();          
    return new Promise( (resolve, reject) => {

      let dbRefUsuarios = ref(connectionDB,`sharedListsForUser/${convidadoId}/${uid}/${listaId}`);

      runTransaction(dbRefUsuarios, (users) => {       

        let setPromise = set(dbRefUsuarios,true);

        setPromise
          .then( value => {resolve(true)})
          .catch((e) => {console.log("#ERRO: " + e);resolve(false);});
      });
    });
  }
  async obterListasCompartilhadas(uid) {
    let db = await this.obterConexao();
    const resultado = {};

    const sharedSnap = await get(ref(db, `sharedListsForUser/${uid}`));
    console.log(`sharedListsForUser/${uid}`);
    if (!sharedSnap.exists()){
      console.log("Não encontrei listas compartilhadas");
      return resultado;
    }
    const promises = [];

    sharedSnap.forEach(donoSnap => {
      const donoId = donoSnap.key;
      const listasObj = donoSnap.val();

      for (const listaId in listasObj) {
        const caminhoNome = `users/${donoId}/listas/${listaId}/nome`;
        const p = get(ref(db, caminhoNome))
          .then(nameSnap => {
            const nomeLista = nameSnap.exists() ? nameSnap.val() : listaId;
            resultado[`${donoId}/${listaId}`] = nomeLista;
          })
          .catch(err => {
            console.warn(`Erro ao buscar nome da lista ${listaId}:`, err);
            resultado[`${donoId}/${listaId}`] = listaId; // fallback
          });

        promises.push(p);
      }
    });

    await Promise.all(promises);
    return resultado;
  }
}