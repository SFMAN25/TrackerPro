import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (user) window.location.href = "dashboard.html";
});

const loginBtn = document.getElementById('loginBtn');
const msgObj = document.getElementById('message');

loginBtn.addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if(!email || !password) {
        msgObj.innerText = "برجاء ملء جميع البيانات";
        msgObj.classList.remove('hidden');
        return;
    }

    loginBtn.innerText = "جاري التحقق...";

    signInWithEmailAndPassword(auth, email, password)
        .then(() => window.location.href = "dashboard.html")
        .catch(() => {
            msgObj.innerText = "خطأ في البريد أو كلمة المرور";
            msgObj.classList.remove('hidden');
            loginBtn.innerText = "دخول النظام";
        });
});
