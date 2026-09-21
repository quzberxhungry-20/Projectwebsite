// ==========================================
// 1. MENGAMBIL ELEMEN DARI HTML
// ==========================================
const navbarNav = document.querySelector(".navbar-nav");
const hamburger = document.querySelector("#hamburger-menu");

const searchForm = document.querySelector(".search-form");
const searchBox = document.querySelector("#search-box");
const searchButton = document.querySelector("#search-button");

const shoppingCart = document.querySelector(".shopping-cart");
const shoppingCartButton = document.querySelector("#shopping-cart-button");

// ==========================================
// 2. KOSONGKAN KERANJANG BAWAAN HTML
// ==========================================
const keranjangBawaan = document.querySelectorAll(".shopping-cart .cart-item");
keranjangBawaan.forEach((item) => item.remove());

// ==========================================
// 3. TOGGLE (BUKA/TUTUP MENU NAVBAR)
// ==========================================
hamburger.onclick = (e) => {
  navbarNav.classList.toggle("active");
  e.preventDefault();
};

searchButton.onclick = (e) => {
  searchForm.classList.toggle("active");
  searchBox.focus(); 
  e.preventDefault();
};

shoppingCartButton.onclick = (e) => {
  shoppingCart.classList.toggle("active");
  e.preventDefault();
};

document.addEventListener("click", function (e) {
  if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
  if (!searchButton.contains(e.target) && !searchForm.contains(e.target)) {
    searchForm.classList.remove("active");
  }
  if (!shoppingCartButton.contains(e.target) && !shoppingCart.contains(e.target)) {
    shoppingCart.classList.remove("active");
  }
});

// ==========================================
// 4. FUNGSI UNTUK MEMASUKKAN MENU KE KERANJANG
// ==========================================
function tambahKeKeranjang(cardMenu) {
  const imgSrc = cardMenu.querySelector(".menu-card-img").src;
  const title = cardMenu.querySelector(".menu-card-title").innerText.replace(/-/g, '').trim(); 
  const price = cardMenu.querySelector(".menu-card-price").innerText;

  const cartItem = document.createElement("div");
  cartItem.classList.add("cart-item");
  cartItem.innerHTML = `
    <img src="${imgSrc}" alt="${title}" />
    <div class="item-detail">
      <h3>${title}</h3>
      <div class="item-price">${price}</div>
    </div>
    <i data-feather="trash-2" class="remove-item"></i>
  `;

  const checkoutBtn = document.querySelector(".checkout-btn");
  shoppingCart.insertBefore(cartItem, checkoutBtn);

  if (typeof feather !== 'undefined') feather.replace();

  cartItem.querySelector(".remove-item").onclick = (e) => {
    cartItem.remove(); 
    e.preventDefault();
  };

  shoppingCart.classList.add("active");
}

// ==========================================
// 5. FITUR FILTER PENCARIAN (MENYEMBUNYIKAN MENU LAIN)
// ==========================================
searchBox.addEventListener("input", function () {
  const keyword = searchBox.value.toLowerCase();
  const menuCards = document.querySelectorAll(".menu-card");

  menuCards.forEach((card) => {
    const menuTitle = card.querySelector(".menu-card-title").innerText.toLowerCase();
    if (menuTitle.includes(keyword)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});

// ==========================================
// 6. EFEK ANIMASI LOADING (DIBUAT OTOMATIS OLEH JS)
// ==========================================
function tampilkanLoading(namaPesanan, callback) {
  // Membuat layar gelap (overlay)
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "999999"; 
  
  // Isi teks loading di tengah layar
  overlay.innerHTML = `
    <h2 style="color: #77b842; font-size: 3rem; margin-bottom: 10px; font-family: 'Poppins', sans-serif;">Mohon Tunggu...</h2>
    <p style="color: #fff; font-size: 1.5rem; font-weight: 300; font-family: 'Poppins', sans-serif;">Sedang memproses pesanan <b>${namaPesanan}</b></p>
  `;

  document.body.appendChild(overlay); // Munculkan ke layar

  // Tahan layar selama 1.5 detik, lalu hapus layar dan jalankan perintah selanjutnya
  setTimeout(() => {
    overlay.remove();
    callback(); // Perintah memunculkan keranjang
  }, 1500); 
}

// ==========================================
// 7. TEKAN ENTER PADA SEARCH -> LOADING -> MASUK KERANJANG
// ==========================================
function prosesPencarianMasukKeranjang() {
  const keyword = searchBox.value.toLowerCase().trim();
  if (keyword === "") return; 

  const menuCards = document.querySelectorAll(".menu-card");
  let itemDitemukan = false;
  let menuTarget = null;

  for (let i = 0; i < menuCards.length; i++) {
    const title = menuCards[i].querySelector(".menu-card-title").innerText.toLowerCase();
    
    if (title.includes(keyword)) {
      menuTarget = menuCards[i];
      itemDitemukan = true;
      break; 
    }
  }

  if (itemDitemukan) {
    // Ambil nama menu untuk ditampilkan di layar loading (misal: "Rasa Melon")
    const namaMenu = menuTarget.querySelector(".menu-card-title").innerText.replace(/-/g, '').trim();
    
    // Panggil efek loading, lalu masukkan ke keranjang
    tampilkanLoading(namaMenu, function() {
      tambahKeKeranjang(menuTarget);
      
      // Bersihkan kotak pencarian setelah sukses masuk keranjang
      searchBox.value = ""; 
      menuCards.forEach(card => card.style.display = "block");
      searchForm.classList.remove("active");
    });
    
  } else {
    alert("Maaf, Menu tersebut tidak ditemukan!");
  }
}

// Eksekusi ketika tombol Enter ditekan pada keyboard
searchBox.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    prosesPencarianMasukKeranjang();
    e.preventDefault();
  }
});

// Eksekusi ketika ikon Kaca Pembesar di search bar diklik
const searchLabel = document.querySelector(".search-form label");
if (searchLabel) {
  searchLabel.onclick = (e) => {
    prosesPencarianMasukKeranjang();
    e.preventDefault();
  };
}

// ==========================================
// 8. KLIK TOMBOL "TAMBAHKAN KE KERANJANG" -> LOADING -> MASUK KERANJANG
// ==========================================
const menuCards = document.querySelectorAll(".menu-card");

menuCards.forEach((card) => {
  // Kita cari tombol di dalam masing-masing kartu
  const addToCartBtn = card.querySelector(".add-to-cart-btn");
  
  if (addToCartBtn) {
    addToCartBtn.onclick = (e) => {
      // Ambil nama menu
      const namaMenu = card.querySelector(".menu-card-title").innerText.trim();
      
      // Jalankan animasi loading, lalu masukkan ke keranjang
      tampilkanLoading(namaMenu, function() {
        tambahKeKeranjang(card);
      });
      
      e.preventDefault(); // Mencegah link '#' melompat ke atas halaman
    };
  }
});