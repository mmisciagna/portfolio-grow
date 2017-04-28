const utils = require('./utils');

const Selectors = {
  CLOSE: '.js-close-mobile-nav',
  REVEAL: '.js-reveal-mobile-nav',
  ROOT: '.js-mobile-nav'
};

const REVEAL_CLASS_NAME = 'mobile-nav--is-visible';


module.exports = class MobileNav {
  constructor() {
    this.root = document.querySelector(Selectors.ROOT);

    // Reveals the mobile nav.
    utils.delegate(document.body, Selectors.REVEAL, 'click', () => {
      this.root.classList.add(REVEAL_CLASS_NAME);
    });

    // Closes the mobile nav.
    utils.delegate(document.body, Selectors.CLOSE, 'click', () => {
      this.root.classList.remove(REVEAL_CLASS_NAME);
    });
  }
};
