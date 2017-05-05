const utils = require('./utils');


const ModalClassNames = {
  ACTIVE: 'modal--is-active',
  DISABLE_SCROLLING: 'no-scroll',
  OVERLAY_ACTIVE: 'modal-overlay--is-active'
}

const ModalAttributes = {
  MODAL: 'modal',
  REVEAL: 'reveal-modal',
  VIDEO_PLAYER: 'yt-player'
}

const Selectors = {
  CLOSE: '[close-modal]',
  MODAL: `[${ModalAttributes.MODAL}]`,
  OVERLAY: '.modal-overlay',
  REVEAL: `[${ModalAttributes.REVEAL}]`,
  VIDEO_PLAYER: `[${ModalAttributes.VIDEO_PLAYER}]`
}

const ESCAPE_KEYCODE = 27;
const MAX_MOBILE_WIDTH = 600;
const OVERLAY = document.querySelector(Selectors.OVERLAY);

class Modal {
  constructor() {
    this.modal;
    this.player;
    this.videoList = {};

    this.registerModalEvents();
  }

  getModal(target) {
    const modalName = target.getAttribute(ModalAttributes.REVEAL);
    this.modal = document.querySelector(
        `[${ModalAttributes.MODAL}="${modalName}"]`);
    this.positionModal();
    this.setupVideo();
  }

  positionModal() {
    if (this.modal) {
      if (window.innerWidth > MAX_MOBILE_WIDTH) {
        const modalWidth = this.modal.offsetWidth;
        const modalHeight = this.modal.offsetHeight;
        this.modal.style.left = `calc(50% - ${modalWidth / 2}px)`;
        this.modal.style.top = `calc(50% - ${modalHeight / 2}px)`;
      } else {
        this.modal.removeAttribute('style');
      }
    }
  }

  setupVideo() {
    const playerEl = this.modal.querySelector(Selectors.VIDEO_PLAYER);
    const playerId = playerEl.getAttribute('id');
    const videoId = playerEl.getAttribute(ModalAttributes.VIDEO_PLAYER);

    if (this.videoList[videoId]) {
      this.player = this.videoList[videoId]
      this.player.playVideo();
    } else {
      this.player = new YT.Player(playerId, {
        videoId: videoId,
        events: {
          'onReady': () => {
            const videoId = this.player.getVideoData().video_id;
            this.videoList[videoId] = this.player;
          }
        },
        playerVars: {
          autoplay: 1,
          rel: 0,
          showinfo: 0
        }
      });
    }
  }

  revealModal(target) {
    this.getModal(target);
    OVERLAY.classList.add(ModalClassNames.OVERLAY_ACTIVE);
    this.modal.classList.add(ModalClassNames.ACTIVE);
    this.modal.setAttribute('aria-hidden', false);
    document.body.classList.add(ModalClassNames.DISABLE_SCROLLING);
  }

  closeModal() {
    this.player.pauseVideo();
    OVERLAY.classList.remove(ModalClassNames.OVERLAY_ACTIVE);
    this.modal.classList.remove(ModalClassNames.ACTIVE);
    this.modal.setAttribute('aria-hidden', true);
    document.body.classList.remove(ModalClassNames.DISABLE_SCROLLING);
  }

  handelKeyEvents(e) {
    if (this.modal &&
        this.modal.classList.contains(ModalClassNames.ACTIVE) &&
        e.keyCode == ESCAPE_KEYCODE) {
      this.closeModal();
    }
  }

  registerModalEvents() {
    utils.delegate(document.body, Selectors.REVEAL, 'click',
        this.revealModal.bind(this));
    utils.delegate(document.body, Selectors.CLOSE, 'click',
        this.closeModal.bind(this));

    window.addEventListener('resize', this.positionModal.bind(this));
    document.body.addEventListener('keyup', this.handelKeyEvents.bind(this));
  }
};

module.exports.init = () => new Modal();
