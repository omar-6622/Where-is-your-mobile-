// تخزين الحسابات والبيانات باستخدام LocalStorage
const accounts = JSON.parse(localStorage.getItem('accounts')) || {};
let currentUser = null;

// أقسام الصفحة
const registerSection = document.getElementById('register-section');
const loginSection = document.getElementById('login-section');
const sellerSection = document.getElementById('seller-section');
const sellerName = document.getElementById('seller-name');
const productList = document.getElementById('product-list');

// عرض المنتجات في قائمة محددة القسم
function displayProducts(category = 'all') {
  productList.innerHTML = ''; // مسح القائمة
  const products = accounts[currentUser].products.filter(product =>
    category === 'all' || product.category === category
  );

  if (products.length === 0) {
    productList.innerHTML = '<li>لا توجد منتجات في هذا القسم</li>';
    return;
  }

  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span><strong>اسم المنتج:</strong> ${product.name}</span>
      <span class="price"><strong>السعر:</strong> ${product.price} ريال</span>
      <span><strong>الموقع:</strong> ${product.location}</span>
      <span><strong>القسم:</strong> ${product.category}</span>
    `;
    productList.appendChild(li);
  });
}

// التبديل بين الأقسام
document.getElementById('product-categories').addEventListener('click', function (e) {
  if (e.target.tagName === 'BUTTON') {
    const category = e.target.getAttribute('data-category');
    displayProducts(category);
  }
});

// تسجيل حساب جديد
document.getElementById('register-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (accounts[username]) {
    alert('اسم المستخدم موجود بالفعل!');
    return;
  }

  accounts[username] = { password, products: [] };
  localStorage.setItem('accounts', JSON.stringify(accounts));
  alert('تم التسجيل بنجاح! يمكنك الآن تسجيل الدخول.');
  document.getElementById('register-form').reset();
  showLoginSection();
});

// تسجيل الدخول
document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;

  if (accounts[username] && accounts[username].password === password) {
    currentUser = username;
    showSellerSection();
  } else {
    alert('بيانات الدخول غير صحيحة!');
  }
});

// إضافة منتج جديد
document.getElementById('add-product-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const productName = document.getElementById('product-name').value.trim();
  const productPrice = parseFloat(document.getElementById('product-price').value);
  const productLocation = document.getElementById('product-location').value.trim();
  const productCategory = document.getElementById('product-category').value;

  if (!productName || isNaN(productPrice) || !productLocation || !productCategory) {
    alert('يرجى ملء جميع الحقول!');
    return;
  }

  accounts[currentUser].products.push({
    name: productName,
    price: productPrice.toFixed(2),
    location: productLocation,
    category: productCategory,
  });

  localStorage.setItem('accounts', JSON.stringify(accounts));
  displayProducts();
  document.getElementById('add-product-form').reset();
});

// تسجيل الخروج
document.getElementById('logout').addEventListener('click', function () {
  currentUser = null;
  showLoginSection();
});

// عرض واجهة التسجيل
function showRegisterSection() {
  registerSection.style.display = 'block';
  loginSection.style.display = 'none';
  sellerSection.style.display = 'none';
}

// عرض واجهة تسجيل الدخول
function showLoginSection() {
  registerSection.style.display = 'none';
  loginSection.style.display = 'block';
  sellerSection.style.display = 'none';
}

// عرض واجهة لوحة البائع
function showSellerSection() {
  registerSection.style.display = 'none';
  loginSection.style.display = 'none';
  sellerSection.style.display = 'block';
  sellerName.textContent = currentUser;
  displayProducts();
}

// عرض الواجهة الافتراضية عند التحميل
showRegisterSection();