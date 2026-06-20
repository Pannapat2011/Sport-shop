// ใช้ const เพราะข้อมูลสินค้าตายตัว ไม่มีการถูกเขียนทับ
    // ข้อมูลสินค้าหลักในระบบ (อัปเกรดเป็น 8 ชิ้น)
            const products = [
                { id: 1, name: "กล่องดนตรีไม้พาสเทล", price: 350, img: "https://picsum.photos/250/200?random=1" },
                { id: 2, name: "สมุดบันทึกปกผ้ามินิมอล", price: 120, img: "https://picsum.photos/250/200?random=2" },
                { id: 3, name: "ปากกาเจลเขียนลื่น", price: 95, img: "https://picsum.photos/250/200?random=3" },
                { id: 4, name: "โคมไฟตั้งโต๊ะถนอมสายตา", price: 290, img: "https://picsum.photos/250/200?random=4" },
                { id: 5, name: "แก้วเก็บความเย็นสไตล์มินิมอล", price: 250, img: "https://picsum.photos/250/200?random=5" },
                { id: 6, name: "ตุ๊กตาหมีขนนุ่มนิ่ม", price: 450, img: "https://picsum.photos/250/200?random=6" },
                { id: 7, name: "เทียนหอมอโรม่า (กลิ่นลาเวนเดอร์)", price: 199, img: "https://picsum.photos/250/200?random=7" },
                { id: 8, name: "กระเป๋าผ้าแคนวาสทรงเกาหลี", price: 150, img: "https://picsum.photos/250/200?random=8" }
            ];


// ใช้ let เพราะ cart จะมีการเปลี่ยนแปลงค่าได้ (push/ลบ/อัปเดต)
// ใช้เทคนิค Short-circuit (|| []) ถ้าใน LocalStorage ไม่มี ให้เป็น Array ว่างไปเลย
let cart = JSON.parse(localStorage.getItem('myCart')) || [];


// ระบบ Navigation สลับหน้า
const navBtns = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');


navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // ล้าง class active ออกให้หมด
        pages.forEach(page => page.classList.remove('active'));
        navBtns.forEach(nav => nav.classList.remove('active'));
       
        // ใส่ class active ให้ตัวที่กด
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});


// ฟังก์ชันเรนเดอร์สินค้า (ใช้ map ช่วยสร้าง HTML string แล้ว join)
const renderProducts = () => {
    const displayArea = document.getElementById('product-list');
   
    displayArea.innerHTML = products.map(p => `
        <div class="card">
            <img src="${p.img}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${p.price} บาท</p>
            <button class="btn-add" onclick="addToCart(${p.id})">
                <i class="fa-solid fa-cart-plus"></i> เพิ่มลงตะกร้า
            </button>
        </div>
    `).join('');
};


// ฟังก์ชันเพิ่มลงตะกร้า
window.addToCart = (productId) => {
    // ใช้ .find() หาของใน products
    const selectedProduct = products.find(p => p.id === productId);
    // ใช้ .find() เช็คว่าของชิ้นนี้มีในตะกร้าหรือยัง
    const existingItem = cart.find(item => item.id === productId);


    if (existingItem) {
        existingItem.quantity += 1; // ถ้ามีแล้ว บวกจำนวนเพิ่ม
    } else {
        // ถ้ายังไม่มี จับยัดลงไปใหม่
        cart.push({ ...selectedProduct, quantity: 1 });
    }


    saveAndRender();
    // ใช้ alert แบบเดิมไปก่อน แต่อนาคตเดี๋ยวพามึงทำเป็น Toast สวยๆ เด้งมุมจอได้นะ
    alert(`เพิ่ม ${selectedProduct.name} ลงตะกร้าแล้ว!`);
};


// ฟังก์ชันแสดงตะกร้าสินค้า
const renderCart = () => {
    const cartContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
   
    // คำนวณยอดรวมด้วย .reduce() แบบล้ำๆ
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceElement.innerText = total.toLocaleString(); // ใส่ comma ให้ตัวเลขสวยๆ


    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div style="text-align:center; padding: 40px; color:#888;">
                <i class="fa-solid fa-basket-shopping" style="font-size: 40px; margin-bottom: 15px; opacity: 0.5;"></i>
                <p>ยังไม่มีสินค้าในตะกร้าครับ ไปช้อปกันเถอะ!</p>
            </div>`;
        return;
    }


    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <strong>${item.name}</strong>
                <span>จำนวน: ${item.quantity} ชิ้น (ชิ้นละ ${item.price} บาท)</span>
            </div>
            <div class="cart-item-action">
                <strong>${(item.price * item.quantity).toLocaleString()} บาท</strong> <br>
                <button class="btn-remove" onclick="removeFromCart(${item.id})">
                    <i class="fa-solid fa-trash"></i> ลบ
                </button>
            </div>
        </div>
    `).join('');
};


// ฟังก์ชันลบสินค้า
window.removeFromCart = (productId) => {
    // ใช้ .filter() กรองเอาเฉพาะตัวที่ id ไม่ตรงกับที่กดลบ (คือเก็บตัวอื่นไว้)
    cart = cart.filter(item => item.id !== productId);
    saveAndRender();
};


// ฟังก์ชันรวบยอด เซฟ + อัปเดต UI (จะได้ไม่เขียนซ้ำซ้อน)
const saveAndRender = () => {
    localStorage.setItem('myCart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
};


// อัปเดตตัวเลขบนตะกร้า
const updateCartBadge = () => {
    const badge = document.getElementById('cart-badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.innerText = totalItems;
};


// จัดการปุ่มสั่งซื้อ
document.querySelector('.checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('ตะกร้าว่างเปล่า! ไปเลือกสินค้าก่อนนะเพื่อน');
        return;
    }
   
    const finalPrice = document.getElementById('total-price').innerText;
    alert(`🎉 ขอบคุณที่สั่งซื้อครับ! ยอดชำระทั้งหมด ${finalPrice} บาท`);
   
    cart = [];
    saveAndRender();
    document.querySelector('[data-target="shop"]').click();
});


// รันครั้งแรกตอนโหลดหน้าเว็บ
renderProducts();
updateCartBadge();
renderCart();


