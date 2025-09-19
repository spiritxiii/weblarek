import { Card } from './Card';
import { IProduct } from '../../../types';

export class CardBasket extends Card<IProduct> {
  private indexElement: HTMLElement;
  private deleteButton: HTMLButtonElement;
  
  constructor(container: HTMLElement) {
    super(container);

    const indexElement = this.container.querySelector('.basket__item-index');
    if (!(indexElement instanceof HTMLElement)) {
      throw new Error('DOM-элемент для порядкового номера товара в корзине не найден');
    }
    this.indexElement = indexElement;

    const deleteButton = this.container.querySelector('.basket__item-delete');
    if (!(deleteButton instanceof HTMLButtonElement)) {
      throw new Error('Кнопка удаления товара из корзины не найдена');
    }
    this.deleteButton = deleteButton;
  }

  set index(index: number) {
    this.setText(this.indexElement, index.toString());
  }

  setDeleteHandler(handler: (event: MouseEvent) => void): void {
    this.deleteButton.addEventListener('click', handler);
  }
}