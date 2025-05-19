"use strict";

import CtrlManterProdutos from "/controller/CtrlManterProdutos.js";
import Status from "/model/Status.js";
import CtrlManterUsuario from "/controller/CtrlManterUsuario.js"
import CtrlManterListas from "/controller/CtrlManterListas.js"
import CtrlCopiarListas from "/controller/CtrlCopiarListas.js"
import CtrlCompartilharListas from "/controller/CtrlCompartilharListas.js"



export default class CtrlSessao {
  
  
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
      if(location.pathname.endsWith("/paginas/manterProduto.html") && location.hash === "#estoque"){
        console.log("Executando status");
        this.ctrlAtual = new CtrlManterProdutos(Status.NAVEGANDO);
      }
      else if(location.pathname.endsWith("/paginas/manterProduto.html") && location.hash === "#cadastro"){
        console.log("Executando status");
        this.ctrlAtual = new CtrlManterProdutos(Status.INCLUINDO);
      }
      else if(document.URL.includes("/paginas/manterUsuario.html#login")){
        this.ctrlAtual = new CtrlManterUsuario('login');
      }
      else if(document.URL.includes("/paginas/manterUsuario.html#registro")){
        this.ctrlAtual = new CtrlManterUsuario('registro');
      }
      else if(document.URL.includes("/paginas/manterLista.html#init")){
        this.ctrlAtual = new CtrlManterListas(Status.NAVEGANDO);
      }
      else if(document.URL.includes("/paginas/manterLista.html#cadastro")){
        this.ctrlAtual = new CtrlManterListas(Status.INCLUINDO);
      }
      else if(location.pathname.endsWith("/paginas/manterProduto.html") && location.hash === "#saida"){
        this.ctrlAtual = new CtrlManterProdutos(Status.EXCLUINDO);
      }else if(document.URL.includes("/paginas/copiarLista.html")){
        this.ctrlAtual = new CtrlCopiarListas();
      }else if(document.URL.includes("/paginas/compartilharLista.html#compartilhar")){
        this.ctrlAtual = new CtrlCompartilharListas("compartilhando");
      }else if(document.URL.includes("/paginas/compartilharLista.html#convidado")){
        this.ctrlAtual = new CtrlCompartilharListas("visualizando");
      }
    } catch(e) {
      alert(e);
    }
  }
  
  

  
}

new CtrlSessao();