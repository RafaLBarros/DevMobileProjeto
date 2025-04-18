// auth-check.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA8cXYQ4m-uyEjbJJF_1_4Re8RJvqo1DWE",
    authDomain: "dlopes-lasalle-2025.firebaseapp.com",
    projectId: "dlopes-lasalle-2025",
    storageBucket: "dlopes-lasalle-2025.appspot.com",
    messagingSenderId: "91491434656",
    appId: "1:91491434656:web:8a083bf3df35b5e18949c5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

window.checkAuth = function checkAuth() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            alert("Você precisa estar logado para acessar esta página.");
            window.location.href = "login.html"; // Redireciona para login
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

// Execute check auth when the script loads
checkAuth();