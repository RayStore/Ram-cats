export class Card {
    #data;
    #selectorTemplate;
    #element;
    #handleCatTitle;
    #handleClickCatImage;
    #handleLikeCard;
    #getTemplate(){
        const template = document.querySelector(this.#selectorTemplate).content.querySelector('.card');
        return template
    }

    constructor(data, selectorTemplate, handleCatTitle, handleClickCatImage, handleLikeCard) {
        this.#data = data;
        this.#selectorTemplate = selectorTemplate;
        this.#handleCatTitle = handleCatTitle;
        this.#handleClickCatImage = handleClickCatImage;
        this.#handleLikeCard = handleLikeCard;
    }

    _updateViewLike(){
        if(this.#data.favorite) {
            this.cardLikeElement.classList.add('card__like_active');
        } else {
            this.cardLikeElement.classList.remove('card__like_active');
        } 
    }

    _setLikeCat = () => {
        this.#data.favorite = !this.#data.favorite;
        this.#handleLikeCard(this.#data, this); 
    }


    getElement() {
        this.#element = this.#getTemplate().cloneNode(true);
        this.cardTitleElement = this.#element.querySelector('.card__name');
        this.cardImageElement = this.#element.querySelector('.card__image');
        this.cardLikeElement = this.#element.querySelector('.card__like');

        this.updateView();

            this.setEventListener();
        //Наполнять карточку
        return this.#element;
    }

    getData() {
        return this.#data;
    }

    getId() {
        return this.#data.id;
    }

    setData(newData) {
        this.#data = newData;
    }

    updateView() {
        this.cardTitleElement.textContent = this.#data.name;
        this.cardImageElement.src = this.#data.image;

        this._updateViewLike(); 
    }

    deleteView() {
        this.#element.remove();
        this.#element = null;
    }

    setEventListener() {
        this.cardTitleElement.addEventListener('click', () => this.#handleCatTitle(this))
        this.cardImageElement.addEventListener('click', () => this.#handleClickCatImage(this.#data))
        this.cardLikeElement.addEventListener('click', () => this._setLikeCat())
    }


}

