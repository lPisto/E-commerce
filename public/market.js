let total = 0;
const cartTotal = document.getElementById("total");
const shoppingCartItemsContainer = document.getElementById("table");

const addToCartButton = document.querySelectorAll(".add-to-cart");
addToCartButton.forEach((addToCart) => {
  addToCart.addEventListener("click", addToCartClicked);
});

function addToCartClicked(event) {
  const button = event.target;
  const item = button.closest(".thumbnail");

  const itemTitle = item.querySelector(".item-title").textContent;
  const itemPrice = item.querySelector(".item-price").textContent;
  const itemImage = item.querySelector(".item-image").src;

  addItemToShoppingCart(itemTitle, itemPrice, itemImage);
}

function addItemToShoppingCart(itemTitle, itemPrice, itemImage) {
  const elementsTitle = shoppingCartItemsContainer.getElementsByClassName("itemTitle");
  for (let i = 0; i < elementsTitle.length; i++) {
    if (elementsTitle[i].innerText === itemTitle) {
      const elementQuantity = elementsTitle[i].parentElement.parentElement.querySelector("#quantity")
      const elementPrice = elementsTitle[i].parentElement.parentElement.querySelector("#cart-price")
      const price = Number(elementPrice.textContent.replace("$", ""));
      elementQuantity.value++;
      let a = cartTotal.textContent;
      let res = Number(a.replace("$", ""));
      res = res + price
      cartTotal.innerHTML = `$${res}`;
      return;
    }
  }

  let newTransactionRow = shoppingCartItemsContainer.insertRow(1);

  let newTypeCell = newTransactionRow.insertCell(0);
  newTypeCell.innerHTML = `<img src=${itemImage} class="img-responsive"> 
  <b class="itemTitle">${itemTitle}</b> `;

  newTypeCell = newTransactionRow.insertCell(1);
  newTypeCell.innerHTML = `<span class="cart-item" id="cart-price">${itemPrice}</span>`;

  newTypeCell = newTransactionRow.insertCell(2);
  newTypeCell.innerHTML = `<div class="shopping-cart-quantity d-flex justify-content-between align-items-center border-bottom pb-2 pt-3">
  <input class="shopping-cart-quantity-input shoppingCartItemQuantity" type="number" id="quantity" value="1">
  </div>`;

  newTypeCell = newTransactionRow.insertCell(3);
  newTypeCell.innerHTML = `<td>
  <a class="btn btn-danger btn-delete"><i class="bi-trash"></i></a</a>
  </td>`;

  newTransactionRow.querySelector(".btn-delete").addEventListener('click', () => {
    const deletePriceElement = newTransactionRow.querySelector("#cart-price").textContent
    const deletePrice = Number(deletePriceElement.replace("$", ""));
    deleteItems(deletePrice)

    padre = newTransactionRow.parentNode;
		padre.removeChild(newTransactionRow);
  });

  newTransactionRow.querySelector(".shoppingCartItemQuantity").addEventListener('click', updateQuantity);
  updateTotal();
}

function updateTotal() {
  const priceElement = document.getElementById("cart-price");
  const price = Number(priceElement.textContent.replace("$", ""));

  // const quantityElement = document.getElementById("quantity");
  // const quantity = Number(quantityElement.value);

  total = total + price

  cartTotal.innerHTML = `$${total}`;
}

function updateQuantity(event) {
  const quantityInput = event.target
  if (quantityInput.value <= 0) {
    quantityInput.value = 1
  }

  const priceElement = document.getElementById("cart-price");
  const price = Number(priceElement.textContent.replace("$", ""));

  const quantityElement = document.getElementById("quantity");
  const quantity = Number(quantityElement.value);

  let res = price * quantity;

  cartTotal.innerHTML = `$${res}`;
}

function deleteItems(deletePrice) {
  const a = cartTotal.textContent;
  const b = Number(a.replace("$", ""));
  total = b - deletePrice 

  cartTotal.innerHTML = `$${total}`;
}


