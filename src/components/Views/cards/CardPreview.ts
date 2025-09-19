import { CardFullInfo } from './CardFullInfo';

export class CardPreview extends CardFullInfo {
  private descriptionElement: HTMLElement;
  private button: HTMLButtonElement;
  
  constructor(container: HTMLElement) {
    super(container);

    const descriptionElement = this.container.querySelector('.card__text');
    if (!(descriptionElement instanceof HTMLElement)) {
      throw new Error('DOM-элемент для описания товара не найден');
    }
    this.descriptionElement = descriptionElement;

    const button = this.container.querySelector('.card__button');
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('Кнопка "В корзину" не найдена');
    }
    this.button = button;
  }

  set description(text: string) {
    this.setText(this.descriptionElement, text);
  }

  setButtonDisabled(disabled: boolean, newText: string | null = null): void {
    this.setDisabled(this.button, disabled, newText);
  }

  setButtonText(text: string): void {
    this.setText(this.button, text);
  }

  setButtonHandler(handler: (event: MouseEvent) => void): void {
    this.button.addEventListener('click', handler);
  }
}