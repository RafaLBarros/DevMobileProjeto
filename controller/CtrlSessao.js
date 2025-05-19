"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signInWithRedirect, signInWithPopup, browserSessionPersistence, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getDatabase, ref, query, onValue, onChildAdded, orderByChild, orderByKey, equalTo, get, set } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

import CtrlManterProdutos from "/controller/CtrlManterProdutos.js";
import Status from "/model/Status.js";
import CtrlManterUsuario from "/controller/CtrlManterUsuario.js"
import CtrlManterListas from "/controller/CtrlManterListas.js"
import CtrlCopiarListas from "/controller/CtrlCopiarListas.js"
import CtrlCompartilharListas from "/controller/CtrlCompartilharListas.js"

const swal = new Function("json,th", "swal(json).then(th)");

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

export default class CtrlSessao {
  
  #daoUsuario;
  
  //-----------------------------------------------------------------------------------------//  
  constructor() {   
    this.init();
  }
  
  //-----------------------------------------------------------------------------------------//  
 
  async init() {    
    try {
      //this.usuario = await this.verificandoLogin(); 
      // Observe abaixo que temos um problema de ACOPLAMENTO, pois se 
      // precisarmos acrescentar um novo controlador de caso de uso, precisaremos
      // abrir esse arquivo para alteração. O melhor seria implementar um 
      // mecanismo de INJEÇÃO DE DEPENDÊNCIA.     
      if(location.pathname.endsWith("manterProduto.html") && location.hash === "#estoque"){
        console.log("Executando status");
        this.ctrlAtual = new CtrlManterProdutos(Status.NAVEGANDO);
      }
      else if(location.pathname.endsWith("manterProduto.html") && location.hash === "#cadastro"){
        console.log("Executando status");
        this.ctrlAtual = new CtrlManterProdutos(Status.INCLUINDO);
      }
      else if(document.URL.includes("manterUsuario.html#login")){
        this.ctrlAtual = new CtrlManterUsuario('login');
      }
      else if(document.URL.includes("manterUsuario.html#registro")){
        this.ctrlAtual = new CtrlManterUsuario('registro');
      }
      else if(document.URL.includes("manterLista.html#init")){
        this.ctrlAtual = new CtrlManterListas(Status.NAVEGANDO);
      }
      else if(document.URL.includes("manterLista.html#cadastro")){
        this.ctrlAtual = new CtrlManterListas(Status.INCLUINDO);
      }
      else if(location.pathname.endsWith("manterProduto.html") && location.hash === "#saida"){
        this.ctrlAtual = new CtrlManterProdutos(Status.EXCLUINDO);
      }else if(document.URL.includes("copiarLista.html")){
        this.ctrlAtual = new CtrlCopiarListas();
      }else if(document.URL.includes("compartilharLista.html#compartilhar")){
        this.ctrlAtual = new CtrlCompartilharListas("compartilhando");
      }else if(document.URL.includes("compartilharLista.html#convidado")){
        this.ctrlAtual = new CtrlCompartilharListas("visualizando");
      }
    } catch(e) {
      alert(e);
    }
  }
  
  

  
}

new CtrlSessao();