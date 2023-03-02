
import { api } from './api.js';
import { Card } from './card.js';
import { cats } from './cats.js';
import { PopupWithImage } from './popup-image.js';
import { Popup } from './popup.js';

const cardsContainer = document.querySelector(".cards");
const btnOpenPopup = document.querySelector(".btn");
const formCatAdd = document.querySelector("#popup-form-add");


const popupAdd = new Popup("popup-add");
const popupImage = new PopupWithImage("popup-cat-image");

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


formCatAdd.addEventListener("submit", handleFormAddCat);

btnOpenPopup.addEventListener("click", (e) => {
  e.preventDefault();
  popupAdd.open();
});

api.getAllCats()
  .then(dataCats => {
    dataCats.forEach((catData) => {
        const newElement = new Card(catData, "#card-template", handleClickCatImage);
        cardsContainer.append(newElement.getElement());
      });
  })    
  .catch(function(err){
    console.log(err);
  })        

popupAdd.setEventListener();
popupImage.setEventListener();


