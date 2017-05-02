const utils = require('./utils');


const Selectors = {
  CONTENT: '.js-accordion-content',
  ITEM: '.js-accordion-item',
  TOGGLE: '.js-accordion-toggle'
};

const EXPANDED_CLASSNAME = 'accordion__item--is-expanded';

const ARIA = 'aria-expanded';


class Accordion {
  constructor(root) {
    this.root = root;
    this.toggleBtn = this.root.querySelector(Selectors.TOGGLE);
    this.content = this.root.querySelector(Selectors.CONTENT);
    this.children = Array.from(this.content.children);
    this.contentHeight = 0;

    this.setContentMaxHeight();
    this.registerAccordionEvents();
  }

  isExpanded() {
    return this.root.classList.contains(EXPANDED_CLASSNAME);
  }

  getContentHeight() {
    this.contentHeight = 0;

    this.children.forEach((child) => {
      let style = getComputedStyle(child);
      let height = child.offsetHeight;

      height += parseInt(style.marginTop) + parseInt(style.marginBottom);
      this.contentHeight += height;
    });
  }

  setMaxHeight() {
    this.content.style.maxHeight = this.isExpanded() ?
        this.contentHeight + 'px': 0;
  }

  setContentMaxHeight() {
    this.getContentHeight();
    this.setMaxHeight();
  }

  toggle() {
    this.root.classList.toggle(EXPANDED_CLASSNAME);
    this.content.setAttribute(ARIA, this.isExpanded());
    this.setContentMaxHeight();
  }

  registerAccordionEvents() {
    window.addEventListener('resize', this.setContentMaxHeight.bind(this));
    utils.delegate(this.toggleBtn, Selectors.TOGGLE, 'click',
        this.toggle.bind(this));
  }
}

module.exports.init = () => {
  const accordionItems = document.querySelectorAll(Selectors.ITEM);
  accordionItems.forEach((item) => {
    new Accordion(item);
  });
};
