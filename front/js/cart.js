let Kanap_data = [];
let Cart = localStorage

function GetId(Line) {
    for (let i = 0; i < Kanap_data.length; i++)
        if (Line.id == Kanap_data[i]._id)
            return (i)
    return(-1);
}

function AddElemToCart(Line, j) {
    let i = GetId(Line)

    return (`<article class="cart__item" data-id="${Line.id}" data-color="${Line.color}">
    <div class="cart__item__img">
      <img src="${Kanap_data[i].imageUrl}" alt="${Kanap_data.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${Kanap_data[i].name}</h2>
        <p>${Line.color}</p>
        <p>${Kanap_data[i].price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p id="quantityNumber${j}">Qté : ${Line.quantity}</p>
          <input type="number" id="articleNumber${j}" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${Line.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p id="deleteItem${j}" class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`)
}

async function FetchData() {
    await fetch("http://localhost:3000/api/products")
        .then(res => res.json())
        .then(res2 => {
            Kanap_data = res2
            console.table(Kanap_data)
        })
}

async function DisplayCart() {
    await FetchData()
    let FullData = ""
    let totalPrice = 0
    let totalQuantity = 0
    for (let i = 0; i < Cart.length; i++) {
        Line = Cart.getItem(i)
        Line = JSON.parse(Line)
        totalPrice += (Kanap_data[GetId(Line)].price * parseInt(Line.quantity))
        totalQuantity += parseInt(Line.quantity)
        FullData += AddElemToCart(Line, i)
    }
    document.getElementById("cart__items").innerHTML = FullData
    document.getElementById("totalQuantity").innerHTML = totalQuantity
    document.getElementById("totalPrice").innerHTML = totalPrice + ',00'
    for (let i = 0; i< Cart.length; i++) {
        document.getElementById(`articleNumber${i}`).addEventListener("change", ChangeQuantity);
        document.getElementById(`deleteItem${i}`).addEventListener("click", DeleteItem)
    }
}

function DeleteItem() {
    Cart.removeItem(this.id.split("Item")[1])
    DisplayCart()
}

function ChangeQuantity() {
    let Line = Cart.getItem(this.id.split('Number')[1])
    Line = JSON.parse(Line)
    if (this.value < 1 || this.value > 100)
        return (0)
    Line.quantity = (parseInt(this.value, 10))
    Cart.setItem(this.id.split('Number')[1], JSON.stringify(Line))
    DisplayCart()
}

DisplayCart()