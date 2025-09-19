import { Card } from './Card';
import { CDN_URL } from '../../../utils/constants';
import { IProduct } from '../../../types';
import { TProductCategory } from '../../../types/index';
import { categoryMap } from '../../../utils/constants';

export class CardFullInfo extends Card<IProduct> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement) {
    super(container);

    const categoryElement = this.container.querySelector('.card__category');
    if (!(categoryElement instanceof HTMLElement)) {
      throw new Error('DOM-элемент для категории товара не найден');
    }
    this.categoryElement = categoryElement;

    const imageElement = this.container.querySelector('.card__image');
    if (!(imageElement instanceof HTMLImageElement)) {
      throw new Error('DOM-элемент для изображения товара не найден');
    }
    this.imageElement = imageElement;
  }

  protected set category(categoryName: TProductCategory) {
    this.setText(this.categoryElement, categoryName);
  
    // Удаляем все классы категорий
    Object.values(categoryMap).forEach(className => {
      this.categoryElement.classList.remove(className);
    });
    
    // Добавляем соответствующий класс
    if (categoryName && categoryMap[categoryName]) {
      this.categoryElement.classList.add(categoryMap[categoryName]);
    }
  }

  protected set image(src: string) {
    this.setImage(this.imageElement, CDN_URL + src, this.title);
  }
}