import { Popup } from "./popup.js";


export class PopupImage extends Popup {
  
  open(data) {
      console.log(data);
    const imagePopup = this._popupElement.querySelector('.popup__image');
    imagePopup.src = data.image;
    
    super.open();
  }
}