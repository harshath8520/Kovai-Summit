// KOVAI SUMMIT - Firebase Real-time CRM Logic
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, onSnapshot, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- PASTE YOUR FIREBASE CONFIG HERE ---
const firebaseConfig = {
    apiKey: "AIzaSyBmE_E9ygDWWxe92Gvo7QXp7UYpaY9igbA",
    authDomain: "database-e404a.firebaseapp.com",
    projectId: "database-e404a",
    storageBucket: "database-e404a.firebasestorage.app",
    messagingSenderId: "272403945597",
    appId: "1:272403945597:web:2b527b4940c28106603914"
};
// ----------------------------------------

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const stateDocRef = doc(db, "kovai_summit", "dashboard_state");

document.addEventListener('DOMContentLoaded', () => {

    // Default initial data if database is empty
    const defaultState = {
        targets: { stalls: 60, tickets: 500, sponsorship: 10, reels: 50 },
        sold: { stalls: 17, tickets: 4, sponsorship: 0, reels: 0 },
        sponsors: [],
        team: [
            { name: 'Darshan', tasks: ['Contact Support', 'Ticket Sales', 'Reels'], progress: 30, status: 'On Track' },
            { name: 'Gokul', tasks: ['Reels Shoot & Edit', 'Articles'], progress: 20, status: 'Behind' },
            { name: 'Surya', tasks: ['Stall Sales', 'Sponsorship Sales'], progress: 45, status: 'On Track' },
            { name: 'Samuel Gurudas', tasks: ['Sponsorship Sales'], progress: 10, status: 'Critical' },
            { name: 'Kamal', tasks: ['Editing'], progress: 60, status: 'On Track' },
            { name: 'Ajit', tasks: ['Article Posting'], progress: 15, status: 'Delay' }
        ]
    };

    let state = defaultState;

    // --- REAL-TIME LISTENER (The "Lively" part) ---
    onSnapshot(stateDocRef, (docSnap) => {
        if (docSnap.exists()) {
            state = docSnap.data();
            updateUI();
        } else {
            // Initialize database with default state if it doesn't exist
            setDoc(stateDocRef, defaultState);
        }
    });

    const saveState = async () => {
        try {
            await setDoc(stateDocRef, state);
        } catch (e) {
            console.error("Error saving to Firebase:", e);
        }
    };

    // Navigation Logic
    window.switchView = (viewId, element) => {
        document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
        const targetView = document.getElementById(`view-${viewId}`);
        if (targetView) targetView.classList.add('active');

        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        if (element) element.classList.add('active');
    };

    // Date/Countdown Logic
    const eventDate = new Date('2026-02-01T00:00:00');
    const updateCountdown = () => {
        const now = new Date();
        const diff = eventDate - now;
        const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));

        if (document.getElementById('days')) {
            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
            document.getElementById('mins').textContent = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
            document.getElementById('secs').textContent = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
        }
        const countdownSidebar = document.getElementById('countdown-sidebar');
        if (countdownSidebar) countdownSidebar.textContent = diff > 0 ? `${days} Days to Go` : "EVENT LIVE";
        return days || 1;
    };

    const updateUI = () => {
        const daysLeft = updateCountdown();
        updateMetricCard('stalls', state.sold.stalls, state.targets.stalls, daysLeft);
        updateMetricCard('tickets', state.sold.tickets, state.targets.tickets, daysLeft);
        updateMetricCard('sponsorship', state.sold.sponsorship, state.targets.sponsorship, daysLeft);
        updateMetricCard('reels', state.sold.reels, state.targets.reels, daysLeft);

        renderSponsors();
        renderTeam();
        renderAdminTeamControls();
        updateAdminForm();
    };

    const updateMetricCard = (id, sold, target, daysLeft) => {
        const card = document.getElementById(`${id}-stat`);
        if (!card) return;
        const percentage = Math.min((sold / target) * 100, 100);
        const remaining = Math.max(0, target - sold);
        const perDay = Math.ceil(remaining / daysLeft);

        card.querySelector('.metric-value').textContent = sold;
        card.querySelector('.metric-target').textContent = `/ ${target}`;
        card.querySelector('.progress-fill').style.width = `${percentage}%`;
        card.querySelector('.per-day').textContent = `${perDay}/day req.`;

        const alertText = card.querySelector('.alert-text');
        if (percentage < 15) {
            alertText.textContent = 'Critical';
            alertText.className = 'badge-status status-critical alert-text';
        } else {
            alertText.textContent = 'Healthy';
            alertText.className = 'badge-status status-track alert-text';
        }
    };

    const renderSponsors = () => {
        const list = document.getElementById('sponsor-list');
        if (!list) return;
        list.innerHTML = state.sponsors.length ? state.sponsors.map((s, index) => `
            <tr>
                <td><strong>${s.name}</strong></td>
                <td><span class="badge bg-secondary tiny" style="font-size:0.6rem;">${s.category}</span></td>
                <td>${s.owner}</td>
                <td>₹${parseInt(s.value).toLocaleString()}</td>
                <td><span class="badge-status status-track">Lead</span></td>
                <td><button onclick="deleteSponsor(${index})" class="btn btn-sm btn-outline-danger border-0">×</button></td>
            </tr>
        `).join('') : '<tr><td colspan="6" class="text-center text-white py-4" style="opacity: 0.5;">No leads recorded yet.</td></tr>';
    };

    const renderTeam = () => {
        const grid = document.getElementById('team-grid');
        if (!grid) return;
        grid.innerHTML = state.team.map(m => `
            <div class="col-md-4">
                <div class="metric-card h-100">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div class="d-flex align-items-center">
                            <div style="width: 40px; height: 40px; background: rgba(112, 48, 239, 0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; border: 1px solid rgba(112, 48, 239, 0.2);">
                                <i class="fa fa-user" style="color: var(--secondary); font-size: 0.9rem;"></i>
                            </div>
                            <h6 class="mb-0" style="font-weight: 600; letter-spacing: -0.2px; color: #fff;">${m.name}</h6>
                        </div>
                        <span class="badge-status ${m.status === 'Behind' || m.status === 'Critical' || m.status === 'Delay' ? 'status-critical' : 'status-track'}" style="font-size: 0.6rem;">${m.status}</span>
                    </div>
                    <div class="mb-4">
                        ${m.tasks.map(t => `<div class="small text-white mb-2 d-flex align-items-center" style="opacity: 0.8;"><i class="fa fa-circle me-2" style="font-size: 4px; color: var(--secondary);"></i> ${t}</div>`).join('')}
                    </div>
                    <div style="margin-top: auto;">
                        <div class="progress-tiny"><div class="progress-fill" style="width: ${m.progress}%"></div></div>
                        <div class="d-flex justify-content-between mt-2">
                             <small class="text-white uppercase" style="font-size: 10px; font-weight: 500; opacity: 0.6;">Efficiency</small>
                             <small style="color: var(--secondary); font-weight: 600; font-size: 10px;">${m.progress}%</small>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    };

    const renderAdminTeamControls = () => {
        const adminGrid = document.getElementById('admin-team-controls');
        if (!adminGrid) return;
        adminGrid.innerHTML = state.team.map((m, index) => `
            <div class="col-md-6 col-lg-4">
                <div class="p-3" style="background: rgba(255,255,255,0.02); border-radius: 16px; border: 1px solid var(--glass-border);">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h6 class="text-white mb-0 uppercase" style="font-size: 0.7rem; letter-spacing: 1.5px;">${m.name}</h6>
                        <select onchange="window.updateTeamStatus(${index}, this.value)" class="form-select w-auto py-1 px-2" style="font-size: 0.65rem; background: rgba(0,0,0,0.3) !important; border: 1px solid var(--glass-border) !important;">
                            <option value="On Track" ${m.status === 'On Track' ? 'selected' : ''}>On Track</option>
                            <option value="Behind" ${m.status === 'Behind' ? 'selected' : ''}>Behind</option>
                            <option value="Critical" ${m.status === 'Critical' ? 'selected' : ''}>Critical</option>
                            <option value="Delay" ${m.status === 'Delay' ? 'selected' : ''}>Delay</option>
                        </select>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                        <div class="flex-grow-1">
                            <input type="range" min="0" max="100" value="${m.progress}" 
                                onchange="window.updateTeamEfficiency(${index}, this.value)" 
                                class="form-range" style="accent-color: var(--primary);">
                        </div>
                        <span class="text-white" style="font-size: 0.8rem; font-weight: 700; min-width: 40px;">${m.progress}%</span>
                    </div>
                </div>
            </div>
        `).join('');
    };

    const updateAdminForm = () => {
        const fields = ['stalls', 'tickets', 'sponsorship', 'reels'];
        fields.forEach(f => {
            const targetInput = document.getElementById(`target-${f}`);
            const soldInput = document.getElementById(`sold-${f}`);
            if (targetInput) targetInput.value = state.targets[f] || 0;
            if (soldInput) soldInput.value = state.sold[f] || 0;
        });
    };

    // Global Actions (Attached to window for HTML accessibility)
    window.toggleAddSponsor = () => {
        const area = document.getElementById('sponsor-form-area');
        if (area) area.style.display = area.style.display === 'none' ? 'block' : 'none';
    };

    window.addSponsor = (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        state.sponsors.push({
            name: fd.get('name'),
            category: fd.get('category'),
            value: fd.get('value'),
            owner: fd.get('owner')
        });
        state.sold.sponsorship = state.sponsors.length;
        saveState();
        e.target.reset();
        window.toggleAddSponsor();
    };

    window.deleteSponsor = (index) => {
        if (confirm('Delete this sponsor lead?')) {
            state.sponsors.splice(index, 1);
            state.sold.sponsorship = state.sponsors.length;
            saveState();
        }
    };

    window.updateTeamEfficiency = (index, value) => {
        state.team[index].progress = parseInt(value);
        saveState(); // Firebase will push update to everyone
    };

    window.updateTeamStatus = (index, value) => {
        state.team[index].status = value;
        saveState();
    };

    window.updateNumbers = () => {
        const fields = ['stalls', 'tickets', 'sponsorship', 'reels'];
        fields.forEach(f => {
            const tInput = document.getElementById(`target-${f}`);
            const sInput = document.getElementById(`sold-${f}`);
            if (tInput) state.targets[f] = parseInt(tInput.value) || 0;
            if (sInput) state.sold[f] = parseInt(sInput.value) || 0;
        });
        saveState();
        alert('Real-time sync initiated across all devices.');
    };

    setInterval(updateCountdown, 1000);
});
