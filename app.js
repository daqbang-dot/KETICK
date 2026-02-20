// Data Storage (Local Storage)
let crmData = JSON.parse(localStorage.getItem('crm')) || [];
let inventoryData = JSON.parse(localStorage.getItem('inventory')) || [];
let clientData = JSON.parse(localStorage.getItem('clients')) || [];
let currentBillItems = [];

// 1. NAVIGATION FUNCTION
function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    renderAll();
}

// 2. CRM LOGIC
document.getElementById('crm-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('lead-name').value;
    const status = document.getElementById('lead-status').value;
    crmData.push({ id: Date.now(), name, status });
    saveAndRender();
    e.target.reset();
});

// 3. INVENTORY LOGIC
document.getElementById('inv-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const item = document.getElementById('item-name').value;
    const qty = document.getElementById('item-qty').value;
    const price = document.getElementById('item-price').value;
    inventoryData.push({ id: Date.now(), item, qty, price });
    saveAndRender();
    e.target.reset();
});

// 4. CLIENT LOGIC
document.getElementById('client-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('client-name').value;
    const email = document.getElementById('client-email').value;
    const phone = document.getElementById('client-phone').value;
    clientData.push({ id: Date.now(), name, email, phone });
    saveAndRender();
    e.target.reset();
});

// 5. BILLING LOGIC
function addToBill() {
    const itemIndex = document.getElementById('bill-item-select').value;
    const selectedItem = inventoryData[itemIndex];
    if (selectedItem) {
        currentBillItems.push(selectedItem);
        renderBillingTable();
    }
}

function renderBillingTable() {
    const list = document.getElementById('bill-items-list');
    let total = 0;
    list.innerHTML = currentBillItems.map(i => {
        total += parseFloat(i.price);
        return `<tr><td>${i.item}</td><td>RM ${i.price}</td></tr>`;
    }).join('');
    document.getElementById('bill-total').innerText = total.toFixed(2);
}

function printBill(type) {
    const clientIndex = document.getElementById('bill-client-select').value;
    const client = clientData[clientIndex];
    if (!client) return alert("Sila pilih pelanggan!");
    
    document.getElementById('bill-type').innerText = type;
    document.getElementById('bill-client-display').innerText = client.name;
    document.getElementById('bill-date').innerText = new Date().toLocaleDateString();
    
    window.print();
}

// 6. RENDER DATA TO TABLES
function renderAll() {
    // CRM
    document.getElementById('crm-list').innerHTML = crmData.map(d => `<tr><td>${d.name}</td><td>${d.status}</td><td><button onclick="deleteItem('crm', ${d.id})">Padam</button></td></tr>`).join('');
    
    // Inventory
    document.getElementById('inv-list').innerHTML = inventoryData.map(d => `<tr><td>${d.item}</td><td>${d.qty}</td><td>RM ${d.price}</td><td><button onclick="deleteItem('inventory', ${d.id})">Padam</button></td></tr>`).join('');
    
    // Clients
    document.getElementById('client-list').innerHTML = clientData.map(d => `<tr><td>${d.name}</td><td>${d.email}</td><td>${d.phone}</td></tr>`).join('');

    // Dropdowns for Billing
    document.getElementById('bill-client-select').innerHTML = clientData.map((d, i) => `<option value="${i}">${d.name}</option>`).join('');
    document.getElementById('bill-item-select').innerHTML = inventoryData.map((d, i) => `<option value="${i}">${d.item} (RM ${d.price})</option>`).join('');
}

function deleteItem(type, id) {
    if (type === 'crm') crmData = crmData.filter(i => i.id !== id);
    if (type === 'inventory') inventoryData = inventoryData.filter(i => i.id !== id);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('crm', JSON.stringify(crmData));
    localStorage.setItem('inventory', JSON.stringify(inventoryData));
    localStorage.setItem('clients', JSON.stringify(clientData));
    renderAll();
}

// Initial Run
renderAll();
