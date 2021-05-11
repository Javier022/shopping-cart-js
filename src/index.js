// constants
const items = document.getElementById("items"),
  templateCard = document.getElementById("template-card").content,
  templateCart = document.getElementById("template-cart").content,
  shoppingCart = document.getElementById("cart"),
  templateFooter = document.getElementById("template-footer").content,
  footerCart = document.getElementById("footer"),
  fragment = new DocumentFragment();

let dataItems = null;

let cart = {};

// Dom content Load
document.addEventListener("DOMContentLoaded", () => {
  getData();
  if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
    paintCart();
  }
});

const getData = async () => {
  try {
    const res = await fetch("/src/db/index.json");
    let data = await res.json();
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

  if (cart.hasOwnProperty(product.id)) {
    product.cant = cart[product.id].cant + 1;
  }

  cart[product.id] = { ...product };

  paintCart();

  e.stopPropagation();
};

const paintCart = () => {
  const td = Array.from(templateCart.querySelectorAll("td"));

  shoppingCart.innerHTML = "";

  Object.values(cart).length !== 0 &&
    Object.values(cart).map((product) => {
      templateCart.querySelector("th").textContent = product.id;
      td[0].textContent = product.name;
      td[1].textContent = product.cant;

      templateCart.querySelector(".btn-info").dataset.id = product.id;
      templateCart.querySelector(".btn-danger").dataset.id = product.id;
      templateCart.querySelector("span").textContent =
        product.price * product.cant;

      const clone = templateCart.cloneNode(true);

      fragment.appendChild(clone);
    });

  shoppingCart.appendChild(fragment);

  paintFooterCart();

  localStorage.setItem("cart", JSON.stringify(cart));
};

const paintFooterCart = () => {
  footerCart.innerHTML = "";

  if (Object.keys(cart).length === 0) {
    footerCart.innerHTML = /*html*/ `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`;
    return;
  }

  const nCant = Object.values(cart).reduce((acc, el) => acc + el.cant, 0);

  const total = Object.values(cart).reduce(
    (acc, { cant, price }) => acc + cant * price,
    0
  );

  templateFooter.querySelectorAll("td")[0].textContent = nCant;
  templateFooter.querySelector("span").textContent = total;

  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);

  footerCart.appendChild(fragment);

  const btnEmpty = document.getElementById("vaciar-carrito");
  btnEmpty.addEventListener("click", () => {
    cart = {};
    paintCart();
  });
};

shoppingCart.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-info")) {
    // cart[e.target.dataset.id].cant = cart[e.target.dataset.id].cant + 1;
    const product = cart[e.target.dataset.id];
    product.cant++;
    cart[e.target.dataset.id] = { ...product };
    paintCart();
  }

  if (e.target.classList.contains("btn-danger")) {
    const product = cart[e.target.dataset.id];
    product.cant--;
    product.cant === 0 ? delete cart[e.target.dataset.id] : "";

    paintCart();
  }

  e.stopPropagation();
});
