const utils = require('./utils');


const Selectors = {
  CLOSE: '.js-close-mobile-nav',
  REVEAL: '.js-reveal-mobile-nav',
  ROOT: '.js-mobile-nav'
};

const REVEAL_CLASS_NAME = 'mobile-nav--is-visible';

const ARIA_ATTRIBUTE = 'aria-hidden';


class MobileNav {
  constructor() {
    this.root = document.querySelector(Selectors.ROOT);

    // Reveals the mobile nav.
    utils.delegate(document.body, Selectors.REVEAL, 'click', () => {
      this.root.classList.add(REVEAL_CLASS_NAME);
      this.root.setAttribute(ARIA_ATTRIBUTE, false);
    });

    // Closes the mobile nav.
    utils.delegate(document.body, Selectors.CLOSE, 'click', () => {
      this.root.classList.remove(REVEAL_CLASS_NAME);
      this.root.setAttribute(ARIA_ATTRIBUTE, true);
    });
  }
}

module.exports.init = () => new MobileNav;
