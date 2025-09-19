import { IProduct } from '../../types/index';
import { EventEmitter } from '../base/Events';

export class Catalog {
  private items: IProduct[] = [];
  private currentItem: IProduct | null = null;
  public eventBroker: EventEmitter;

  constructor(eventBroker: EventEmitter) {
    this.eventBroker = eventBroker;
  }

  saveProducts(products: IProduct[]): void {
    this.items = products;

    this.eventBroker.emit('catalog:changed', { items: this.items });
  }

  getProducts(): IProduct[] {
    return this.items;
  }

  getProductById(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }

  setCurrentProduct(product: IProduct): void {
    this.currentItem = product;

    this.eventBroker.emit('catalog:product-selected', this.currentItem);
  }

  getCurrentProduct(): IProduct | null {
    return this.currentItem;
  }
}