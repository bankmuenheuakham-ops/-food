// ຂໍ້ມູນເມນູອາຫານ
const products = [
    { id: 1, name: 'ຕຳໝາກຫຸ່ງ (Tam Mak Hung)', price: 25000, category: 'main', image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500&q=80' },
    { id: 2, name: 'ລາບງົວ / ລາບໝູ (Larb)', price: 55000, category: 'main', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&q=80' },
    { id: 3, name: 'ເຂົ້າປຽກເສັ້ນ (Khao Piak Sen)', price: 35000, category: 'soup', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80' },
    { id: 4, name: 'ຕົ້ມຍຳກຸ້ງ (Tom Yum Kung)', price: 65000, category: 'soup', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80' },
    { id: 5, name: 'ປິ່ງໄກ່ + ເຂົ້າໜຽວ (Ping Kai & Sticky Rice)', price: 45000, category: 'main', image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500&q=80' },
    { id: 6, name: 'ນ້ຳໝາກໄມ້ປັ້ນ (Fruit Smoothie)', price: 20000, category: 'drink', image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&q=80' },
    { id: 7, name: 'ຊາດຳເຢັນ / ຊານົມ (Lao Iced Tea)', price: 18000, category: 'drink', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80' },
    { id: 8, name: 'ແກງໜໍ່ໄມ້ (Keng Nor Mai)', price: 40000, category: 'soup', image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&q=80' }
];

let cart = [];
let currentCategory = 'all';

// ແປງຕົວເລກເປັນສະກຸນເງິນກີບ
function formatKip(amount) {
    return new Intl.NumberFormat('lo-LA').format(amount) + ' ກີບ';
}

// ສະແດງລາຍການອາຫານ
function renderProducts() {
    const grid = document.getElementById('productGrid');
    const searchVal = document.getElementById('searchInput').value.toLowerCase();
    
    grid.innerHTML = '';

    const filtered = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchVal);
        const matchesCat = currentCategory === 'all' || p.category === currentCategory;
        return matchesSearch && matchesCat;
    });

    if (filtered.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm">ບໍ່ພົບເມນູອາຫານທີ່ຄົ້ນຫາ</div>';
        return;
    }

    filtered.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition hover:shadow-md';
        card.innerHTML = `
            <img src="${prod.image}" alt="${prod.name}" class="w-full h-44 object-cover">
            <div class="p-4 flex flex-col flex-grow justify-between">
                <div>
                    <h3 class="font-bold text-gray-800 text-sm mb-1 line-clamp-1">${prod.name}</h3>
                    <p class="text-orange-600 font-bold text-base mb-3">${formatKip(prod.price)}</p>
                </div>
                <button onclick="addToCart(${prod.id})" class="w-full bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white py-2 rounded-lg font-semibold text-xs transition flex items-center justify-center gap-1.5">
                    <i class="fa-solid fa-plus"></i> ເພີ່ມລາຍການນີ້
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ການຕອງໝວດໝູ່
function filterCategory(category) {
    currentCategory = category;
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-orange-600', 'text-white');
        btn.classList.add('bg-gray-100', 'text-gray-700');
    });
    
    if (window.event && window.event.target) {
        const target = window.event.target;
        target.classList.add('active', 'bg-orange-600', 'text-white');
        target.classList.remove('bg-gray-100', 'text-gray-700');
    }
    renderProducts();
}

// ເປີດ / ອັດ ກະຕ່າອາຫານ Slide-in Drawer
function toggleCartModal(show) {
    const drawer = document.getElementById('cartDrawer');
    const backdrop = document.getElementById('cartBackdrop');
    
    if (show) {
        drawer.classList.add('open');
        backdrop.classList.add('open');
    } else {
        drawer.classList.remove('open');
        backdrop.classList.remove('open');
    }
}

// ເພີ່ມອາຫານເຂົ້າກະຕ່າ ແລະ ສະແດງ Slide-in Drawer ທາງຂວາ
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    toggleCartModal(true); // ເປີດໜ້າຕ່າງທາງຂວາທັນທີເມື່ອກົດຊື້
}

// ອັບເດດ UI ກະຕ່າທາງຂວາມື
function updateCartUI() {
    const container = document.getElementById('cartItemsContainer');
    const headerCartCount = document.getElementById('headerCartCount');
    const totalEl = document.getElementById('cartTotal');
    const btnCheckout = document.getElementById('btnCheckout');

    container.innerHTML = '';
    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center text-gray-400 py-12 flex flex-col items-center justify-center">
                <i class="fa-solid fa-basket-shopping text-4xl mb-2 text-gray-300"></i>
                <p class="text-sm">ຍັງບໍ່ມີເມນູອາຫານໃນກະຕ່າ</p>
            </div>
        `;
        btnCheckout.disabled = true;
    } else {
        btnCheckout.disabled = false;
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            count += item.quantity;

            const div = document.createElement('div');
            div.className = 'pt-3 first:pt-0 flex items-center justify-between gap-2';
            div.innerHTML = `
                <div class="flex items-center gap-2.5 min-w-0">
                    <img src="${item.image}" class="w-12 h-12 rounded-lg object-cover flex-shrink-0">
                    <div class="min-w-0">
                        <h4 class="font-bold text-xs text-gray-800 truncate">${item.name}</h4>
                        <span class="text-orange-600 text-xs font-semibold">${formatKip(item.price)}</span>
                    </div>
                </div>
                <div class="flex items-center gap-1.5 flex-shrink-0">
                    <button onclick="changeQty(${index}, -1)" class="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded text-xs font-bold flex items-center justify-center">-</button>
                    <span class="text-xs font-bold w-4 text-center">${item.quantity}</span>
                    <button onclick="changeQty(${index}, 1)" class="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded text-xs font-bold flex items-center justify-center">+</button>
                    <button onclick="removeItem(${index})" class="text-red-400 hover:text-red-600 text-xs ml-1"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            container.appendChild(div);
        });
    }

    headerCartCount.innerText = count;
    totalEl.innerText = formatKip(total);
}

// ປ່ຽນແປງຈຳນວນ
function changeQty(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    updateCartUI();
}

// ລົບລາຍການ
function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// ເປີດ/ອັດ ໜ້າຕ່າງສັ່ງຊື້ (Checkout Modal)
function toggleCheckoutModal(show) {
    const modal = document.getElementById('checkoutModal');
    if (show) modal.classList.remove('hidden');
    else modal.classList.add('hidden');
}

// ເປີດ/ອັດ ໃບບິນ (Invoice Modal)
function toggleInvoiceModal(show) {
    const modal = document.getElementById('invoiceModal');
    if (show) modal.classList.remove('hidden');
    else modal.classList.add('hidden');
}

// ສະແດງຟອມສັ່ງຊື້
function showCheckoutModal() {
    toggleCartModal(false); // ປິດ Drawer ກ່ອນ
    const summaryList = document.getElementById('checkoutSummaryList');
    const checkoutTotal = document.getElementById('checkoutTotal');
    summaryList.innerHTML = '';

    let total = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        summaryList.innerHTML += `
            <div class="flex justify-between">
                <span>${item.name} x ${item.quantity}</span>
                <span class="font-bold">${formatKip(subtotal)}</span>
            </div>
        `;
    });

    checkoutTotal.innerText = formatKip(total);
    toggleCheckoutModal(true);
}

// ຈັດການການສົ່ງຟອມສັ່ງຊື້
function handleOrderSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const address = document.getElementById('custAddress').value;
    const payment = document.querySelector('input[name="paymentMethod"]:checked').value;

    const orderId = 'FOOD-' + Math.floor(100000 + Math.random() * 900000);
    const orderDate = new Date().toLocaleDateString('lo-LA') + ' ' + new Date().toLocaleTimeString('lo-LA');

    document.getElementById('invId').innerText = orderId;
    document.getElementById('invDate').innerText = orderDate;
    document.getElementById('invCustName').innerText = name;
    document.getElementById('invCustPhone').innerText = phone;
    document.getElementById('invCustAddress').innerText = address;
    document.getElementById('invPayment').innerText = payment;

    const itemsBody = document.getElementById('invItemsBody');
    itemsBody.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        itemsBody.innerHTML += `
            <tr class="border-b">
                <td class="p-2 border text-center">${index + 1}</td>
                <td class="p-2 border">${item.name}</td>
                <td class="p-2 border text-right">${formatKip(item.price)}</td>
                <td class="p-2 border text-center">${item.quantity}</td>
                <td class="p-2 border text-right">${formatKip(subtotal)}</td>
            </tr>
        `;
    });

    document.getElementById('invTotal').innerText = formatKip(total);

    toggleCheckoutModal(false);
    document.getElementById('checkoutForm').reset();
    cart = [];
    updateCartUI();
    toggleInvoiceModal(true);
}

// ຄົ້ນຫາ
document.getElementById('searchInput').addEventListener('input', renderProducts);

// ໂຫລດຂໍ້ມູນເລີ່ມຕົ້ນ
renderProducts();
updateCartUI();