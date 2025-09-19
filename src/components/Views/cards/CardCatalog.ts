import { CardFullInfo } from './CardFullInfo';

export class CardCatalog extends CardFullInfo {
  private button: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    if (!(this.container instanceof HTMLButtonElement)) {
        throw new Error('Контейнер не найден');
    }
    this.button = this.container;
  }

  setButtonHandler(handler: (event: MouseEvent) => void): void {
    this.button.addEventListener('click', handler);
  }
}