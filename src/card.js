export class Card {
    #data;
    #selectorTemplate;
    #element;
    #handleCatTitle;
    #handleClickCatImage;
    #getTemplate(){
        return document.querySelector(this.#selectorTemplate).content.querySelector('.card');
    }

    constructor(data, selectorTemplate, handleCatTitle, handleClickCatImage) {
        this.#data = data;
        this.#selectorTemplate = selectorTemplate;
        this.#handleCatTitle = handleCatTitle;
        this.#handleClickCatImage = handleClickCatImage;
    }

    getElement() {
        this.#element = this.#getTemplate().cloneNode(true);
        this.cardTitleElement = this.#element.querySelector('.card__name');
        this.cardImageElement = this.#element.querySelector('.card__image');
        this.cardLikeElement = this.#element.querySelector('.card__like');
        
        if(!this.#data.favorite) {
            this.cardLikeElement.remove()
        }

        this.cardTitleElement.textContent = this.#data.name;
        this.cardImageElement.src = this.#data.image;
        this.setEventListener();
        return this.#element;
    }

    setEventListener() {
        this.cardTitleElement.addEventListener('click', this.#handleCatTitle)
        this.cardImageElement.addEventListener('click', () => this.#handleClickCatImage(this.#data))
    }


}

