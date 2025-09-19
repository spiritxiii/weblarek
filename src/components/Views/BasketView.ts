import { Component } from '../base/Component';
import { IProduct, IBasketProduct } from '../../types/index';
import { CardBasket } from '../Views/cards/CardBasket';
import { EventEmitter } from '../base/Events';

export class BasketView extends Component<IBasketProduct[]> {
  private listElement: HTMLElement;
  private priceElement: HTMLElement;
  private button: HTMLButtonElement;
  public eventBroker: EventEmitter;
  public isOpen: boolean = false;

  constructor(container: HTMLElement, eventBroker: EventEmitter) {
    super(container);
    this.eventBroker = eventBroker;

    const listElement = this.container.querySelector('.basket__list');
    if (!(listElement instanceof HTMLElement)) {
      throw new Error('Контейнер корзины не найден');
    }
    this.listElement = listElement;

    const priceElement = this.container.querySelector('.basket__price');
    if (!(priceElement instanceof HTMLElement)) {
      throw new Error('DOM-элемент с общей стоимостью товаров не найден');
    }
    this.priceElement = priceElement;

    const button = this.container.querySelector('.basket__button');
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('Кнопка оформления товара в корзине не найдена');
    }
    this.button = button;
  }

  setItems(items: IProduct[]): void {
    this.listElement.innerHTML = '';
    
    items.forEach((item, index) => {
      const template = document.getElementById('card-basket') as HTMLTemplateElement;
      const itemElementClone = template.content.cloneNode(true) as HTMLElement;
      const itemElement = itemElementClone.querySelector('.basket__item');
      
      if (!(itemElement instanceof HTMLElement)) {
        throw new Error('Шаблон для товара в корзине не найден');
      }
      
      const card = new CardBasket(itemElement);
      const basketProduct: IBasketProduct = { ...item, index: index + 1 };
      card.render(basketProduct);
      
      // Обработчик удаления товара
      card.setDeleteHandler(() => {
        this.eventBroker.emit('basket:item-remove', { productId: item.id });
      });

      this.listElement.appendChild(itemElement);
    });
  }

  setTotalPrice(price: number): void {
    this.setText(this.priceElement, `${price} синапсов`);
  }

  setButtonDisabled(disabled: boolean): void {
    this.setDisabled(this.button, disabled);
  }

  setOrderHandler(handler: (event: MouseEvent) => void): void {
    this.button.addEventListener('click', handler);
  }
}