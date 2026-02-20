// ==========================================
// 1. DATA STORAGE & INITIALIZATION
// ==========================================
let companyProfile = JSON.parse(localStorage.getItem('companyProfile')) || {
    name: '', reg: '', address: '', phone: '', logo: '', stamp: ''
};
// Tambah storage untuk Autosave Bank & Remark
let bankSettings = JSON.parse(localStorage.getItem('bankSettings')) || {
    bankName: '', accNo: '', holder: '', remark: ''
};

let crmData = JSON.parse(localStorage.getItem('crm')) || [];
let inventoryData = JSON.parse(localStorage.getItem('inventory')) || [];
let clientData = JSON.parse(localStorage.getItem('clients')) || [];
let historyData = JSON.parse(localStorage.getItem('history')) || [];
let currentBillItems = [];
let currentBillType = "INVOICE";

// ==========================================
// 2. FUNGSI PROFIL & AUTOSAVE BANK
// ==========================================
function saveCompanyProfile() {
    companyProfile = {
        name: document.getElementById('conf-name').value,
        reg: document.getElementById('conf-reg').value,
        address: document.getElementById('conf-address').value,
        phone: document.getElementById('conf-phone').value,
        logo: document.getElementById('conf-logo').value,
        stamp: document.getElementById('conf-stamp').value
    };
    localStorage.setItem('companyProfile', JSON.stringify(companyProfile));
    alert("Profil berjaya disimpan!");
    renderAll();
}

// Fungsi Autosave: Dipanggil setiap kali user menaip di ruangan bank/remark
function autoSaveBank() {
    const settings = {
        bankName: document.getElementById('bill-bank-name').value,
        accNo: document.getElementById('bill-bank-acc').value,
        holder: document.getElementById('bill-bank-holder').value,
        remark: document.getElementById('bill-remark').value
    };
    localStorage.setItem('bankSettings', JSON.stringify(settings));
}

// ==========================================
// 3. NAVIGATION & UI CONTROL
// ==========================================
function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    renderAll();
}

// ==========================================
// 4. CORE LOGIC (CRM, CLIENTS, INVENTORY)
// ==========================================
document.getElementById('crm-form').addEventListener('submit', (e) => {
    e.preventDefault();
    crmData.push({ id: Date.now(), name: document.getElementById('lead-name').value, status: document.getElementById('lead-status').value });
    saveAndRender(); e.target.reset();
});

document.getElementById('client-form').addEventListener('submit', (e) => {
    e.preventDefault();
    clientData.push({ id: Date.now(), name: document.getElementById('client-name').value, email: document.getElementById('client-email').value, phone: document.getElementById('client-phone').value });
    saveAndRender(); e.target.reset();
});

document.getElementById('inv-form').addEventListener('submit', (e) => {
    e.preventDefault();
    inventoryData.push({ 
        id: Date.now(), 
        item: document.getElementById('item-name').value, 
        desc: document.getElementById('item-desc').value, 
        qty: document.getElementById('item-qty').value, 
        price: document.getElementById('item-price').value 
    });
    saveAndRender(); e.target.reset();
});

// ==========================================
// 5. BILLING LOGIC
// ==========================================
function setBillType(type) {
    currentBillType = type;
    document.getElementById('bill-type').innerText = type;
}

function addToBill() {
    const itemIndex = document.getElementById('bill-item-select').value;
    const selectedItem = inventoryData[itemIndex];
    if (selectedItem) {
        currentBillItems.push({ item: selectedItem.item, desc: selectedItem.desc || "", price: parseFloat(selectedItem.price) });
        renderBillingTable();
    } else { alert("Sila pilih item!"); }
}

function renderBillingTable() {
    const list = document.getElementById('bill-items-list');
    let total = 0;
    list.innerHTML = currentBillItems.map((i, index) => {
        total += i.price;
        return `<tr><td><strong>${i.item}</strong><br><small>${i.desc}</small></td><td>RM ${i.price.toFixed(2)}</td><td class="no-print"><button onclick="removeFromBill(${index})">X</button></td></tr>`;
    }).join('');
    document.getElementById('bill-total').innerText = total.toFixed(2);
}

function removeFromBill(index) {
    currentBillItems.splice(index, 1);
    renderBillingTable();
}

// FIX: Gabungkan logik generateDocument yang pecah tadi
function generateDocument(type) {
    const clientIndex = document.getElementById('bill-client-select').value;
    if (clientIndex === "" || currentBillItems.length === 0) {
        alert("Sila pilih pelanggan dan tambah item!"); return;
    }

    const client = clientData[clientIndex];
    const totalAmount = document.getElementById('bill-total').innerText;

    // 1. Set Profil Syarikat ke Print Area
    document.getElementById('print-comp-name').innerText = companyProfile.name || "Nama Syarikat";
    document.getElementById('print-comp-reg').innerText = "Reg: " + (companyProfile.reg || "-");
    document.getElementById('print-comp-addr').innerText = companyProfile.address || "";
    document.getElementById('print-comp-phone').innerText = "Tel: " + (companyProfile.phone || "");
    
    if(companyProfile.logo) {
        document.getElementById('print-logo').src = companyProfile.logo;
        document.getElementById('print-logo').style.display = 'block';
    }
    if(companyProfile.stamp) {
        document.getElementById('print-stamp').src = companyProfile.stamp;
        document.getElementById('print-stamp').style.display = 'block';
    }

    // 2. Set Bank & Remark
    document.getElementById('display-bank').innerText = document.getElementById('bill-bank-name').value || "-";
    document.getElementById('display-acc').innerText = document.getElementById('bill-bank-acc').value || "-";
    document.getElementById('display-holder').innerText = document.getElementById('bill-bank-holder').value || "-";
    document.getElementById('display-remark').innerText = document.getElementById('bill-remark').value || "-";

    // 3. Nombor Rujukan
    const count = historyData.filter(h => h.type === type).length;
    const nextNo = 1001 + count;
    let prefix = type === 'QUOTATION' ? "QUO" : (type === 'RECEIPT' ? "REC" : "INV");
    const docNo = `${prefix}${nextNo}`;

    document.getElementById('bill-ref-no').innerText = docNo;
    document.getElementById('bill-date').innerText = new Date().toLocaleDateString('ms-MY');
    document.getElementById('bill-client-display').innerHTML = `<strong>${client.name}</strong><br>${client.email || ''}<br>${client.phone || ''}`;

    // 4. Simpan Sejarah
    historyData.push({ id: Date.now(), date: new Date().toLocaleDateString('ms-MY'), type: type, docNo: docNo, clientName: client.name, amount: totalAmount });
    localStorage.setItem('history', JSON.stringify(historyData));

    setTimeout(() => {
        window.print();
        renderAll();
    }, 300);
}

// ==========================================
// 6. DASHBOARD & RENDER
// ==========================================
function renderAll() {
    // Render List (CRM, Inv, Clients) - Kod ringkas
    document.getElementById('crm-list').innerHTML = crmData.map(d => `<tr><td>${d.name}</td><td>${d.status}</td><td><button onclick="deleteItem('crm', ${d.id})">Padam</button></td></tr>`).join('');
    document.getElementById('inv-list').innerHTML = inventoryData.map(d => `<tr><td>${d.item}</td><td><small>${d.desc || '-'}</small></td><td>${d.qty}</td><td>RM ${parseFloat(d.price).toFixed(2)}</td><td><button onclick="deleteItem('inventory', ${d.id})">Padam</button></td></tr>`).join('');
    document.getElementById('client-list').innerHTML = clientData.map(d => `<tr><td>${d.name}</td><td>${d.email}</td><td>${d.phone}</td><td><button onclick="deleteItem('clients', ${d.id})">Padam</button></td></tr>`).join('');

    // Update Dropdowns
    document.getElementById('bill-client-select').innerHTML = '<option value="">-- Pilih --</option>' + clientData.map((d, i) => `<option value="${i}">${d.name}</option>`).join('');
    document.getElementById('bill-item-select').innerHTML = '<option value="">-- Pilih --</option>' + inventoryData.map((d, i) => `<option value="${i}">${d.item} (${d.desc})</option>`).join('');

    updateDashboard();
    renderHistory();
}

function updateDashboard() {
    let totalSales = 0;
    historyData.forEach(h => { if(h.type !== 'QUOTATION') totalSales += parseFloat(h.amount); });
    document.getElementById('dash-total-sales').innerText = totalSales.toFixed(2);
}

function renderHistory() {
    document.getElementById('history-list').innerHTML = [...historyData].reverse().map(h => `<tr><td>${h.date}</td><td>${h.type}</td><td>${h.docNo}</td><td>${h.clientName}</td><td>RM ${h.amount}</td><td><button onclick="deleteHistoryItem(${h.id})">Hapus</button></td></tr>`).join('');
}

function deleteItem(type, id) {
    if (type === 'crm') crmData = crmData.filter(i => i.id !== id);
    else if (type === 'inventory') inventoryData = inventoryData.filter(i => i.id !== id);
    else if (type === 'clients') clientData = clientData.filter(i => i.id !== id);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('crm', JSON.stringify(crmData));
    localStorage.setItem('inventory', JSON.stringify(inventoryData));
    localStorage.setItem('clients', JSON.stringify(clientData));
    renderAll();
}

// LOAD DATA AWAL
function loadAllSettings() {
    // Load Company Profile
    document.getElementById('conf-name').value = companyProfile.name || "";
    document.getElementById('conf-reg').value = companyProfile.reg || "";
    document.getElementById('conf-address').value = companyProfile.address || "";
    document.getElementById('conf-phone').value = companyProfile.phone || "";
    document.getElementById('conf-logo').value = companyProfile.logo || "";
    document.getElementById('conf-stamp').value = companyProfile.stamp || "";

    // Load Bank Autosave
    document.getElementById('bill-bank-name').value = bankSettings.bankName || "";
    document.getElementById('bill-bank-acc').value = bankSettings.accNo || "";
    document.getElementById('bill-bank-holder').value = bankSettings.holder || "";
    document.getElementById('bill-remark').value = bankSettings.remark || "";
}

// Tambah Event Listener untuk Autosave Bank/Remark
['bill-bank-name', 'bill-bank-acc', 'bill-bank-holder', 'bill-remark'].forEach(id => {
    document.getElementById(id).addEventListener('input', autoSaveBank);
});

renderAll();
loadAllSettings();
