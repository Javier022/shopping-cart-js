// Dom content Load
document.addEventListener("DOMContentLoaded", () => {
  getData();
});

const getData = async () => {
  try {
    const res = await fetch("/src/db/index.json");
    const data = await res.json();
    // console.log(data);
    paintData(data);
  } catch (error) {
    console.log(error);
  }
};

// template
const items = document.getElementById("items"),
  templateCard = document.getElementById("template-card").content,
  fragment = new DocumentFragment();

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

items.addEventListener("click", (e) => {
  const target = e.target,
    buttons = Array.from(items.querySelectorAll(".card-body button")),
    i = buttons.indexOf(target);

  console.log(i);

  if (i === 0) {
    console.log("agregaste una café");
  }

  e.stopPropagation();
});
