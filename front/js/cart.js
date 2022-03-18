let kanapData = [];
let cart = localStorage

function getId(line) {
    for (let i = 0; i < kanapData.length; i++)
        if (line.id == kanapData[i]._id)
            return (i)
    return(-1);
}

function addElemToCart(line, j) {
        let i = getId(line)

        return (`<article class="cart__item" data-id="${line.id}" data-color="${line.color}">
        <div class="cart__item__img">
            <img src="${kanapData[i].imageUrl}" alt="${kanapData.altTxt}">
        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__description">
                <h2>${kanapData[i].name}</h2>
                <p>${line.color}</p>
                <p>${kanapData[i].price} €</p>
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                    <p id="quantityNumber${j}">Qté : ${line.quantity}</p>
                    <input type="number" id="articleNumber${j}" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${line.quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                    <p id="deleteItem${j}" class="deleteItem">Supprimer</p>
                </div>
            </div>
        </div>
    </article>`)
}

async function fetchData() {
    await fetch("http://localhost:3000/api/products")
    .then(res => res.json())
    .then(res2 => {
        kanapData = res2
        console.table(kanapData)
    })
}

async function displayCart() {
    await fetchData()
    let fullData = ""
    let totalPrice = 0
    let totalQuantity = 0
    for (let i = 0; i < cart.length; i++) {
        if (cart.getItem(i)) {
            line = cart.getItem(i)
            line = JSON.parse(line)
            totalPrice += (kanapData[getId(line)].price * parseInt(line.quantity))
            totalQuantity += parseInt(line.quantity)
            fullData += addElemToCart(line, i)
        }
    }
    document.getElementById("cart__items").innerHTML = fullData
    document.getElementById("totalQuantity").innerHTML = totalQuantity
    document.getElementById("totalPrice").innerHTML = totalPrice + ',00'
    for (let i = 0; i< cart.length; i++) {
        if (cart.getItem(i)) {
            document.getElementById(`articleNumber${i}`).addEventListener("change", changeQuantity);
            document.getElementById(`deleteItem${i}`).addEventListener("click", deleteItem)
        }
    }
}

function deleteItem() {
    let i = parseInt(this.id.split("Item")[1])
    while ( i < cart.length - 1) {
        cart.setItem(i, cart.getItem(i + 1))
        i++
    }
    cart.removeItem((cart.length - 1))
    displayCart()
}

function changeQuantity() {
    let line = cart.getItem(this.id.split('Number')[1])
    line = JSON.parse(line)
    if (this.value < 1 || this.value > 100)
    	return (0)
    line.quantity = (parseInt(this.value, 10))
    cart.setItem(this.id.split('Number')[1], JSON.stringify(line))
    displayCart()
}

function getProductsID() {
	let productID = []
	for (let i = 0; i < cart.length; i++) {
		let line = JSON.parse(cart[i])
		productID[i] = line.id
	}
	return (productID)
}

function    formValidation() {
	let form = document.querySelector(".cart__order__form")
	let charReg =new RegExp("^[a-zA-Z ,.'-]+$")
	let emailReg = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$')
	let addressReg = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+")
    
	form.firstName.addEventListener('change', function() {
		validFirstName(this)
	})
     
	form.lastName.addEventListener('change', function() {
		validLastName(this)
	})
    
	
	form.city.addEventListener('change', function() {
		validCity(this)
	})
    
	form.address.addEventListener('change', function() {
		validAddress(this)
	})
    
	form.email.addEventListener('change', function() {
		validEmail(this)
	})
    
	const validFirstName = function(inputFirstName) {
		let firstNameErrorMsg = inputFirstName.nextElementSibling
		if (charReg.test(inputFirstName.value)) {
			firstNameErrorMsg.innerHTML = ''
	    } else {
			firstNameErrorMsg.innerHTML = 'Veuillez renseigner ce champ.'
	    }
	}
    
	const validLastName = function(inputLastName) {
		let lastNameErrorMsg = inputLastName.nextElementSibling
    	if (charReg.test(inputLastName.value)) {
			lastNameErrorMsg.innerHTML = ''
		} else {
			lastNameErrorMsg.innerHTML = 'Veuillez renseigner ce champ.'
		}
    }
    
    const validCity = function(inputCity) {
		let cityErrorMsg = inputCity.nextElementSibling
		if (charReg.test(inputCity.value)) {
			cityErrorMsg.innerHTML = ''
		} else {
			cityErrorMsg.innerHTML = 'Veuillez renseigner ce champ.'
		}
    }
    
	const validAddress = function(inputAddress) {
	    let addressErrorMsg = inputAddress.nextElementSibling
		if (addressReg.test(inputAddress.value)) {
		    addressErrorMsg.innerHTML = '';
	    } else {
		    addressErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
	    }
	}
    
	const validEmail = function(inputEmail) {
	    let emailErrorMsg = inputEmail.nextElementSibling
	    if (emailReg.test(inputEmail.value)) {
		    emailErrorMsg.innerHTML = ''
	    } else {
		    emailErrorMsg.innerHTML = 'Veuillez renseigner votre email.'
	    }
	}
    }

 async function handleSubmit(event) {
	event.preventDefault()
    
	const data = new FormData(event.target)
	let order = {
		contact : {
			firstName : data.get('firstName'),
			lastName : data.get('lastName'),
			address : data.get('address'),
			city : data.get('city'),
			email : data.get('email')
		},
		products : getProductsID()
	}
	fetch(("http://localhost:3000/api/products/order"), {
  		method: "POST",
  		body: JSON.stringify(order),
  		headers: {"Accept": "application/json ", "Content-Type": "application/json" }
  	})
  	.then(response => response.json()) 
  	.then((data) => {
    localStorage.clear()
    localStorage.setItem("orderId", data.orderId)
	document.location.href = "confirmation.html"
})
  .catch(err => console.log(err))
}

document.querySelector('form').addEventListener('submit', handleSubmit)
displayCart()
formValidation()
