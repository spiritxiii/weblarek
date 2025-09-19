import { Component } from '../../base/Component';

export class Card<T> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    const titleElement = this.container.querySelector('.card__title');
    if (!(titleElement instanceof HTMLElement)) {
      throw new Error('DOM-элемент для названия товара не найден');
    }
    this.titleElement = titleElement;

    const priceElement = this.container.querySelector('.card__price');
    if (!(priceElement instanceof HTMLElement)) {
      throw new Error('DOM-элемент для стоимости товара не найден');
    }
    this.priceElement = priceElement;
  }

  protected set title(text: string) {
    this.setText(this.titleElement, text);
  }

  protected set price(value: number | null) {
    this.setText(this.priceElement, value ? `${value} синапсов` : 'Бесценно');
  }
}