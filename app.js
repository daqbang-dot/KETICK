// ==========================================
// 1. DATA INITIALIZATION
// ==========================================
let companyProfile = JSON.parse(localStorage.getItem('companyProfile')) || { name:'', reg:'', address:'', phone:'', logo:'', stamp:'' };
let crmData = JSON.parse(localStorage.getItem('crm')) || [];
let inventoryData = JSON.parse(localStorage.getItem('inventory')) || [];
let clientData = JSON.parse(localStorage.getItem('clients')) || [];
let historyData = JSON.parse(localStorage.getItem('history')) || [];
let currentBillItems = [];

// ==========================================
// 2. PROFIL & SYNC (IMPORT/EXPORT)
// ==========================================
function handleFileUpload(event, type) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        if (type === 'logo') companyProfile.logo = e.target.result;
        if (type === 'stamp') companyProfile.stamp = e.target.result;
    };
    if (file) reader.readAsDataURL(file);
}

function saveCompanyProfile() {
    companyProfile.name = document.getElementById('conf-name').value;
    companyProfile.reg = document.getElementById('conf-reg').value;
    companyProfile.address = document.getElementById('conf-address').value;
    companyProfile.phone = document.getElementById('conf-phone').value;
    localStorage.setItem('companyProfile', JSON.stringify(companyProfile));
    alert("Profil Disimpan!");
    renderAll();
}

function exportData() {
    const data = { companyProfile, crmData, inventoryData, clientData, historyData };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `MyBiz_Backup.json`;
    a.click();
}

function importData(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        const data = JSON.parse(e.target.result);
        Object.keys(data).forEach(key => localStorage.setItem(key === 'crmData'?'crm':key === 'inventoryData'?'inventory':key === 'clientData'?'clients':key, JSON.stringify(data[key])));
        location.reload();
    };
    reader.readAsText(file);
}

// ==========================================
// 3. WHATSAPP AUTOPILOT
// ==========================================
async function startWhatsAppAutopilot() {
    const rawMsg = document.getElementById('wa-message').value;
    const delay = parseInt(document.getElementById('wa-delay').value) * 1000;
    const status = document.getElementById('wa-status');

    for (let i = 0; i < clientData.length; i++) {
        const c = clientData[i];
        if (!c.phone) continue;
        status.innerText = `Blast ke ${c.name}...`;
        let msg = rawMsg.replace(/{nama}/g, c.name);
        let phone = c.phone.replace(/\D/g, '');
        if(!phone.startsWith('6')) phone = '6' + phone;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
        if (i < clientData.length - 1) await new Promise(r => setTimeout(r, delay));
    }
    status.innerText = "🚀 Selesai!";
}

// ==========================================
// 4. INVENTORY & EDIT FUNCTION
// ==========================================
document.getElementById('inv-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const editId = document.getElementById('edit-id').value;
    const item = {
        id: editId == "-1" ? Date.now() : parseInt(editId),
        item: document.getElementById('item-name').value,
        desc: document.getElementById('item-desc').value,
        qty: parseInt(document.getElementById('item-qty').value),
        price: parseFloat(document.getElementById('item-price').value)
    };

    if (editId == "-1") inventoryData.push(item);
    else {
        const idx = inventoryData.findIndex(i => i.id == editId);
        inventoryData[idx] = item;
    }
    document.getElementById('edit-id').value = "-1";
    document.getElementById('inv-btn').innerText = "Tambah Stok";
    e.target.reset();
    saveAndRender();
});

function editProduct(id) {
    const p = inventoryData.find(i => i.id == id);
    document.getElementById('item-name').value = p.item;
    document.getElementById('item-desc').value = p.desc;
    document.getElementById('item-qty').value = p.qty;
    document.getElementById('item-price').value = p.price;
    document.getElementById('edit-id').value = id;
    document.getElementById('inv-btn').innerText = "Simpan Perubahan";
}

// ==========================================
// 5. BILLING & AUTOMATIC STOCK DEDUCTION
// ==========================================
function addToBill() {
    const idx = document.getElementById('bill-item-select').value;
    const item = inventoryData[idx];
    if (item) {
        currentBillItems.push({ ...item, originalIdx: idx });
        renderBillingTable();
    }
}

function renderBillingTable() {
    const list = document.getElementById('bill-items-list');
    let total = 0;
    list.innerHTML = currentBillItems.map((i, idx) => {
        total += i.price;
        return `<tr><td>${i.item}</td><td>RM ${i.price.toFixed(2)}</td><td class="no-print"><button onclick="removeFromBill(${idx})">X</button></td></tr>`;
    }).join('');
    document.getElementById('bill-total').innerText = total.toFixed(2);
}

function generateDocument(type) {
    const clientIdx = document.getElementById('bill-client-select').value;
    if (!clientIdx || currentBillItems.length === 0) return alert("Pilih client & item!");

    // AUTOMATION: Potong Stok jika Invois/Resit
    if (type !== 'QUOTATION') {
        for (let bItem of currentBillItems) {
            const invItem = inventoryData.find(i => i.item === bItem.item);
            if (invItem) {
                if (invItem.qty <= 0) return alert(`Stok ${invItem.item} sudah habis!`);
                invItem.qty -= 1; // Kurangkan 1 unit per item
            }
        }
    }

    // Set Header Data
    document.getElementById('bill-type').innerText = type;
    document.getElementById('print-comp-name').innerText = companyProfile.name;
    if(companyProfile.logo) { document.getElementById('print-logo').src = companyProfile.logo; document.getElementById('print-logo').style.display='block'; }
    if(companyProfile.stamp) { document.getElementById('print-stamp').src = companyProfile.stamp; document.getElementById('print-stamp').style.display='block'; }
    
    // Simpan Sejarah
    const docNo = `${type.slice(0,3)}${Date.now().toString().slice(-4)}`;
    historyData.push({ id:Date.now(), date:new Date().toLocaleDateString(), type, docNo, clientName: clientData[clientIdx].name, amount: document.getElementById('bill-total').innerText });
    
    saveAndRender();
    setTimeout(() => { window.print(); }, 500);
}

// ==========================================
// 6. RENDER LOGIC
// ==========================================
function renderAll() {
    document.getElementById('inv-list').innerHTML = inventoryData.map(d => `<tr><td>${d.item} (Stok: ${d.qty})</td><td>${d.qty}</td><td>RM ${d.price.toFixed(2)}</td><td><button onclick="editProduct(${d.id})">Edit</button></td></tr>`).join('');
    document.getElementById('crm-list').innerHTML = crmData.map(d => `<tr><td>${d.name}</td><td>${d.status}</td><td><button onclick="deleteItem('crm', ${d.id})">X</button></td></tr>`).join('');
    document.getElementById('client-list').innerHTML = clientData.map(d => `<tr><td>${d.name}</td><td>${d.phone}</td><td><button onclick="deleteItem('clients', ${d.id})">X</button></td></tr>`).join('');
    
    document.getElementById('bill-client-select').innerHTML = '<option value="">-- Pilih --</option>' + clientData.map((c,i) => `<option value="${i}">${c.name}</option>`).join('');
    document.getElementById('bill-item-select').innerHTML = '<option value="">-- Pilih --</option>' + inventoryData.map((n,i) => `<option value="${i}">${n.item} (Tinggal ${n.qty})</option>`).join('');
    
    updateDashboard();
    renderHistory();
}

function saveAndRender() {
    localStorage.setItem('inventory', JSON.stringify(inventoryData));
    localStorage.setItem('history', JSON.stringify(historyData));
    localStorage.setItem('clients', JSON.stringify(clientData));
    localStorage.setItem('crm', JSON.stringify(crmData));
    renderAll();
}

function updateDashboard() {
    let total = 0;
    historyData.forEach(h => { if(h.type !== 'QUOTATION') total += parseFloat(h.amount); });
    document.getElementById('dash-total-sales').innerText = total.toFixed(2);
}

function renderHistory() {
    document.getElementById('history-list').innerHTML = historyData.map(h => `<tr><td>${h.date}</td><td>${h.docNo}</td><td>${h.clientName}</td><td>RM ${h.amount}</td><td><button onclick="deleteHistoryItem(${h.id})">X</button></td></tr>`).join('');
}

function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

renderAll();
