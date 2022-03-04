let Kanap_data = [];
let ProductsList = "";

/* storing info from api */
async function FetchData() {
    await fetch("http://localhost:3000/api/products")
        .then(res => res.json())
        .then(res2 => {
            Kanap_data = res2;
            console.table(Kanap_data)
        })
        GetProducts();
}

/*add a given item to list by index */
function CreateNode(key) {
    return (`<a href="./product.html?id=${Kanap_data[key]._id}">
    <article>
      <img src="${Kanap_data[key].imageUrl}" alt="${Kanap_data[key].altTxt}">
      <h3 class="productName">${Kanap_data[key].name}</h3>
      <p class="productDescription">${Kanap_data[key].description}</p>
    </article>
  </a> `);
}

/* loop over every item to add it to the list then display it */
async function GetProducts() {
    for(let key = 0; key < Kanap_data.length; key++)
        ProductsList += CreateNode(key);
    let Myvar = document.getElementById("items");
    Myvar.innerHTML = ProductsList;
}

FetchData();