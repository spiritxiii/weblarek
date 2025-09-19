import { EventEmitter } from '../base/Events';

export class ModalView {
  private container: HTMLElement;
  private closeButton: HTMLButtonElement;
  private contentElement: HTMLElement;
  public eventBroker: EventEmitter;

  constructor(eventBroker: EventEmitter) {
    this.eventBroker = eventBroker;

    const container = document.getElementById('modal-container');
    if (!(container instanceof HTMLElement)) {
      throw new Error('Контейнер модального окна не найден');
    }
    this.container = container;

    const closeButton = this.container.querySelector('.modal__close');
    if (!(closeButton instanceof HTMLButtonElement)) {
      throw new Error('Кнопка закрытия модального окна не найдена');
    }
    this.closeButton = closeButton;

    const contentElement = this.container.querySelector('.modal__content');
    if (!(contentElement instanceof HTMLElement)) {
      throw new Error('DOM-элемент для содержимого модального окна не найден');
    }
    this.contentElement = contentElement;
  }

  open(content: HTMLElement): void {
    this.contentElement.innerHTML = '';
    this.contentElement.appendChild(content);
    this.container.classList.add('modal_active');
  }

  close(): void {
    this.container.classList.remove('modal_active');
    this.contentElement.innerHTML = '';

    this.eventBroker.emit('modal:close');
  }

  setCloseHandler(handler: (event: MouseEvent) => void): void {
    this.closeButton.addEventListener('click', handler);
    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        handler(event as MouseEvent);
      }
    });
  }

  clearContent(): void {
    this.contentElement.innerHTML = '';
  }
}