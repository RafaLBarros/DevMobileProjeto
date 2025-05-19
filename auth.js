// auth-check.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// Your Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

function checkAuth() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            alert("Você precisa estar logado para acessar esta página.");
            window.location.href = "manterUsuario.html#login"; // Redireciona para login
        } else {
            // Se o usuário está logado, atualize o nome na barra de navegação
            const nomeUsuario = localStorage.getItem("nomeUsuario");
            if (nomeUsuario) {
                const elementoNome = document.getElementById("nome-usuario-nav");
                if (elementoNome) {
                    elementoNome.textContent = nomeUsuario;
                }
            } else {
                // Se o nome não estiver no localStorage, você pode buscar no banco de dados ou fazer outra ação
                console.log("Nome do usuário não encontrado no localStorage.");
            }
        }
    });
}
function logout() {
    signOut(auth)
        .then(() => {
            console.log("Usuário deslogado");
            alert("Logout realizado com sucesso!");
        })
        .catch((error) => {
            console.error("Erro no logout:", error.message);
        });
}

function menu() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }

    // Botão de Logout
const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
    btnLogout.addEventListener("click", () => {
        logout();
    });
}
const fafabars = document.getElementById("fafabars");
if (fafabars) {
    fafabars.addEventListener("click", () => {
         menu();
    });
}

// Execute check auth when the script loads
checkAuth();