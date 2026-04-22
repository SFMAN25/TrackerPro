// js/auth.js
import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// لو أنت مسجل دخول بالفعل، يحولك للوحة التحكم فوراً
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "dashboard.html";
    }
});

const loginBtn = document.getElementById('loginBtn');
const msgObj = document.getElementById('message');

loginBtn.addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if(!email || !password) {
        msgObj.innerText = "يرجى إدخال البريد وكلمة المرور";
        msgObj.classList.remove('hidden');
        return;
    }

    loginBtn.innerText = "جاري الدخول...";

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // الدخول ناجح
            window.location.href = "dashboard.html";
        })
        .catch((error) => {
            msgObj.innerText = "بيانات الدخول غير صحيحة!";
            msgObj.classList.remove('hidden');
            loginBtn.innerText = "تسجيل الدخول";
        });
});
