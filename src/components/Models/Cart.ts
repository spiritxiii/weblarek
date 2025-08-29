import { IProduct } from '../../types/index';

export class Cart {
  private items: IProduct[] = [];

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    this.items.push(product);
  }

  removeItem(product: IProduct): void {
    const index = this.items.findIndex(item => item.id === product.id);
    
    // трюк с побитовым НЕ, использую давно в своей работе
    if (~index) {
      this.items.splice(index, 1);
    }
  }

  clear(): void {
    this.items = [];
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