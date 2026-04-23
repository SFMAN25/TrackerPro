import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// حماية الصفحة
onAuthStateChanged(auth, (user) => {
    if (!user) window.location.href = "index.html";
    else {
        document.getElementById('main-body').classList.remove('hidden');
        loadLogs();
    }
});

// تسجيل الخروج
document.getElementById('logoutBtn').addEventListener('click', () => {
    signOut(auth).then(() => window.location.href = "index.html");
});

// وظيفة إضافة بيانات (تجميع بيانات)
document.getElementById('addLogBtn').addEventListener('click', async () => {
    const platform = document.getElementById('platform-select').value;
    const name = document.getElementById('target-name').value;
    const link = document.getElementById('target-link').value;

    if (!name || !link) {
        alert("برجاء إدخال اسم الهدف والرابط");
        return;
    }

    try {
        await addDoc(collection(db, "activity_logs"), {
            platform: platform,
            target_name: name,
            action: "بدء مراقبة الرابط: " + link,
            timestamp: serverTimestamp()
        });
        document.getElementById('target-name').value = '';
        document.getElementById('target-link').value = '';
    } catch (e) {
        console.error("Error adding document: ", e);
    }
});

// عرض البيانات
function loadLogs() {
    const logsTable = document.getElementById('logs-table-body');
    const totalLogsText = document.getElementById('total-logs');
    const q = query(collection(db, "activity_logs"), orderBy("timestamp", "desc"));

    onSnapshot(q, (snapshot) => {
        logsTable.innerHTML = '';
        let count = 0;
        snapshot.forEach((doc) => {
            count++;
            const data = doc.data();
            const time = data.timestamp ? data.timestamp.toDate().toLocaleString('ar-EG') : 'جاري التحديث...';

            logsTable.innerHTML += `
                <tr class="border-b border-gray-800/50 hover:bg-white/5 transition">
                    <td class="p-4 font-bold text-blue-400">${data.platform}</td>
                    <td class="p-4 text-gray-200">${data.target_name}</td>
                    <td class="p-4"><span class="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md text-xs">${data.action}</span></td>
                    <td class="p-4 text-gray-500 text-xs" dir="ltr">${time}</td>
                </tr>
            `;
        });
        totalLogsText.innerText = count + " سجل";
    });
}
