let kanapData = [];
let cart = localStorage

async function FetchData() {
    await fetch("http://localhost:3000/api/products")
        .then(res => res.json())
        .then(res2 => {
            kanapData = res2
            console.table(kanapData)
        })
}

/* get the idof the current html page */

function getId() {
    id = document.URL.split("?id=")
    for (let i = 0; i < kanapData.length; i++)
        if (id[1] == kanapData[i]._id)
            return (i)
    return(-1);
}

function displayImg(id) {
    document.getElementsByClassName("item__img")[0].innerHTML = 
    `<img src="${kanapData[id].imageUrl}" alt="${kanapData[id].altTxt}">`
}

function displayPrice(id) {
    document.getElementById("price").innerHTML = `${kanapData[id].price}`
}

function displayTitle(id) {
    document.getElementById("title").innerHTML = `${kanapData[id].name}`
}

function displayDescription(id) {
    document.getElementById("description").innerHTML = `${kanapData[id].description}`
}

function displayColors(id) {
    let ColorsString = [];
    for (let i = 0; i < kanapData[id].colors.length; i++)
        ColorsString += `<option value="${kanapData[id].colors[i]}">${kanapData[id].colors[i]}</option>`
    FullDiv = `<option value="">--SVP, choisissez une couleur --</option>` + ColorsString
    document.getElementById("colors").innerHTML = FullDiv
}

function handleProduct(id) {
    displayImg(id)
    displayTitle(id)
    displayPrice(id)
    displayDescription(id)
    displayColors(id)
}

async function launch() {
    await FetchData();
    index = getId();
    handleProduct(index);
}

function checkObj(elem) {
    if (cart.length == 0)
        return(0)
    for (let i = 0; i < cart.length; i++) {
        let line = cart.getItem(i)
        line = JSON.parse(line)
        if (line) {
            if (elem.id== line.id&& elem.color == line.color) {
                line.quantity = (parseInt(elem.quantity, 10) + parseInt(line.quantity, 10)).toString()
                cart.setItem(i, JSON.stringify(line))
                return (1)
            }
        }
    }
    return (0)
}

function addToCart() {
    let color = document.getElementById("colors").value
        if (!color)
            return (-1)
    let quantity = document.getElementById("quantity").value
        if (quantity <= 0 || quantity > 100)
            return(-1)
    let newElem = {
        id: kanapData[getId()]._id,
        color : color,
        quantity : quantity
    }
    let obj = JSON.stringify(newElem);
    if (!checkObj(newElem))
        cart[cart.length] = obj
}

launch();
document.getElementById("addToCart").addEventListener("click", addToCart);

