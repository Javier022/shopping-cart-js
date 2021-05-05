// constants
const items = document.getElementById("items"),
  templateCard = document.getElementById("template-card").content,
  fragment = new DocumentFragment();

let dataItems = null;

let cart = {};

// Dom content Load
document.addEventListener("DOMContentLoaded", () => {
  getData();
});

const getData = async () => {
  try {
    const res = await fetch("/src/db/index.json");
    let data = await res.json();
    // console.log(data);
    dataItems = data;
    paintData(dataItems);
  } catch (error) {
    console.log(error);
  }
};

const paintData = (data) => {
  // console.log(data);
  data.map((item) => {
    // console.log(item);

    templateCard.querySelector(".card-body h5").textContent = item.title;

    templateCard.querySelector(".card-body p").textContent = item.precio;

    templateCard.querySelector("img").setAttribute("src", item.thumbnailUrl);

    const clone = templateCard.cloneNode(true);

    fragment.appendChild(clone);
  });

  items.appendChild(fragment);
};

// event delegation
items.addEventListener("click", (e) => {
  addToCar(e);
});

// add items to card
const addToCar = (e) => {
  const target = e.target,
    buttons = Array.from(items.querySelectorAll(".card-body button")),
    i = buttons.indexOf(target);

  let product = {};

  dataItems.map((item) => {
    if (item.id === i + 1) {
      product = {
        id: i + 1,
        name: item.title,
        price: item.precio,
        cant: 1,
      };
    }
  });

  if (!Object.keys(product).length > 0) {
    // console.log("{} not keys & values");
    return;
  }

  //  object indexed
  // cart =
  // {
  //   1: {name: 'foo', cant: 1}
  // }

  if (cart.hasOwnProperty(product.id)) {
    product.cant = cart[product.id].cant + 1;
  }

  cart[product.id] = { ...product };

  console.log(cart);

  e.stopPropagation();
};
