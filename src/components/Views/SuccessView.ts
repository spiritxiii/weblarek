import { Component } from '../base/Component';
import { IOrderResponse } from '../../types/index';

export class SuccessView extends Component<IOrderResponse> {
  private titleElement: HTMLElement;
  private descriptionElement: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    const titleElement = this.container.querySelector('.order-success__title');
    if (!(titleElement instanceof HTMLElement)) {
      throw new Error('Элемент заголовка успешного оформления не найден');
    }
    this.titleElement = titleElement;

    const descriptionElement = this.container.querySelector('.order-success__description');
    if (!(descriptionElement instanceof HTMLElement)) {
      throw new Error('Элемент описания успешного оформления не найден');
    }
    this.descriptionElement = descriptionElement;

    const closeButton = this.container.querySelector('.order-success__close');
    if (!(closeButton instanceof HTMLButtonElement)) {
      throw new Error('Кнопка закрытия успешного оформления не найдена');
    }
    this.closeButton = closeButton;
  }

  setTotalPrice(total: number): void {
    this.setText(this.descriptionElement, `Списано ${total} синапсов`);
  }

  setCloseHandler(handler: (event: MouseEvent) => void): void {
    this.closeButton.addEventListener('click', handler);
  }
}