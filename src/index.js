import { api } from './api.js';
import { Card } from './card.js';
import { cats } from './cats.js';
import { PopupWithImage } from './popup-image.js';
import { Popup } from './popup.js';
import './utils.js';

const cardsContainer = document.querySelector(".cards");
const btnOpenFormAdd = document.querySelector("#add");
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
  btnOpenPopupLogin.classList.remove('visually-hidden');
  popupLogin.close()

}

formCatAdd.addEventListener("submit", handleFormAddCat);
formLogin.addEventListener("submit", handleFormLogin);

btnOpenFormAdd.addEventListener("click", (e) => {
  e.preventDefault();
  popupAdd.open();
});

api.getAllCats()
  .then(dataCats => {
    dataCats.forEach((catData) => {
        const newElement = new Card(catData, "#card-template", handleClickCatImage);
        cardsContainer.prepend(newElement.getElement());
      });
  })    
  .catch(function(err){
    console.log(err);
  })        

  if(!isAuth) {
    popupLogin.open();
    btnOpenFormAdd.classList.add('visually-hidden');
  } else {
    btnOpenPopupLogin.classList.add('visually-hidden');
  }

popupAdd.setEventListener();
popupImage.setEventListener();
popupLogin.setEventListener();


