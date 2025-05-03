//------------------------------------------------------------------------//

export default class ViewerManterUsuario {

    #ctrl;
    
    constructor(ctrl) {
      this.#ctrl = ctrl;
      
      this.divCadastrarUsuario = obterElemento('divCadastrarUsuario');
      this.divLoginUsuario = obterElemento('divLoginUsuario');

      this.formCadastro = obterElemento('formCadastro');
      this.formLogin = obterElemento('formLogin');

      this.inputNomeUsuario = obterElemento('inputNomeUsuario');
      this.inputEmailUsuario = obterElemento('inputEmailUsuario');
      this.inputSenhaUsuarioCad = obterElemento('inputSenhaUsuarioCad');
      this.inputLoginUsuario = obterElemento('inputLoginUsuario');
      this.inputSenhaUsuarioLog = obterElemento('inputSenhaUsuarioLog');

      this.btnCadastrarUsuario = obterElemento('btnCadastrarUsuario');
      this.btnLoginUsuario = obterElemento('btnLoginUsuario');

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

}
//------------------------------------------------------------------------//

function fnBtnCadastrarUsuario() {
    // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
    // no botão para poder executar a instrução abaixo.
    this.viewer.getCtrl().iniciarCadastrarUsuario();
    
}

function fnBtnLoginUsuario() {
    // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
    // no botão para poder executar a instrução abaixo.
    this.viewer.getCtrl().iniciarLoginUsuario();
    
}