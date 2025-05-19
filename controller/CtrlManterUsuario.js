import Usuario from "/model/Usuario.js";
import DaoUsuario from "/model/dao/DaoUsuario.js";
import ViewerManterUsuario from "/viewer/ViewerManterUsuario.js";


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

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
    setAcao(acao){
      this.#acao = acao;
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
    async login(email, senha) {
      let uid;
      signInWithEmailAndPassword(auth, email, senha)
          .then((userCredential) => {
              console.log("Usuário logado:", userCredential.user);
              uid = userCredential.user.uid;
              this.guardarNome(uid);
              alert("Usuário conectado com sucesso!")
          })
          .catch((error) => {
              console.error("Erro no login:", error.message);
              alert("Usuário ou senha inválidos");
          });
    }
    async guardarNome(uid){
      const usuario = await this.#dao.obterUsuarioPeloUID(uid);
      if(usuario) {
        localStorage.setItem("nomeUsuario",usuario.getNome());
        localStorage.setItem("uid",uid);
        window.location.href = 'index.html'; // Redireciona após login
      }else {
        alert("Usuário não encontrado no banco!")
      }
    }
}