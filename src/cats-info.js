export class CatsInfo {
    constructor(
        selectorTemplate,
        handleEditCatInfo,
        handleLikeCat,
        handleDeleteCat
        ) {
            this._selectorTemplate = selectorTemplate;
            this._handleEditCatInfo = handleEditCatInfo;
            this._handleLikeCat = handleLikeCat;
            this._handleDeleteCat = handleDeleteCat;
            this._data = {};    
    }

    setData() {
                     
    }

    _getTemplate(){ //возвращает содержимое шаблона в виде DOM-узла
        return document.querySelector(this.#selectorTemplate).content.children[0];
    } 

    getElement() {     
        this.element = this._getTemplate().cloneNode(true);

        
    }        
}       