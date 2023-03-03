import { api } from './api.js';
import { Card } from './card.js';
import { cats } from './cats.js';
import { PopupWithImage } from './popup-image.js';
import { Popup } from './popup.js';
import './utils.js';

const cardsContainer = document.querySelector(".cards");
const btnOpenFormAdd = document.querySelector("#add");
const btnOpenFormAddLogin = document.querySelector("#login");
const formCatAdd = document.querySelector("#popup-form-add");
const formLogin = document.querySelector("#popup-form-login");
const isAuth = Cookies.get("email");
console.log(isAuth); 

const popupAdd = new Popup("popup-add");
const popupImage = new PopupWithImage("popup-cat-image");
const popupLogin = new Popup("popup-login")

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

function handleFormAddCat(e) {
  e.preventDefault();
  const elementsFormCat = [...formCatAdd.elements];
  const formData = serializeForm(elementsFormCat);
  api.addNewCat(formData)
    .then(function() {
      const newElement = new Card(formData, "#card-template", handleClickCatImage);
      cardsContainer.prepend(newElement.getElement());
      popupAdd.close();
      })
      .catch(function(err){
      console.log(err);
      })

}  
    
function handleClickCatImage(dataSrc) {
  popupImage.open(dataSrc);
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

function checkLocalStorage() {
  const localData = JSON.parse(localStorage.getItem('cats')); // нулевое значение, если нет данных
  if(localData && localData.length) {
    localData.forEach((catData) => {
      const newElement = new Card(catData, "#card-template", handleClickCatImage);
      cardsContainer.prepend(newElement.getElement());
    });
  } else {
    api.getAllCats()
      .then(dataCats => {
          dataCats.forEach((catData) => {
            const newElement = new Card(catData, "#card-template", handleClickCatImage);
            cardsContainer.prepend(newElement.getElement());
          });

          localStorage.setItem('cats', JSON.stringify(dataCats))

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
popupImage.setEventListener();
popupLogin.setEventListener();

checkLocalStorage()

