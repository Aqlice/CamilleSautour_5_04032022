let kanapData = [];
let productsList = "";

/* storing info from api */
async function fetchData() {
    await fetch("http://localhost:3000/api/products")
        .then(res => res.json())
        .then(res2 => {
            kanapData = res2;
            console.table(kanapData)
        })
        getProducts();
}

/*add a given item to list by index */
function createNode(key) {
    return (`<a href="./product.html?id=${kanapData[key]._id}">
    <article>
      <img src="${kanapData[key].imageUrl}" alt="${kanapData[key].altTxt}">
      <h3 class="productName">${kanapData[key].name}</h3>
      <p class="productDescription">${kanapData[key].description}</p>
    </article>
  </a> `);
}

/* loop over every item to add it to the list then display it */
async function getProducts() {
    for(let key = 0; key < kanapData.length; key++)
        productsList += createNode(key);
    let myVar = document.getElementById("items");
    myVar.innerHTML = productsList;
}

fetchData();