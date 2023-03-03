export class Card {
    #data;
    #selectorTemplate;
    #element;
    #handleClickCatImage;
    #handleCatTitle;
    #getTemplate(){
        const template = document.querySelector(this.#selectorTemplate).content.querySelector('.card');
        return template
    }

    constructor(data, selectorTemplate, handleClickCatImage, handleCatTitle) {
        this.#data = data;
        this.#selectorTemplate = selectorTemplate;
        this.#handleClickCatImage = handleClickCatImage;
        this.#handleCatTitle = handleCatTitle;
    }

    getElement() {
        this.#element = this.#getTemplate().cloneNode(true);
        this.cardTitleElement = this.#element.querySelector('.card__name');
        this.cardImageElement = this.#element.querySelector('.card__image');
        this.cardLikeElement = this.#element.querySelector('.card__like');

        this.cardTitleElement.textContent = this.#data.name
        this.cardImageElement.src = this.#data.image

        if(!this.#data.favorite) {
            this.cardLikeElement.remove()
        }

        this.cardImageElement.addEventListener('click', () => {
            this.#handleClickCatImage(this.#data.image);
        })

            this.setEventListener();
        //Наполнять карточку
        return this.#element;
    }

    setEventListener() {
        this.cardTitleElement.addEventListener('click', this.#handleCatTitle)
    }


}

