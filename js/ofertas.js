const carros = [
  { nome: "Hyundai HB20 Sedan", info: "2016 | SP | R$ 40.000 | 65 mil km", img: "imagens/carro1.png", link: "carro1.html" },
  { nome: "Toyota Hatch Yaris", info: "2017 | SP | R$ 55.000 | 48 mil km", img: "imagens/carro2.png", link: "carro2.html" },
  { nome: "Fiat Uno Mille", info: "2013 | MG | R$ 25.000 | 92 mil km", img: "imagens/carro3.png", link: "carro3.html" },
  { nome: "Sedan Lada Samara", info: "2012 | RS | R$ 30.000 | 110 mil km", img: "imagens/carro4.png", link: "carro4.html" },
  { nome: "Toyota Etios Liva", info: "2018 | RJ | R$ 40.000 | 55 mil km", img: "imagens/carro5.png", link: "carro5.html" },
  { nome: "Kia Besta Pregio", info: "2006 | PR | R$ 11.000 | 150 mil km", img: "imagens/carro6.png", link: "carro6.html" },
  { nome: "Lada Laika Riva", info: "2012 | PE | R$ 35.000 | 78 mil km", img: "imagens/carro7.png", link: "carro7.html" },
  { nome: "Volkswagen Fusca Typ1", info: "2003 | ES | R$ 18.000 | 120 mil km", img: "imagens/carro8.png", link: "carro8.html" },
  { nome: "Veb Trabant", info: "2010 | SP | R$ 15.000 | 95 mil km", img: "imagens/carro9.png", link: "carro9.html" },
  { nome: "Awe Wartburg", info: "1990 | SC | R$ 10.000 | 200 mil km", img: "imagens/carro10.png", link: "carro10.html" },
  { nome: "Toyota Sprinter AE86", info: "2000 | MG | R$ 85.000 | 70 mil km", img: "imagens/carro11.png", link: "carro11.html" },
  { nome: "Daihatsu Hijet Van", info: "2019 | RS | R$ 66.000 | 30 mil km", img: "imagens/carro12.png", link: "carro12.html" },
  { nome: "Byd Dolphin Mini", info: "2023 | BA | R$ 95.000 | 10 mil km", img: "imagens/carro13.png", link: "carro13.html" },
  { nome: "Mini Hatch Cooper", info: "2013 | PR | R$ 30.000 | 85 mil km", img: "imagens/carro14.png", link: "carro14.html" },
  { nome: "Volkswagen Kombi", info: "2013 | SP | R$ 16.000 | 140 mil km", img: "imagens/carro15.png", link: "carro15.html" },
  { nome: "Volkswagen Brasília", info: "1982 | DF | R$ 34.000 | 160 mil km", img: "imagens/carro16.png", link: "carro16.html" },
  { nome: "Chevrolet Chevette", info: "1985 | MG | R$ 22.000 | 180 mil km", img: "imagens/carro17.png", link: "carro17.html" },
  { nome: "Volkswagen Santana", info: "1998 | RS | R$ 20.000 | 130 mil km", img: "imagens/carro18.png", link: "carro18.html" },
  { nome: "Sedan Kia Brisa", info: "1981 | MG | R$ 29.000 | 190 mil km", img: "imagens/carro19.png", link: "carro19.html" },
  { nome: "Ford Corcel II", info: "1982 | SP | R$ 23.000 | 170 mil km", img: "imagens/carro20.png", link: "carro20.html" }
];

const container = document.getElementById("carros-container");
const pagination = document.querySelector(".pagination");
const search = document.getElementById("search");

let currentPage = 1;
const perPage = 8;

function renderCars() {
  const query = search.value.toLowerCase();
  const filtered = carros.filter(c =>
    c.nome.toLowerCase().includes(query) || c.info.toLowerCase().includes(query)
  );

  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const current = filtered.slice(start, end);

  container.innerHTML = current.map(c => `
    <div class="carro">
      <img src="${c.img}" alt="${c.nome}">
      <h3>${c.nome}</h3>
      <p>${c.info}</p>
      <a href="${c.link}" class="btn-ver">Ver detalhes</a>
    </div>
  `).join("");

  const totalPages = Math.ceil(filtered.length / perPage);
  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  pagination.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.onclick = () => {
      currentPage = i;
      renderCars();
    };
    pagination.appendChild(btn);
  }
}

search.addEventListener("input", () => {
  currentPage = 1;
  renderCars();
});

renderCars();
