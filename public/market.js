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
  const elementsTitle =
    shoppingCartItemsContainer.getElementsByClassName("itemTitle");

  for (let i = 0; i < elementsTitle.length; i++) {
    if (elementsTitle[i].innerText === itemTitle) {
      const elementQuantity =
        elementsTitle[i].parentElement.parentElement.querySelector("#quantity");
      const elementPrice =
        elementsTitle[i].parentElement.parentElement.querySelector(
          "#cart-price"
        );
      const price = Number(elementPrice.textContent.replace("$", ""));
      elementQuantity.value++;
      let a = cartTotal.textContent;
      let res = Number(a.replace("$", ""));
      res = res + price;
      cartTotal.innerHTML = `$${res}`;
      return;
    }
  }

  let newTransactionRow = shoppingCartItemsContainer.insertRow(1);

  let newTypeCell = newTransactionRow.insertCell(0);
  newTypeCell.innerHTML = `<img src=${itemImage} class="img-responsive itemImg"> 
  <b class="itemTitle" id="itemTitle" name="title">${itemTitle}</b> `;

  newTypeCell = newTransactionRow.insertCell(1);
  newTypeCell.innerHTML = `<span class="cart-item itemPrice" id="cart-price">${itemPrice}</span>`;

  newTypeCell = newTransactionRow.insertCell(2);
  newTypeCell.innerHTML = `<div class="shopping-cart-quantity d-flex justify-content-between align-items-center border-bottom pb-2 pt-3">
  <input class="shopping-cart-quantity-input shoppingCartItemQuantity" type="number" id="quantity" value="1">
  </div>`;

  newTypeCell = newTransactionRow.insertCell(3);
  newTypeCell.innerHTML = `<td>
  <a class="btn btn-danger btn-delete"><i class="bi-trash"></i></a</a>
  </td>`;

  // adding the price of the first element to the shopping cart
  const priceElement = document.getElementById("cart-price");
  const price = Number(priceElement.textContent.replace("$", ""));

  let totalCart = cartTotal.textContent;
  let res = Number(totalCart.replace("$", ""));
  res = res + price;
  cartTotal.innerHTML = `$${res}`;

  newTransactionRow
    .querySelector(".btn-delete")
    .addEventListener("click", () => {
      const quantityElement = newTransactionRow.querySelector("#quantity");
      const quantity = Number(quantityElement.value);

      const deletePriceElement =
        newTransactionRow.querySelector("#cart-price").textContent;
      const deletePrice = Number(deletePriceElement.replace("$", ""));
      const totalDeletePrice = deletePrice * quantity;

      deleteItems(totalDeletePrice);

      padre = newTransactionRow.parentNode;
      padre.removeChild(newTransactionRow);
    });

  newTransactionRow
    .querySelector(".shoppingCartItemQuantity")
    .addEventListener("click", (event) => {
      const quantityInput = event.target;
      if (quantityInput.value <= 0) {
        quantityInput.value = 1;
      }

      let sumaTotal = 0;

      for (i = 0; i < elementsTitle.length; i++) {
        const elementPrice =
          elementsTitle[i].parentElement.parentElement.querySelector(
            "#cart-price"
          );
        const price = Number(elementPrice.textContent.replace("$", ""));

        const elementQuantity =
          elementsTitle[i].parentElement.parentElement.querySelector(
            "#quantity"
          ).value;

        quantityPrice = price * elementQuantity;

        sumaTotal = sumaTotal + quantityPrice;

        cartTotal.innerHTML = `$${sumaTotal}`;
      }
    });

  // empty cart button
  document.getElementById("totalTrash").addEventListener("click", (event) => {
    let total = 0;

    padre = newTransactionRow.parentNode;
    padre.removeChild(newTransactionRow);

    cartTotal.innerHTML = `$${total}`;
  });
}

function deleteItems(totalDeletePrice) {
  const totalContent = cartTotal.textContent;
  const totalNumber = Number(totalContent.replace("$", ""));
  total = totalNumber - totalDeletePrice;

  cartTotal.innerHTML = `$${total}`;
}

// empty cart button
document.getElementById("totalTrash").addEventListener("click", (event) => {
  let total = 0;
  cartTotal.innerHTML = `$${total}`;
});

// send products to backend
const purchase = () => {
  const itemTitle = document.getElementsByClassName("itemTitle");
  const itemPrice = document.getElementsByClassName("itemPrice");
  const itemQuantity = document.getElementsByClassName(
    "shoppingCartItemQuantity"
  );

  for (i = 0; i < itemTitle.length; i++) {
    let title = itemTitle[i].textContent;
    let price = itemPrice[i].textContent.replace("$", "");
    let quantity = itemQuantity[i].value;

    fetch("http://localhost:4000/shipment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "name": title,
        "price": price,
        "quantity": quantity,
      }),
    });
  }
};
