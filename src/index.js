import { api } from './api.js';
import { Card } from './card.js';
import { cats } from './cats.js';
import { PopupImage } from './popup-image.js';
import { Popup } from './popup.js';
import { CatsInfo } from './cats-info.js';
import './utils.js';

const cardsContainer = document.querySelector(".cards");
const btnOpenFormAdd = document.querySelector("#add");
const btnOpenFormAddLogin = document.querySelector("#login");
const formCatAdd = document.querySelector("#popup-form-add-cats");
const formLogin = document.querySelector("#popup-form-login");
const isAuth = Cookies.get("email");
const MAX_LIVE_STORAGE = 5;


const popupAdd = new Popup("popup-add-cats");
const popupLogin = new Popup("popup-login");
const popupCatInfo = new Popup("popup-cat-info");
const popupImage = new PopupImage("popup-image");
const catsInfoInstance = new CatsInfo(
  '#cats-info-template',
  handleEditCatInfo,
  handleLike,
  handleCatDelete
  )


const catsInfoElement = catsInfoInstance.getElement();

function serializeForm(elements) {
  const formData = {};

  elements.forEach((input) => {
    if (input.type === "submit" || input.type === "button") return;
    if (input.type === "checkbox") {
      formData[input.name] = input.checked;
    }
    if (input.type !== "checkbox") {
      formData[input.name] = input.value;
    }
  });

  return formData;
}

function createCat(dataCat) {
  const newElement = new Card(dataCat, "#card-template", handleCatTitle, handleClickCatImage, handleLike);
  cardsContainer.prepend(newElement.getElement());
}

function handleFormAddCat(e) {
  e.preventDefault();
  const elementsFormCat = [...formCatAdd.elements];
  const formData = serializeForm(elementsFormCat);
  api.addNewCat(formData)
    .then(function() {
      createCat(formData);
      updateLocalStorage(formData, {type: 'ADD_CAT'});
      popupAdd.close();
      })
      .catch(function(err){
      console.log(err);
      })

}  
    
function handleClickCatImage(dataCard) {
  popupImage.open(dataCard);
}

function handleLike(data, cardInstance){
  const {id, favorite} = data;
  api.updateCatById(id, {favorite})
    .then(() => {
      if(cardInstance) {
        cardInstance.setData(data);
        cardInstance.updateView();
      }
      updateLocalStorage(data, {type: 'EDIT_CAT'});
      console.log('лайк изменен');
    })
} 


function handleCatDelete(cardInstance) {
  api.deleteCatById(cardInstance.getId())
    .then(() => {
      cardInstance.deleteView();
      
      updateLocalStorage(cardInstance.getData(), {type: 'DELETE_CAT'}); 
      popupCatInfo.close();
    })
}

function handleEditCatInfo(cardInstance, data) {
  const {age, description, name, id} = data;

  api.updateCatById(id, {age, description, name})
    .then(() => {
      cardInstance.setData(data);
      cardInstance.updateView();
      
      updateLocalStorage(data, {type: 'EDIT_CAT'}); 
      popupCatInfo.close();
    })
}

function handleCatTitle(cardInstance){
  catsInfoInstance.setData(cardInstance); 
  popupCatInfo.setContent(catsInfoElement); 
  popupCatInfo.open();
}

function handleFormLogin(e) {
  e.preventDefault();
  const elementsFormLogin = [...formLogin.elements];
  const formData = serializeForm(elementsFormLogin);
  Cookies.set("email", formData.email, {expires: 5});
  btnOpenFormAdd.classList.remove('visually-hidden');
  btnOpenFormAddLogin.classList.add('visually-hidden');
  popupLogin.close()

}

btnOpenFormAdd.addEventListener("click", (e) => {
  e.preventDefault();
  popupAdd.open();
});

btnOpenFormAddLogin.addEventListener("click", (e) => {
  e.preventDefault();
  popupLogin.open();
});

function setDataRefresh(minute, key) {
  const setTime = new Date(new Date().getTime() + minute*60000);
  localStorage.setItem(key, setTime);
  return setTime;  
}

function updateLocalStorage(data, action) { // {type: 'ADD_CAT'} {type: 'ALL_CATS'} 
  const oldStorage = JSON.parse(localStorage.getItem('cats'));

  switch (action.type) {
    case 'ADD_CAT': 
      oldStorage.push(data);
      localStorage.setItem('cats', JSON.stringify(oldStorage));  
      return;
    case 'ALL_CATS':
      setDataRefresh(MAX_LIVE_STORAGE, 'catsRefresh');    
      localStorage.setItem('cats', JSON.stringify(data));
      return;
    case 'DELETE_CAT': 
      const newStorage = oldStorage.filter(cat => cat.id !== data.id)
      localStorage.setItem('cats', JSON.stringify(newStorage));
      return;
    case 'EDIT_CAT':
      const updateStorage = oldStorage.map(cat => cat.id === data.id ? data : cat); 
      localStorage.setItem('cats', JSON.stringify(updateStorage));
      return;
    default:
      break;
  } 
}

function checkLocalStorage() {
  const localData = JSON.parse(localStorage.getItem('cats')); // нулевое значение, если нет данных
  const getTimeExpires = localStorage.getItem('catsRefresh'); 
  
  if(localData && localData.length && new Date() < new Date(getTimeExpires)){
    localData.forEach((catData) => {
      createCat(catData);
    });
  } else {
    api.getAllCats()
      .then(dataCats => {
          dataCats.forEach((catData) => {
            createCat(catData);
          }); 
          updateLocalStorage(dataCats, {type: 'ALL_CATS'});

      })
      .catch(function(err){
        console.log(err);
      })
  }
}

formCatAdd.addEventListener("submit", handleFormAddCat);
formLogin.addEventListener("submit", handleFormLogin);

if(!isAuth) {
  popupLogin.open();
  btnOpenFormAdd.classList.add('visually-hidden');
} else {
  btnOpenFormAddLogin.classList.add('visually-hidden');
}

popupAdd.setEventListener();
popupLogin.setEventListener();
popupCatInfo.setEventListener();
popupImage.setEventListener();



checkLocalStorage()

