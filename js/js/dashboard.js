// js/dashboard.js
import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 1. حماية الصفحة (التأكد من تسجيل الدخول)
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // لو مش مسجل دخول، اطرده لصفحة الدخول
        window.location.href = "index.html";
    } else {
        // لو مسجل، اظهر الصفحة
        document.getElementById('main-body').classList.remove('hidden');
        loadLogs(); // تشغيل دالة جلب البيانات
    }
});

// 2. تسجيل الخروج
document.getElementById('logoutBtn').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    });
});

// 3. جلب السجلات من Firestore وعرضها
function loadLogs() {
    const logsTable = document.getElementById('logs-table-body');
    const totalLogsText = document.getElementById('total-logs');
    
    // استهداف Collection اسمها 'activity_logs' وترتيبها من الأحدث للأقدم
    const q = query(collection(db, "activity_logs"), orderBy("timestamp", "desc"));

    // onSnapshot بتجيب الداتا وتعمل تحديث تلقائي لو في داتا جديدة انضافت
    onSnapshot(q, (snapshot) => {
        logsTable.innerHTML = ''; // تفريغ الجدول قبل التحديث
        let count = 0;

        snapshot.forEach((doc) => {
            count++;
            const data = doc.data();
            
            // تحويل الوقت لصيغة مقروءة
            const dateObj = data.timestamp ? data.timestamp.toDate() : new Date();
            const timeString = dateObj.toLocaleString('ar-EG');

            const row = `
                <tr class="hover:bg-gray-750 transition">
                    <td class="p-4 font-semibold ${getPlatformColor(data.platform)}">${data.platform}</td>
                    <td class="p-4 text-gray-300">${data.target_name}</td>
                    <td class="p-4 text-gray-400">${data.action}</td>
                    <td class="p-4 text-gray-500 text-sm" dir="ltr">${timeString}</td>
                </tr>
            `;
            logsTable.innerHTML += row;
        });

        totalLogsText.innerText = count;
        
        if(count === 0) {
            logsTable.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-gray-500">لا توجد سجلات حالياً. جاري انتظار البيانات...</td></tr>`;
        }
    });
}

// دالة بسيطة لتلوين اسم المنصة
function getPlatformColor(platform) {
    if(!platform) return 'text-white';
    const p = platform.toLowerCase();
    if(p.includes('whatsapp')) return 'text-green-400';
    if(p.includes('facebook')) return 'text-blue-500';
    if(p.includes('tiktok')) return 'text-pink-500';
    return 'text-gray-300';
}
