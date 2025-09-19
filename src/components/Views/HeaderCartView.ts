import { Component } from '../base/Component';
import { IBasketCount } from '../../types/index';

export class HeaderCartView extends Component<IBasketCount> {
  private basketButton: HTMLButtonElement;
  private basketCounter: HTMLElement;

  constructor(container: HTMLButtonElement) {
    super(container);

    this.basketButton = container;

    const basketCounter = this.basketButton.querySelector('.header__basket-counter');
    if (!(basketCounter instanceof HTMLElement)) {
      throw new Error('В шапке сайта не найден счетчик товаров в корзине');
    }
    this.basketCounter = basketCounter;
  }

  set count(count: number) {
    this.setText(this.basketCounter, count.toString());
  }

  setBasketClickHandler(handler: (event: MouseEvent) => void): void {
    this.basketButton.addEventListener('click', handler);
  }
}