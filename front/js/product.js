let Kanap_data = [];
let Cart = localStorage

async function FetchData() {
    await fetch("http://localhost:3000/api/products")
        .then(res => res.json())
        .then(res2 => {
            Kanap_data = res2
            console.table(Kanap_data)
        })
}

/* get the id of the current html page */

function GetId() {
    Id = document.URL.split("?id=");
    for (let i = 0; i < Kanap_data.length; i++)
        if (Id[1] == Kanap_data[i]._id)
            return (i)
    return(-1);
}

function DisplayImg(Id) {
    document.getElementsByClassName("item__img")[0].innerHTML = 
    `<img src="${Kanap_data[Id].imageUrl}" alt="${Kanap_data[Id].altTxt}">`
}

function DisplayPrice(Id) {
    document.getElementById("price").innerHTML = `${Kanap_data[Id].price}`
}

function DisplayTitle(Id) {
    document.getElementById("title").innerHTML = `${Kanap_data[Id].name}`
}

function DisplayDescription(Id) {
    document.getElementById("description").innerHTML = `${Kanap_data[Id].description}`
}

function DisplayColors(Id) {
    let ColorsString = [];
    for (let i = 0; i < Kanap_data[Id].colors.length; i++)
        ColorsString += `<option value="${Kanap_data[Id].colors[i]}">${Kanap_data[Id].colors[i]}</option>`
    FullDiv = `<option value="">--SVP, choisissez une couleur --</option>` + ColorsString
    document.getElementById("colors").innerHTML = FullDiv
}

function HandleProduct(Id) {
    DisplayImg(Id)
    DisplayTitle(Id)
    DisplayPrice(Id)
    DisplayDescription(Id)
    DisplayColors(Id)
}

async function Launch() {
    await FetchData();
    Index = GetId();
    HandleProduct(Index);
}

function CheckObj(Elem) {
    if (Cart.length == 0)
        return(0)
    console.log(Cart)
    for (let i = 0; i < Cart.length; i++) {
        Line = Cart.getItem(i)
        Line = JSON.parse(Line)
        if (Elem.id == Line.id && Elem.color == Line.color) {
            Line.quantity = (parseInt(Elem.quantity, 10) + parseInt(Line.quantity, 10)).toString()
            Cart.setItem(i, JSON.stringify(Line))
            return (1)
        }
    }
    return (0)
}

function AddToCart() {
    let Color = document.getElementById("colors").value
        if (!Color)
            return (-1)
    let Quantity = document.getElementById("quantity").value
        if (Quantity <= 0 || Quantity > 100)
            return(-1)
    let NewElem = {
        id : Kanap_data[GetId()]._id,
        color : Color,
        quantity : Quantity
    }
    let obj = JSON.stringify(NewElem);
    if (!CheckObj(NewElem))
        Cart[Cart.length] = obj
    console.log(Cart)
}

Launch();
document.getElementById("addToCart").addEventListener("click", AddToCart);