const modal = document.getElementById("popup-modal");
const openButtons = document.querySelectorAll(".addButton");
const closeModal = document.getElementById("close-modal");
const cancelDelete = document.getElementById("cancel-delete");

// Fungsi untuk membuka modal
const openModal = () => {
  modal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden"); // Mencegah scroll
};

// Fungsi untuk menutup modal
const closeModalHandler = () => {
  modal.classList.add("hidden");
  document.body.classList.remove("overflow-hidden"); // Mengembalikan scroll
};

// Event listener untuk tombol yang membuka modal
openButtons.forEach((button) => {
  button.addEventListener("click", openModal);
});

// Event listener untuk tombol yang menutup modal
closeModal.addEventListener("click", closeModalHandler);
cancelDelete.addEventListener("click", closeModalHandler);
