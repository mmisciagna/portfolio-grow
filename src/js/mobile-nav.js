const utils = require('./utils');


const Selectors = {
  CLOSE: '.js-close-mobile-nav',
  ITEMS: '.js-mobile-nav-item',
  REVEAL: '.js-reveal-mobile-nav',
  ROOT: '.js-mobile-nav'
};

const ClassNames = {
  ANIMATE_ITEM: 'mobile-nav__item--animate-in',
  REVEAL: 'mobile-nav--is-visible'
};

const ARIA_ATTRIBUTE = 'aria-hidden';


class MobileNav {
  constructor() {
    this.root = document.querySelector(Selectors.ROOT);
    this.items = this.root.querySelectorAll(Selectors.ITEMS);

    utils.delegate(document.body, Selectors.REVEAL, 'click',
        this.reveal.bind(this));
    utils.delegate(document.body, Selectors.CLOSE, 'click',
        this.close.bind(this));
  }

  reveal() {
    this.root.classList.add(ClassNames.REVEAL);
    this.root.setAttribute(ARIA_ATTRIBUTE, false);
    let index = 0;

    const interval = setInterval(() => {
      this.items[index++].classList.add(ClassNames.ANIMATE_ITEM);
      if (index === this.items.length) clearInterval(interval);
    }, 100);
  }

  close() {
    this.root.classList.remove(ClassNames.REVEAL);
    this.root.setAttribute(ARIA_ATTRIBUTE, true);

    this.items.forEach((item) => {
      item.classList.remove(ClassNames.ANIMATE_ITEM);
    });
  }
}

module.exports.init = () => new MobileNav;
