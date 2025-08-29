import { IProduct } from '../../types/index';

export class Catalog {
  private items: IProduct[] = [];
  private currentItem: IProduct | null = null;

  saveProducts(products: IProduct[]): void {
    this.items = products;
  }

  getProducts(): IProduct[] {
    return this.items;
  }

  getProductById(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }

  setCurrentProduct(product: IProduct): void {
    this.currentItem = product;
  }

  getCurrentProduct(): IProduct | null {
    return this.currentItem;
  }
}