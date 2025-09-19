import { IProduct } from '../../types/index';
import { EventEmitter } from '../base/Events';

export class Cart {
  private items: IProduct[] = [];
  public eventBroker: EventEmitter;

  constructor(eventBroker: EventEmitter) {
    this.eventBroker = eventBroker;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    this.items.push(product);

    this.eventBroker.emit('cart:changed', { items: this.items });
    this.eventBroker.emit('cart:item-added', { product, items: this.items });
  }

  removeItem(product: IProduct): void {
    const index = this.items.findIndex(item => item.id === product.id);
    
    // трюк с побитовым НЕ, использую давно в своей работе
    if (~index) {
      this.items.splice(index, 1);

      this.eventBroker.emit('cart:changed', { items: this.items });
      this.eventBroker.emit('cart:item-removed', { product, items: this.items });
    }
  }

  clear(): void {
    this.items = [];

    this.eventBroker.emit('cart:changed', { items: this.items });
    this.eventBroker.emit('cart:cleared', { items: this.items });
  }

  getTotalPrice(): number {
    return this.items.reduce((acc, item) => {
      return acc + (item.price || 0);
    }, 0);
  }

  getTotalCount(): number {
    return this.items.length;
  }

  isInCart(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}