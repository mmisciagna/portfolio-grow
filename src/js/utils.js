const utils = {
  /**
   * Sets up event delegation. Listens for events on a parent that are bubbled
   * up from children that match the given query selector.
   * @param {!Element} element Parent element to listen on.
   * @param {string} selector Query selector for children.
   * @param {string} eventName Name of event to listen for (first argument of
   *     addEventListener).
   * @param {!function} handler Function to call. Receives the event as an
   *     argument.
   */
  delegate(element, selector, eventName, handler) {
    element.addEventListener(eventName, (e) => {
      let target = e.target;
      while (target) {
        if (utils.matches(target, selector)) {
          handler(target);
          break;
        }
        target = target.parentElement;
      }
    }, false);
  },

  /**
   * Determines whether the given element matches the given query selector.
   * Polyfill for the native Element.prototype.matches.
   * @param {!Element} element
   * @param {string} selector
   */
  matches(element, selector) {
    if (Element.prototype.matches) {
      return element.matches(selector);
    } else {
      const matches = Element.prototype.matchesSelector ||
          Element.prototype.mozMatchesSelector ||
          Element.prototype.msMatchesSelector ||
          Element.prototype.oMatchesSelector ||
          Element.prototype.webkitMatchesSelector;
      return matches.call(element, selector);
    }
  },
};

module.exports = utils;
