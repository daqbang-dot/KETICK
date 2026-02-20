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
// 3. CORE LOGIC (CRM & CLIENTS)
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
// 4. INVENTORY LOGIC (DENGAN DESCRIPTION)
// ==========================================
document.getElementById('inv-form').addEventListener('submit', (e) => {
    e.preventDefault();
    inventoryData.push({ 
        id: Date.now(), 
        item: document.getElementById('item-name').value, 
        desc: document.getElementById('item-desc').value, // Simpan description
        qty: document.getElementById('item-qty').value, 
        price: document.getElementById('item-price').value 
    });
    saveAndRender();
    e.target.reset();
});

// ==========================================
// 5. BILLING & DOCUMENT LOGIC
// ==========================================

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
            desc: selectedItem.desc || "", // Masukkan desc ke dalam bill
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
            <td>
                <strong>${i.item}</strong><br>
                <small style="color:#666;">${i.desc}</small> 
            </td>
            <td>RM ${i.price.toFixed(2)}</td>
            <td class="no-print">
                <button onclick="removeFromBill(${index})" style="background:#e74c3c; padding:2px 5px; color:white; border:none; cursor:pointer; border-radius:3px;">X</button>
            </td>
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

    // Logik Nombor Rujukan
    const count = historyData.filter(h => h.type === type).length;
    const nextNo = 1001 + count;
    let prefix = type === 'QUOTATION' ? "QUO" : (type === 'RECEIPT' ? "REC" : "INV");
    const docNo = `${prefix}${nextNo}`;

    // Update UI
    setBillType(type);
    document.getElementById('bill-ref-no').innerText = docNo;
    document.getElementById('bill-date').innerText = new Date().toLocaleDateString('ms-MY');
    document.getElementById('bill-client-display').innerHTML = `<strong>${client.name}</strong><br>${client.email}<br>${client.phone}`;

    // Simpan ke History
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
// 6. DASHBOARD & HISTORY
// ==========================================
function updateDashboard() {
    let totalSales = 0, recCount = 0, quoCount = 0;
    historyData.forEach(h => {
        if(h.type === 'RECEIPT' || h.type === 'INVOICE') totalSales += parseFloat(h.amount);
        if(h.type === 'RECEIPT') recCount++;
        if(h.type === 'QUOTATION') quoCount++;
    });
    if(document.getElementById('dash-total-sales')) {
        document.getElementById('dash-total-sales').innerText = totalSales.toFixed(2);
        document.getElementById('dash-total-rec').innerText = recCount;
        document.getElementById('dash-total-quo').innerText = quoCount;
    }
}

function renderHistory() {
    const list = document.getElementById('history-list');
    if(!list) return;
    list.innerHTML = [...historyData].reverse().map(h => `
        <tr>
            <td>${h.date}</td>
            <td><span class="badge ${h.type.toLowerCase()}">${h.type}</span></td>
            <td>${h.docNo}</td>
            <td>${h.clientName}</td>
            <td>RM ${h.amount}</td>
            <td>
                <button onclick="viewHistoryItem(${h.id})" style="background:#3498db; padding:5px; color:white; border:none; border-radius:3px; cursor:pointer;">Lihat</button>
                <button onclick="deleteHistoryItem(${h.id})" style="background:#e74c3c; padding:5px; color:white; border:none; border-radius:3px; cursor:pointer;">Hapus</button>
            </td>
        </tr>
    `).join('');
}

// ==========================================
// 7. RENDER ALL & SAVE
// ==========================================
function renderAll() {
    // Render CRM
    document.getElementById('crm-list').innerHTML = crmData.map(d => `<tr><td>${d.name}</td><td>${d.status}</td><td><button onclick="deleteItem('crm', ${d.id})">Padam</button></td></tr>`).join('');
    
    // Render Inventory (Dengan Description)
    const invList = document.getElementById('inv-list');
    if(invList) {
        invList.innerHTML = inventoryData.map(d => `
            <tr>
                <td>${d.item}</td>
                <td><small>${d.desc || '-'}</small></td>
                <td>${d.qty}</td>
                <td>RM ${parseFloat(d.price).toFixed(2)}</td>
                <td><button onclick="deleteItem('inventory', ${d.id})">Padam</button></td>
            </tr>`).join('');
    }

    // Render Clients
    document.getElementById('client-list').innerHTML = clientData.map(d => `<tr><td>${d.name}</td><td>${d.email}</td><td>${d.phone}</td><td><button onclick="deleteItem('clients', ${d.id})">Padam</button></td></tr>`).join('');

    // Update Dropdowns
    const clientSelect = document.getElementById('bill-client-select');
    if(clientSelect) {
        const currentVal = clientSelect.value;
        clientSelect.innerHTML = '<option value="">-- Pilih Pelanggan --</option>' + clientData.map((d, i) => `<option value="${i}">${d.name}</option>`).join('');
        clientSelect.value = currentVal;
    }

    const itemSelect = document.getElementById('bill-item-select');
    if(itemSelect) {
        itemSelect.innerHTML = '<option value="">-- Pilih Item --</option>' + 
            inventoryData.map((d, i) => `<option value="${i}">${d.item} ${d.desc ? '('+d.desc+')' : ''}</option>`).join('');
    }

    updateDashboard();
    renderHistory();
}

function deleteItem(type, id) {
    if (type === 'crm') crmData = crmData.filter(i => i.id !== id);
    else if (type === 'inventory') inventoryData = inventoryData.filter(i => i.id !== id);
    else if (type === 'clients') clientData = clientData.filter(i => i.id !== id);
    saveAndRender();
}

function deleteHistoryItem(id) {
    if(confirm("Padam rekod ini?")) {
        historyData = historyData.filter(h => h.id !== id);
        localStorage.setItem('history', JSON.stringify(historyData));
        renderAll();
    }
}

function saveAndRender() {
    localStorage.setItem('crm', JSON.stringify(crmData));
    localStorage.setItem('inventory', JSON.stringify(inventoryData));
    localStorage.setItem('clients', JSON.stringify(clientData));
    renderAll();
}

// Mula Sistem
renderAll();
