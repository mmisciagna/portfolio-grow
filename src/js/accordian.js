const utils = require('./utils');


const Selectors = {
  CONTENT: '.js-accordian-content',
  ITEM: '.js-accordian-item',
  TOGGLE: '.js-accordian-toggle'
};

const EXPANDED_CLASSNAME = 'accordian__item--is-expanded';


class Accordian {
  constructor(root) {
    this.root = root;
    this.toggleBtn = this.root.querySelector(Selectors.TOGGLE);
    this.content = this.root.querySelector(Selectors.CONTENT);

    this.contentHeight = this.content.clientHeight;
    this.content.style.maxHeight = 0;

    utils.delegate(this.toggleBtn, Selectors.TOGGLE, 'click',
        this.toggle.bind(this));
  }

  toggle() {
    this.root.classList.toggle(EXPANDED_CLASSNAME);

    if (this.root.classList.contains(EXPANDED_CLASSNAME)) {
      this.content.style.maxHeight = this.contentHeight + 'px';
    } else {
      this.content.style.maxHeight = 0;
    }
  }
}

module.exports.init = () => {
  const accordianItems = document.querySelectorAll(Selectors.ITEM);
  accordianItems.forEach((item) => {
    new Accordian(item);
  });
};
