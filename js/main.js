let index = 0;
let tickName = document.getElementById('ticketName');
let ticketImgUrl = document.getElementById('ticketImgUrl');
let ticketRegion = document.getElementById('ticketRegion');
let ticketPrice = document.getElementById('ticketPrice');
let ticketNum = document.getElementById('ticketNum');
let ticketRate = document.getElementById('ticketRate');
let ticketDescription = document.getElementById('ticketDescription');
let submit = document.getElementById('submit');
let searchResultText = document.getElementById('searchResult-text');
let searchResultFail = document.querySelector('.searchResultFail');
let ul = document.querySelector('.ticketCard-area');
let searchValue = document.querySelector('.searchValue');
let regionSearch = document.querySelector('.regionSearch');
let url = `https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json`;
let searchResult = [];
let data = [];

formInit();
cardInit(true);

submit.addEventListener('click',(e)=>{
    index += 1;
    let ticketData = {
        id: index,
        name: tickName.value,
        imgUrl: ticketImgUrl.value,
        area: ticketRegion.value,
        price: ticketPrice.value,
        group: ticketNum.value,
        rate: ticketRate.value,
        description: ticketDescription.value,
    }

    let checkResult = checkInput();
    if(checkResult != true){
      document.getElementById(checkResult).classList.remove('d-none');
      document.getElementById(checkResult).classList.add('d-block');
      return false;
    }

    data.push(ticketData);
    formInit();
    cardInit(false);
})

regionSearch.addEventListener('click', (e)=>{
    let select = regionSearch.value;
    if(select){
      searchValue.textContent = e.toElement.value;
      getData(e.toElement.value, true);
    }
})

function checkInput(){
  let alert = document.querySelectorAll('.alert-message');

  alert.forEach(item => {
    item.querySelector('p').classList.remove('d-block');
    item.querySelector('p').classList.add('d-none');
  })

  return tickName.value == '' ? 'ticketName-message' 
  : ticketImgUrl.value == '' ? 'ticketImgUrl-message' 
  : ticketRegion.value == '' ? 'ticketRegion-message'
  : (ticketPrice.value == '' || ticketPrice.value == 0 || ticketPrice.value < 0) ? 'ticketPrice-message'
  : (ticketNum.value == '' || ticketNum.value == 0 || ticketNum.value < 0) ? 'ticketNum-message'
  : (ticketRate.value == '' || ticketRate.value > 10 || ticketRate.value <= 0) ? 'ticketRate-message'
  : ticketDescription.value == '' ? 'ticketDescription-message'
  : true
}

function cardInit(state){
  if(state == true){
    axios.get(url).then((res)=>{
      data = res.data.data;
      getData('地區搜尋', false);
    })
  }else{
    getData('地區搜尋', false);
  }
}

function formInit(){
    tickName.value = '';
    ticketImgUrl.value = '';
    ticketRegion.value = '';
    ticketPrice.value = '';
    ticketNum.value = '';
    ticketRate.value = '';
    ticketDescription.value = '';
    regionSearch.value = '地區搜尋';
    searchResultText.classList.remove('d-block');
    searchResultText.classList.add('d-none');
}

function buildTicketCard(ticketData){
    let ticketCardTemplate = `<li class="ticketCardBox col-12 col-sm-6 col-lg-4">
    <div class="ticketCard position-relative rounded-sm mb-xxs-10">
      <div class="ticketCard-img position-relative">
        <a href="#">
          <img class="img-fluid" src="${ticketData.imgUrl}" alt="">
        </a>
        <div class="ticketCard-region position-absolute bg-fountainBlue py-xxs-3 px-xxs-4 text-white border-right-radius top-y-xxs-10">${ticketData.area}</div>
        <div class="ticketCard-rank position-absolute bg-teal py-xxs-3 px-xxs-4 text-white border-right-radius bottom-y-xxs-20">${ticketData.rate}</div>
      </div>
      <div class="ticketCard-content p-xxs-5">
        <div class="mb-xxs-4">
          <h3 class="border-bottom mb-xxs-4">
            <a href="#" class="ticketCard-name text-xxs-sm text-teal">${ticketData.name}</a>
          </h3>
          <p class="ticketCard-description text-gray-600">
          ${ticketData.description}
          </p>
        </div>
        <div class="ticketCard-info d-flex justify-content-between align-items-center">
          <p class="ticketCard-num text-xxs-16 text-teal">
            <span><i class="fas fa-exclamation-circle"></i></span>
            剩下最後 <span id="ticketCard-num"> ${ticketData.group} </span> 組
          </p>
          <div class="ticketCard-price text-teal d-flex align-items-center">
            <span class="text-xxs-xs mr-xxs-1">TWD </span>
            <span id="ticketCard-price" class="text-xxs-lg text-teal">${ticketData.price}</span>
          </div>
        </div>
      </div>
    </div>
  </li>`;
  ul.innerHTML += ticketCardTemplate;
}

function getData(target, state){
  console.log(target, state)
  ul.innerHTML = '';
  searchResult = [];

  data.forEach( item => {
      if(target == item.area || target == '全部地區' || target == "地區搜尋"){
        buildTicketCard(item);
        searchResult.push(item);
      }
  });

  if(state == true){
    searchResultText.classList.remove('d-none');
    searchResultText.classList.add('d-block');
    searchResultText.textContent = `本次搜尋共 ${searchResult.length} 筆資料`;
  }

  if(searchResult.length == 0 && state == true){
    searchResultFail.classList.remove('d-none');
    searchResultFail.classList.add('d-block');
  }else{
    searchResultFail.classList.remove('d-block');
    searchResultFail.classList.add('d-none');
  }
}
