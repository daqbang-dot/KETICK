// ==========================================
// 1. DATA STORAGE & INITIALIZATION
// ==========================================
let crmData = JSON.parse(localStorage.getItem('crm')) || [];
let inventoryData = JSON.parse(localStorage.getItem('inventory')) || [];
let clientData = JSON.parse(localStorage.getItem('clients')) || [];
let historyData = JSON.parse(localStorage.getItem('history')) || [];
let currentBillItems = [];
let currentBillType = "INVOICE";

// ==========================================
// 2. NAVIGATION & UI CONTROL
// ==========================================
function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    renderAll();
}

// ==========================================
// 3. CORE LOGIC (CRM, INVENTORY, CLIENTS)
// ==========================================

// CRM Logic
document.getElementById('crm-form').addEventListener('submit', (e) => {
    e.preventDefault();
    crmData.push({ 
        id: Date.now(), 
        name: document.getElementById('lead-name').value, 
        status: document.getElementById('lead-status').value 
    });
    saveAndRender();
    e.target.reset();
});

// Inventory Logic
document.getElementById('inv-form').addEventListener('submit', (e) => {
    e.preventDefault();
    inventoryData.push({ 
        id: Date.now(), 
        item: document.getElementById('item-name').value, 
        qty: document.getElementById('item-qty').value, 
        price: document.getElementById('item-price').value 
    });
    saveAndRender();
    e.target.reset();
});

// Client Logic
document.getElementById('client-form').addEventListener('submit', (e) => {
    e.preventDefault();
    clientData.push({ 
        id: Date.now(), 
        name: document.getElementById('client-name').value, 
        email: document.getElementById('client-email').value, 
        phone: document.getElementById('client-phone').value 
    });
    saveAndRender();
    e.target.reset();
});

// ==========================================
// 4. BILLING & DOCUMENT LOGIC
// ==========================================

// Update paparan pelanggan bila dropdown berubah
document.getElementById('bill-client-select').addEventListener('change', function() {
    const clientIndex = this.value;
    const displayArea = document.getElementById('bill-client-display');
    
    if (clientIndex !== "") {
        const client = clientData[clientIndex];
        displayArea.innerHTML = `
            <strong>${client.name}</strong><br>
            Email: ${client.email}<br>
            Tel: ${client.phone}
        `;
    } else {
        displayArea.innerText = "Sila pilih pelanggan...";
    }
});

function setBillType(type) {
    currentBillType = type;
    document.getElementById('bill-type').innerText = type;
    const billArea = document.getElementById('billing-print-area');
    if(type === 'QUOTATION') billArea.style.borderColor = "#f39c12";
    else if(type === 'RECEIPT') billArea.style.borderColor = "#27ae60";
    else billArea.style.borderColor = "#2980b9";
}

function addToBill() {
    const itemIndex = document.getElementById('bill-item-select').value;
    const selectedItem = inventoryData[itemIndex];
    if (selectedItem) {
        currentBillItems.push({
            item: selectedItem.item,
            price: parseFloat(selectedItem.price)
        });
        renderBillingTable();
    } else {
        alert("Sila pilih item!");
    }
}

function renderBillingTable() {
    const list = document.getElementById('bill-items-list');
    let total = 0;
    list.innerHTML = currentBillItems.map((i, index) => {
        total += i.price;
        return `<tr>
            <td>${i.item}</td>
            <td>RM ${i.price.toFixed(2)}</td>
            <td class="no-print"><button onclick="removeFromBill(${index})" style="background:#e74c3c; padding:2px 5px;">X</button></td>
        </tr>`;
    }).join('');
    document.getElementById('bill-total').innerText = total.toFixed(2);
}

function removeFromBill(index) {
    currentBillItems.splice(index, 1);
    renderBillingTable();
}

function generateDocument(type) {
    const clientIndex = document.getElementById('bill-client-select').value;
    if (clientIndex === "" || currentBillItems.length === 0) {
        alert("Sila pilih pelanggan dan tambah item!");
        return;
    }

    const client = clientData[clientIndex];
    const totalAmount = document.getElementById('bill-total').innerText;

    // --- LOGIK NOMBOR RUJUKAN BERMULA 1001 ---
    // Kira berapa banyak dokumen jenis tersebut yang sudah ada dalam history
    const count = historyData.filter(h => h.type === type).length;
    const nextNo = 1001 + count;
    
    let prefix = "INV";
    if(type === 'QUOTATION') prefix = "QUO";
    if(type === 'RECEIPT') prefix = "REC";
    
    const docNo = `${prefix}${nextNo}`;

    // 1. Update UI Dokumen
    setBillType(type);
    document.getElementById('bill-ref-no').innerText = docNo;
    document.getElementById('bill-client-display').innerHTML = `<strong>${client.name}</strong><br>Email: ${client.email}<br>Tel: ${client.phone}`;
    document.getElementById('bill-date').innerText = new Date().toLocaleDateString('ms-MY');

    // 2. Simpan ke History
    historyData.push({
        id: Date.now(),
        date: new Date().toLocaleDateString('ms-MY'),
        time: new Date().toLocaleTimeString('ms-MY'),
        type: type,
        docNo: docNo,
        clientName: client.name,
        amount: totalAmount,
        items: [...currentBillItems]
    });
    localStorage.setItem('history', JSON.stringify(historyData));

    // 3. Proses Cetak
    setTimeout(() => {
        window.print();
        if(type === 'RECEIPT') {
            currentBillItems = [];
            renderBillingTable();
        }
        renderAll();
    }, 300);
}

// Tambah fungsi untuk Dashboard
function updateDashboard() {
    let totalSales = 0;
    let recCount = 0;
    let quoCount = 0;

    historyData.forEach(h => {
        if(h.type === 'RECEIPT' || h.type === 'INVOICE') {
            totalSales += parseFloat(h.amount);
        }
        if(h.type === 'RECEIPT') recCount++;
        if(h.type === 'QUOTATION') quoCount++;
    });

    document.getElementById('dash-total-sales').innerText = totalSales.toFixed(2);
    document.getElementById('dash-total-rec').innerText = recCount;
    document.getElementById('dash-total-quo').innerText = quoCount;
}

// Pastikan renderAll memanggil updateDashboard
function renderAll() {
    // ... kod render CRM, Inventory, Client yang sedia ada ...
    
    // Kemaskini Dropdowns
    const clientSelect = document.getElementById('bill-client-select');
    if(clientSelect) {
        const currentVal = clientSelect.value;
        clientSelect.innerHTML = '<option value="">-- Pilih Pelanggan --</option>' + 
            clientData.map((d, i) => `<option value="${i}">${d.name}</option>`).join('');
        clientSelect.value = currentVal;
    }

    // Panggil Dashboard & History
    updateDashboard();
    renderHistory();
}
    // 1. Update UI Dokumen
    setBillType(type);
    document.getElementById('bill-client-display').innerHTML = `<strong>${client.name}</strong><br>Email: ${client.email}<br>Tel: ${client.phone}`;
    document.getElementById('bill-date').innerText = new Date().toLocaleDateString('ms-MY');

    // 2. Simpan ke History
    historyData.push({
        id: Date.now(),
        date: new Date().toLocaleDateString('ms-MY'),
        time: new Date().toLocaleTimeString('ms-MY'),
        type: type,
        docNo: docNo,
        clientName: client.name,
        amount: totalAmount,
        items: [...currentBillItems]
    });
    localStorage.setItem('history', JSON.stringify(historyData));

    // 3. Proses Cetak
    setTimeout(() => {
        window.print();
        if(type === 'RECEIPT') {
            currentBillItems = [];
            renderBillingTable();
        }
        renderAll();
    }, 300);
}

// ==========================================
// 5. HISTORY MANAGEMENT
// ==========================================
function renderHistory() {
    const list = document.getElementById('history-list');
    if(!list) return;
    const sortedHistory = [...historyData].reverse();
    list.innerHTML = sortedHistory.map(h => `
        <tr>
            <td>${h.date} <br><small>${h.time}</small></td>
            <td><span class="badge ${h.type.toLowerCase()}">${h.type}</span></td>
            <td>${h.docNo}</td>
            <td>${h.clientName}</td>
            <td><strong>RM ${h.amount}</strong></td>
            <td>
                <button onclick="viewHistoryItem(${h.id})" style="background:#3498db; padding:5px;">Lihat</button>
                <button onclick="deleteHistoryItem(${h.id})" style="background:#e74c3c; padding:5px;">Hapus</button>
            </td>
        </tr>
    `).join('');
}

function deleteHistoryItem(id) {
    if(confirm("Padam rekod ini?")) {
        historyData = historyData.filter(h => h.id !== id);
        localStorage.setItem('history', JSON.stringify(historyData));
        renderAll();
    }
}

function clearHistory() {
    if(confirm("Padam SEMUA sejarah?")) {
        historyData = [];
        localStorage.setItem('history', JSON.stringify(historyData));
        renderAll();
    }
}

function viewHistoryItem(id) {
    const record = historyData.find(h => h.id === id);
    if(record) {
        currentBillItems = record.items;
        showSection('billing');
        setBillType(record.type);
        renderBillingTable();
        alert("Rekod dimuatkan. Anda boleh cetak semula.");
    }
}

// ==========================================
// 6. RENDER & SAVE DATA
// ==========================================
function renderAll() {
    // Render Tables
    document.getElementById('crm-list').innerHTML = crmData.map(d => `<tr><td>${d.name}</td><td>${d.status}</td><td><button onclick="deleteItem('crm', ${d.id})">Padam</button></td></tr>`).join('');
    document.getElementById('inv-list').innerHTML = inventoryData.map(d => `<tr><td>${d.item}</td><td>${d.qty}</td><td>RM ${parseFloat(d.price).toFixed(2)}</td><td><button onclick="deleteItem('inventory', ${d.id})">Padam</button></td></tr>`).join('');
    document.getElementById('client-list').innerHTML = clientData.map(d => `<tr><td>${d.name}</td><td>${d.email}</td><td>${d.phone}</td><td><button onclick="deleteItem('clients', ${d.id})">Padam</button></td></tr>`).join('');

    // Update Dropdowns
    const clientSelect = document.getElementById('bill-client-select');
    const currentClientVal = clientSelect.value;
    clientSelect.innerHTML = '<option value="">-- Pilih Pelanggan --</option>' + clientData.map((d, i) => `<option value="${i}">${d.name}</option>`).join('');
    clientSelect.value = currentClientVal;

    const itemSelect = document.getElementById('bill-item-select');
    itemSelect.innerHTML = '<option value="">-- Pilih Item --</option>' + inventoryData.map((d, i) => `<option value="${i}">${d.item} (RM ${parseFloat(d.price).toFixed(2)})</option>`).join('');

    renderHistory();
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

// Jalankan sistem
renderAll();
