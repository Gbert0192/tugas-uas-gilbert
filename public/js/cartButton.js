// batas

const formatCurrency = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const getData = async () => {
  try {
    const response = await fetch("/cart/get-cart", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil data dari server.");
    }

    const data = await response.json();

    // Pastikan data.cart ada
    if (!data || !data.cart) {
      console.log("Data cart tidak ditemukan.");
      return;
    }
    const totalShop = document.getElementById("cart-total");
    const cartContainer = document.getElementById("cart-items");
    const checkoutButton = document.getElementById("checkout-buttons");
    const badgeCount = document.getElementById("badge-count");
    cartContainer.innerHTML = ""; // Bersihkan kontainer sebelumnya

    let totalPrice = 0; // Inisialisasi total harga

    if (Array.isArray(data.cart) && data.cart.length === 0) {
      // Jika keranjang kosong
      const emptyCartMessage = document.createElement("div");
      emptyCartMessage.classList.add(
        "flex",
        "items-center",
        "justify-center",
        "h-full",
        "text-gray-500",
        "text-lg",
        "animate-pulse"
      );
      emptyCartMessage.innerHTML = `<p>Keranjang Kosong :(</p>`;
      cartContainer.appendChild(emptyCartMessage);
      checkoutButton.disabled = true;
      badgeCount.innerHTML = 0; // Pastikan badge count diubah jadi 0
    } else {
      data.cart?.map((obj) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add(
          "flex",
          "items-center",
          "justify-between",
          "p-2",
          "border-b"
        );
        productDiv.innerHTML = `
        <div class="flex items-center">
          <img src="${obj.productImage}" alt="${
          obj.productName
        }" class="w-12 h-12 mr-4" />
          <div>
            <h4 class="text-sm font-semibold">${obj.productName}</h4>
            <p class="text-xs text-gray-500">Harga: Rp.${formatCurrency(
              obj.productPrice
            )}</p>
          </div>
        </div>
        <div class="flex items-center">
          <button class="text-gray-500" onclick="updateQuantity(${
            obj.productId
          }, 0)">-</button>
          <span class="mx-2">${obj.quantity}</span>
          <button class="text-gray-500" onclick="updateQuantity(${
            obj.productId
          }, 1)">+</button>
          <span class="ml-4 text-sm font-semibold">${formatCurrency(
            obj.productPrice * obj.quantity
          )}</span>
          <button class="text-red-500 ml-4 ini-delete" onClick="updateQuantity(${
            obj.productId
          }, 2)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6">
              <g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                <path d="M19 23H5L3 5h18l-2 18zM1 5h22M9 5V4a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v1M7 10l1 8M17 10l-1 8M12 9v10"></path>
              </g>
            </svg>
          </button>
        </div>
        `;
        cartContainer.appendChild(productDiv);
        totalPrice += obj.productPrice * obj.quantity;
      });

      checkoutButton.disabled = false; // Aktifkan tombol checkout
      totalShop.innerHTML = `Total : Rp.${formatCurrency(totalPrice)}`;

      badgeCount.innerHTML = data.uniqueItems || 0;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

getData();

// Fungsi placeholder untuk update dan remove (implementasikan sesuai kebutuhan)
const updateQuantity = async (id, value) => {
  try {
    const productId = id;
    const quantity = value;
    const data = { productId, quantity };
    await fetch("/cart/update-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    getData();
  } catch (error) {
    console.log(error.message);
  }
};

const removeFromCart = (id) => {
  console.log(`Remove product with id ${id}`);
};

const triggerButtons = document.querySelectorAll(".trigger-button");
triggerButtons.forEach((button) => {
  button.addEventListener("click", async function () {
    const productId = this.getAttribute("data-index");
    const data = { productId: productId, quantity: 1 };
    try {
      const response = await fetch("/cart/add-to-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const result = await response.json();
        console.log("Berhasil menambahkan ke keranjang:", result);
        getData();
      } else {
        console.error("Gagal menambahkan ke keranjang:", response.statusText);
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat mengirim data:", error);
    }
  });
});
