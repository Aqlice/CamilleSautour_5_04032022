let Kanap_data = [];

async function FetchData() {
    Kanap_data = await fetch("http://localhost:3000/api/products");
    console.log(Kanap_data);
    return await Kanap_data.json();
}

FetchData();
/*export function DisplayKanap() {
    await FetchData();
    document.getElementsByID()
}*/