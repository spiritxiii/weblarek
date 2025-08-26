import './scss/styles.scss';

import { IProduct } from './types/index.ts';
import { Catalog } from './components/Models/Catalog.ts';
import { Cart } from './components/Models/Cart.ts';
import { Customer } from './components/Models/Customer.ts';

import { apiProducts } from './utils/data.ts';

// Тестируем Catalog
console.log('=============Тестируем Catalog=============');
const catalogModel = new Catalog();
catalogModel.saveProducts(apiProducts.items);

console.log('Массив товаров из каталога: ', catalogModel.getProducts());
console.log('Получаем товар с id 854cef69-976d-4c2a-a18c-2aa45046c390', catalogModel.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390'));

catalogModel.setCurrentProduct({
  category: "софт-скил2",
  description: "2222 Если планируете решать задачи в тренажёре, берите два.",
  id: "222854cef69-976d-4c2a-a18c-2aa45046c390",
  image: "2222/5_Dots.svg",
  price: 222,
  title: "222 +1 час в сутках"
});
console.log('Получаем выбранный товар', catalogModel.getCurrentProduct());
// END Тестируем Catalog

// Тестируем Cart
console.log('=============Тестируем Cart=============');
const cartModel = new Cart();
cartModel.addItem(catalogModel.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390'));
cartModel.addItem(catalogModel.getProductById('412bcf81-7e75-4e70-bdb9-d3c73c9803b7'));

console.log('Получаем товары в корзине', cartModel.getItems());
console.log('Получаем общую стоимость товаров в корзине', cartModel.getTotalPrice());
console.log('Получаем общее количество товаров в корзине', cartModel.getTotalCount());
console.log('Есть ли товар 854cef69-976d-4c2a-a18c-2aa45046c390 в корзине', cartModel.isInCart('854cef69-976d-4c2a-a18c-2aa45046c390'));
console.log('Есть ли товар c101ab44-ed99-4a54-990d-47aa2bb4e7d9 в корзине', cartModel.isInCart('c101ab44-ed99-4a54-990d-47aa2bb4e7d9'));

cartModel.removeItem(catalogModel.getProductById('412bcf81-7e75-4e70-bdb9-d3c73c9803b7'));
console.log('Получаем товары в корзине после удаления 1-го товара', cartModel.getItems());

cartModel.clear();
console.log('Получаем пустая ли корзина после очистки', cartModel.getItems());
// END Тестируем Cart

// Тестируем Customer
console.log('=============Тестируем Customer=============');
const customerModel = new Customer();

const firstData: Partial<IBuyer> = {
  payment: 'card',
  email: 'test@mail'
};
console.log('Проверяем первый набор данных, должно быть false: ', customerModel.validate(firstData));

const secondData: Partial<IBuyer> = {
  payment: 'coste',
  email: 'test@mail.ru'
};
console.log('Проверяем второй набор данных, должно быть false: ', customerModel.validate(secondData));

const thirdData: Partial<IBuyer> = {
  payment: 'card',
  email: 'test@mail.ru'
};
console.log('Проверяем третий набор данных, должно быть true: ', customerModel.validate(thirdData));

customerModel.saveData(thirdData);
console.log('Добавили почту и способ оплаты в класс, проверяем: ', customerModel.getData());

const fourthData: Partial<IBuyer> = {
  phone: '+7 (928) 928-98-28',
  address: 'Рост'
};
console.log('Проверяем четвертый набор данных, должно быть false: ', customerModel.validate(fourthData));

const fifthData: Partial<IBuyer> = {
  phone: '+7 (928) 928-98',
  address: 'Ростов-на-Дону'
};
console.log('Проверяем пятый набор данных, должно быть false: ', customerModel.validate(fifthData));

const sixthData: Partial<IBuyer> = {
  phone: '+7 (928) 928-98-28',
  address: 'Ростов-на-Дону'
};
console.log('Проверяем шестой набор данных, должно быть true: ', customerModel.validate(sixthData));

customerModel.saveData(sixthData);
console.log('Добавили телефон и адрес в класс, проверяем: ', customerModel.getData());

// END Тестируем Customer