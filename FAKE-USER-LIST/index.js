const dataPanel = document.querySelector("#data-panel");
const peopleModal = document.querySelector(".people-modal");
const BASE_URL = "https://lighthouse-user-api.herokuapp.com/";
const INDEX_URL = "api/v1/users/";
const PEOPLE_PER_PAGE =24
// document.querySelector("#PEOPLE_PER_PAGE ").value
const peopleData = [];


let filterPeople = []

const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const pagination = document.querySelector("#pagination");

//將資料加入陣列中
axios
  .get(BASE_URL + INDEX_URL)
  .then((response) => {
    peopleData.push(...response.data.results);
    // renderPeopleList(peopleData);
    renderPagination(peopleData.length)
    renderPeopleList(getPeopleByPages(1))
  })
  .catch((err) => console.log(err));

//展出所有使用者資料
function renderPeopleList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    //avatar, name
    rawHTML += `
          <div class="card text-white bg-secondary mb-3" id="${item.id}"   style="width: 10rem;">
          <button type="button" class="btn" data-toggle="modal" data-target="#user">
          <img src="${item.avatar}" class="card-img-top show-modal" alt="avatar" id="${item.id}"  style="border-radius: 25% 10%">
          </button>
            <div class="card-body text-center">
              <h5 class="card-title">${item.name} ${item.surname}</h5>
            </div>
            <div class="card-footer text-center">
              <button type="button" class="btn btn-dark addFriend" data-id="${item.id}">Add</button>
              </div>
          </div>`
  });
  dataPanel.innerHTML = rawHTML;
}

//觸發modal
dataPanel.addEventListener("click", function onPanelClick(event) {
  if (event.target.matches(".show-modal")) {
    showPeopleModal(Number(event.target.id));
  }
});

//抓取該id資訊
function showPeopleModal(id) {
  const modalName = document.querySelector(".modal-name");
  const modalAvatar = document.querySelector(".modal-avatar");
  const modalInfo = document.querySelector(".modal-info");
  axios.get(BASE_URL + INDEX_URL + id).then((response) => {
    modalName.innerHTML = `${response.data.name + response.data.surname}`;
    modalAvatar.innerHTML = `<img src="${response.data.avatar}" alt="avatar"  style="border-radius: 25% 10%">`;
    modalInfo.innerHTML = `<p><i class="fa fa-venus-mars"></i> Gender: ${response.data.gender}</p>
                  <p><i class="fa fa-address-card"></i> Age: ${response.data.age}</p>
                  <p><i class="fa fa-birthday-cake"></i> Birthday: ${response.data.birthday}</p>
                  <p><i class="fa fa-envelope"></i> Email: ${response.data.email} </p>
                  <p><i class="fa fa-globe"></i> Region: ${response.data.region}</p>`;
  });
}

//分頁數
function renderPagination(amount) {
  const numberOdPage = Math.ceil(peopleData.length / PEOPLE_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOdPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" id ="${page}">${page}</a></li>
    `
  }
  pagination.innerHTML = rawHTML
}

//搜尋
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  filterPeople = peopleData.filter((people) => people.name.toLowerCase().includes(keyword))
  renderPeopleList(filterPeople)
})

//區分分頁資料
function getPeopleByPages(page) {
  const data = filterPeople.length ? filterPeople : peopleData
  const startIndex = (page - 1) * PEOPLE_PER_PAGE
  return data.slice(startIndex, startIndex + PEOPLE_PER_PAGE)
}

pagination.addEventListener('click', function (event) {
  console.log(event.target)
  if (event.target.tagName !== 'A') return
  let page = Number(event.target.innerHTML)
  renderPeopleList(getPeopleByPages(page))
})

dataPanel.addEventListener('click', function (event) {
  if (event.target.className.includes("addFriend")) {
    console.log(Number(event.target.dataset.id))
    addToFavorite(Number(event.target.dataset.id))
  }
})

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favorite')) || []
  const people = peopleData.find(person => person.id === id)
  if (list.some((person) => person.id === id)) {
    alert('此用戶已經在收藏清單中')
    return
  }
  list.push(people)
  localStorage.setItem('favorite', JSON.stringify(list))
}