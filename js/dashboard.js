import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html";
    } else {
        document.getElementById('main-body').classList.remove('hidden');
        loadLogs();
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    signOut(auth).then(() => window.location.href = "index.html");
});

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
            const dateObj = data.timestamp ? data.timestamp.toDate() : new Date();
            const timeString = dateObj.toLocaleString('ar-EG');

            const row = `
                <tr class="hover:bg-blue-500/5 transition group">
                    <td class="p-4 font-bold ${getPlatformColor(data.platform)}">${data.platform}</td>
                    <td class="p-4 text-gray-300 font-medium">${data.target_name}</td>
                    <td class="p-4">
                        <span class="bg-gray-800 px-3 py-1 rounded-full text-xs border border-gray-700">${data.action}</span>
                    </td>
                    <td class="p-4 text-gray-500 text-sm" dir="ltr">${timeString}</td>
                </tr>
            `;
            logsTable.innerHTML += row;
        });

        totalLogsText.innerText = count;
        if(count === 0) {
            logsTable.innerHTML = `<tr><td colspan="4" class="p-10 text-center text-gray-500 italic">في انتظار أول إشارة نشاط...</td></tr>`;
        }
    });
}

function getPlatformColor(platform) {
    if(!platform) return 'text-white';
    const p = platform.toLowerCase();
    if(p.includes('whatsapp')) return 'text-green-400';
    if(p.includes('facebook')) return 'text-blue-500';
    if(p.includes('tiktok')) return 'text-pink-500';
    return 'text-blue-300';
}
