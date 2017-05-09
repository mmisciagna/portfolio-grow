const utils = require('./utils');


const ModalClassNames = {
  CONTENT_ACTIVE: 'modal__content--is-active',
  DISABLE_SCROLLING: 'no-scroll',
  OVERLAY_ACTIVE: 'modal-overlay--is-active',
  ROOT_ACTIVE: 'modals--is-active'
}

const ModalAttributes = {
  MODAL: 'modal',
  REVEAL: 'reveal-modal',
  VIDEO_PLAYER: 'yt-player'
}

const Selectors = {
  CLOSE: '[close-modal]',
  CONTENT: '.js-modal-content',
  MODAL: `[${ModalAttributes.MODAL}]`,
  OVERLAY: '.js-modals-overlay',
  REVEAL: `[${ModalAttributes.REVEAL}]`,
  ROOT: '.js-modals',
  VIDEO_PLAYER: `[${ModalAttributes.VIDEO_PLAYER}]`
}

const ESCAPE_KEYCODE = 27;
const SM_DESKTOP_WIDTH = 900;
const OVERLAY = document.querySelector(Selectors.OVERLAY);
const ALL_CONTENT = document.querySelectorAll(Selectors.CONTENT);


class Modal {
  constructor() {
    this.root = document.querySelector(Selectors.ROOT);
    this.modalContent;
    this.player;
    this.videoList = {};

    this.registerModalEvents();
  }

  getModalContent(target) {
    const targetName = target.getAttribute(ModalAttributes.REVEAL);
    this.modalContent = this.root.querySelector(
        `[${ModalAttributes.MODAL}="${targetName}"]`);
    this.setupVideo();
  }

  setupVideo() {
    const playerEl = this.modalContent.querySelector(Selectors.VIDEO_PLAYER);
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
    this.getModalContent(target);

    ALL_CONTENT.forEach((content) => {
      content.classList.remove(ModalClassNames.CONTENT_ACTIVE);
    });

    this.modalContent.classList.add(ModalClassNames.CONTENT_ACTIVE);
    OVERLAY.classList.add(ModalClassNames.OVERLAY_ACTIVE);
    this.root.classList.add(ModalClassNames.ROOT_ACTIVE);
    document.body.classList.add(ModalClassNames.DISABLE_SCROLLING);
    this.root.setAttribute('aria-hidden', false);
  }

  closeModal() {
    this.player.pauseVideo();
    OVERLAY.classList.remove(ModalClassNames.OVERLAY_ACTIVE);
    this.root.classList.remove(ModalClassNames.ROOT_ACTIVE);
    document.body.classList.remove(ModalClassNames.DISABLE_SCROLLING);
    this.root.setAttribute('aria-hidden', true);
  }

  handelKeyEvents(e) {
    if (this.root &&
        this.root.classList.contains(ModalClassNames.ROOT_ACTIVE) &&
        e.keyCode == ESCAPE_KEYCODE) {
      this.closeModal();
    }
  }

  registerModalEvents() {
    utils.delegate(document.body, Selectors.REVEAL, 'click',
        this.revealModal.bind(this));
    utils.delegate(document.body, Selectors.CLOSE, 'click',
        this.closeModal.bind(this));

    document.body.addEventListener('keyup', this.handelKeyEvents.bind(this));
  }
};

module.exports.init = () => new Modal();
