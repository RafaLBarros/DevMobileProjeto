import Usuario from "/model/Usuario.js";
import DaoUsuario from "/model/dao/DaoUsuario.js";
import ViewerManterUsuario from "/viewer/ViewerManterUsuario.js";

export default class CtrlManterUsuario{
    #dao;
    #viewer;
    #acao;
    constructor(acao){
        console.log("criei um ctrlmanterusuario");
        this.#dao = new DaoUsuario();
        this.#viewer = new ViewerManterUsuario(this);
        this.#acao = acao;
        this.#atualizarContextoNavegacao();
    }
    async #atualizarContextoNavegacao(){
        if(this.#acao == 'login'){
            this.#viewer.statusLogin();
        }else if(this.#acao == 'registro'){
            this.#viewer.statusCadastro();
        }        
    }
    async incluir(nome,email,senha) {
        console.log("entrei na função de incluir do ctrl!")
            if(this.#acao == 'registro') {
              try {
                console.log("incluindo usuario...");
                let usuario = new Usuario(nome, email,senha);
                await this.#dao.incluir(usuario); 
              }
              catch(e) {
                alert(e);
              }
            }    
          }
}