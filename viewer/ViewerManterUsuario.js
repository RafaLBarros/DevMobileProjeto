import ViewerError from "/viewer/ViewerError.js";
//------------------------------------------------------------------------//

export default class ViewerManterUsuario {

    #ctrl;
    
    constructor(ctrl) {
      console.log("criei um viewerusuario");
      this.#ctrl = ctrl;
      
      this.divCadastrarUsuario = this.obterElemento('divCadastrarUsuario');
      this.divLoginUsuario = this.obterElemento('divLoginUsuario');

      this.formCadastro = this.obterElemento('formCadastro');
      this.formLogin = this.obterElemento('formLogin');

      this.inputNomeUsuario = this.obterElemento('inputNomeUsuario');
      this.inputEmailUsuario = this.obterElemento('inputEmailUsuario');
      this.inputSenhaUsuarioCad = this.obterElemento('inputSenhaUsuarioCad');
      this.inputLoginUsuario = this.obterElemento('inputLoginUsuario');
      this.inputSenhaUsuarioLog = this.obterElemento('inputSenhaUsuarioLog');

      this.btnCadastrarUsuario = this.obterElemento('btnCadastrarUsuario');
      this.btnLoginUsuario = this.obterElemento('btnLoginUsuario');

      this.btnCadastrarUsuario.onclick = fnBtnCadastrarUsuario;
      this.btnLoginUsuario.onclick = fnBtnLoginUsuario;
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

  statusLogin(){
    this.divLoginUsuario.style.display = "block";
    this.divCadastrarUsuario.style.display = "none";
  }

  statusCadastro(){
    this.divLoginUsuario.style.display = "none";
    this.divCadastrarUsuario.style.display = "block";
  }

}
//------------------------------------------------------------------------//

function fnBtnCadastrarUsuario() {
    console.log("entrei na função de cadastrar do viewer!")
    // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
    // no botão para poder executar a instrução abaixo.
    const nome = this.viewer.inputNomeUsuario.value;
    const email = this.viewer.inputEmailUsuario.value;
    const senha = this.viewer.inputSenhaUsuarioCad.value;
    this.viewer.getCtrl().incluir(nome,email,senha);
    
}

function fnBtnLoginUsuario(login) {
    // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
    // no botão para poder executar a instrução abaixo.
    this.viewer.getCtrl().login();
    
}