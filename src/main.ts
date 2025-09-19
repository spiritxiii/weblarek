import './scss/styles.scss';

import { IBuyer, IProduct, IOrderRequest, IValidResult } from './types/index';
import { EventEmitter } from './components/base/Events';
import { Catalog } from './components/Models/Catalog';
import { Cart } from './components/Models/Cart';
import { Customer } from './components/Models/Customer';
import { ApiClient } from './components/Communication/ApiClient';
import { API_URL } from './utils/constants';
import { CardCatalog } from './components/Views/cards/CardCatalog';
import { CardPreview } from './components/Views/cards/CardPreview';
import { BasketView } from './components/Views/BasketView';
import { ModalView } from './components/Views/ModalView';
import { OrderForm } from './components/Views/forms/OrderForm';
import { ContactsForm } from './components/Views/forms/ContactsForm';
import { SuccessView } from './components/Views/SuccessView';

import { apiProducts } from './utils/data';

// Инициализация компонентов
const eventEmitter = new EventEmitter();
const apiClient = new ApiClient(API_URL);
const catalogModel = new Catalog(eventEmitter);
const cartModel = new Cart(eventEmitter);
const customerModel = new Customer(eventEmitter);
const modal = new ModalView();

// Обработка изменения каталога
catalogModel.eventBroker.on('catalog:changed', () => {
  const products = catalogModel.getProducts();
  const gallery = document.querySelector('.gallery');

  if (!(gallery instanceof HTMLElement)) {
    throw new Error('Контейнер для списка товаров не найден');
  }
  gallery.innerHTML = '';

  products.forEach((product) => {
    const template = document.getElementById('card-catalog') as HTMLTemplateElement;
    const cardElementClone = template.content.cloneNode(true) as HTMLElement;
    const cardElement = cardElementClone.querySelector('.card');

    if (!(cardElement instanceof HTMLElement)) {
      throw new Error('Шаблон для товара не найден');
    }
    const card = new CardCatalog(cardElement);
    
    card.setButtonHandler(() => {
      catalogModel.setCurrentProduct(product);
    });
    
    gallery.appendChild(card.render(product));
  });
});

// Обработка выбора товара для просмотра
catalogModel.eventBroker.on('catalog:product-selected', (data: IProduct) => {
  const template = document.getElementById('card-preview') as HTMLTemplateElement;
  const previewElementClone = template.content.cloneNode(true) as HTMLElement;
  const previewElement = previewElementClone.querySelector('.card');

  if (!(previewElement instanceof HTMLElement)) {
    throw new Error('Шаблон для товара не найден');
  }
  const preview = new CardPreview(previewElement);

  if (cartModel.isInCart(data.id)) {
    preview.setButtonText("Удалить из корзины");
  } else {
    preview.setButtonText("В корзину");
  }

  preview.setButtonHandler(() => {
    if (cartModel.isInCart(data.id)) {
      cartModel.removeItem(data);
      preview.setButtonText("В корзину");
    } else {
      cartModel.addItem(data);
      preview.setButtonText("Удалить из корзины");
    }
  });

  preview.setButtonDisabled(data.price === null, 'Недоступно');
  modal.open(preview.render(data));
});

// Задаем обработчик на закрытие модального окна
modal.setCloseHandler(() => {
  modal.close();
});

// Обработка количества товаров в корзине в шапке сайта
cartModel.eventBroker.on('cart:changed', () => {
  const basketCounter = document.querySelector('.header__basket-counter');

  if (!(basketCounter instanceof HTMLElement)) {
    throw new Error('DOM-элемент для количества товаров в шапке сайта не найден');
  }
  basketCounter.textContent = cartModel.getTotalCount().toString();
  
  // Если открыта корзина, то обновляем её
  const currentModalContent = document.querySelector('.modal__content');
  if (currentModalContent && currentModalContent.querySelector('.basket')) {
    showBasket();
  }
});

// Обработчик открытия корзины
const basketButton = document.querySelector('.header__basket');
if (basketButton) {
  basketButton.addEventListener('click', () => {
    showBasket();
  });
}

initializeApp();

// Загрузка товаров при старте приложения
async function initializeApp(): Promise<void> {
  try {
    console.log('Загрузка товаров с сервера...');
    const products = await apiClient.getProductList();
    console.log('Товары получены:', products);
    catalogModel.saveProducts(products.items);
  } catch (error) {
    console.error('Ошибка загрузки товаров, используем локальные данные:', error);
    catalogModel.saveProducts(apiProducts.items);
  }
}

// Функция отображения корзины
function showBasket(): void {
  const basketTemplate = document.getElementById('basket');
  if (!(basketTemplate instanceof HTMLTemplateElement)) {
    throw new Error('Шаблон корзины не найден');
  }

  const basketElementClone = basketTemplate.content.cloneNode(true) as HTMLElement;
  const basketElement = basketElementClone.querySelector('.basket');

  if (!(basketElement instanceof HTMLElement)) {
    throw new Error('Элемент корзины не найден');
  }
  const basketView = new BasketView(basketElement, eventEmitter);

  basketView.setTotalPrice(cartModel.getTotalPrice());
  basketView.setItems(cartModel.getItems());

  basketView.setOrderHandler(() => {
    showForm('order', ['payment', 'address']);
  });

  basketView.setDeleteHandler((productId: string) => {
    const product = catalogModel.getProductById(productId);
    if (product) {
      cartModel.removeItem(product);
    }
  });

  basketView.setButtonDisabled(cartModel.getTotalCount() === 0);
  modal.open(basketElement);
}

// Функция показа формы
function showForm(templateName: string, customerParams?: (keyof IBuyer)[]): void {
  const element = getTemplate(templateName, '.form');
  const form = getInstance(templateName, element);

  const customerData = customerModel.getData(customerParams);
  restoreFormData(form, customerData);

  // Обработка события валидации в корзине
  customerModel.eventBroker.on('customer:validated', (validResult: IValidResult) => {
    form.setButtonState(!validResult.isValid);

    if (Object.keys(validResult.errors).length) {
      form.setValidations(validResult.errors);
    } else {
      form.setValidations();
    }
  });

  form.setInputHandler((field, value) => {
    customerModel.saveData({ [field]: value });
    customerModel.validate(customerModel.getData(customerParams));
  });

  form.setSubmitHandler((event: SubmitEvent) => {
    event.preventDefault();

    switch(templateName) {
      case 'contacts':
        sendOrder(customerModel, cartModel);
        break;
      default: // 'order'
        showForm('contacts', ['email', 'phone']);
        break;
    }
  });

  // Если клиент уже вводил данные, проверяем
  if (customerParams) {
    let isFilled: boolean = false;
    isFilled = customerParams.some(param => customerData.hasOwnProperty(param) && customerData[param]);
    if (isFilled) {
      customerModel.validate(customerData);
    }
  }

  modal.open(element);
}

// Функция установки введенных ранее пользователем значений в форму
function restoreFormData(form: OrderForm | ContactsForm, customer: Partial<IBuyer>): void {
  if (form instanceof OrderForm) { // Определяем родительский класс
    // используем логическое И для красоты
    customer.payment && form.setPaymentMethod(customer.payment);
    customer.address && form.setAddress(customer.address);
  }

  if (form instanceof ContactsForm) {
    customer.email && form.setEmail(customer.email);
    customer.phone && form.setPhone(customer.phone);
  }
}

// Функция для получения шаблона формы
function getTemplate(templateName: string, classname: string): HTMLElement {
  const template = document.getElementById(templateName);
  if (!(template instanceof HTMLTemplateElement)) {
    throw new Error(`Шаблон формы ${templateName} не найден`);
  }

  const elementClone = template.content.cloneNode(true) as HTMLElement;
  const element = elementClone.querySelector(classname);
  if (!(element instanceof HTMLElement)) {
    throw new Error(`Элемент формы ${templateName} не найден`);
  }

  return element;
}

// получаем инстанс класса слоя View
function getInstance(templateName: string, orderElement: HTMLElement): OrderForm | ContactsForm {
  switch(templateName) {
    case 'order':
      return new OrderForm(orderElement);
    default: // 'contacts'
      return new ContactsForm(orderElement);
  }
}

// Функция отправки заказа на сервер
async function sendOrder(customerModel: Customer, cartModel: Cart): Promise<void> {
  try {
    const orderData: IOrderRequest = {
      ...customerModel.getData() as IBuyer,
      items: cartModel.getItems().map(item => item.id),
      total: cartModel.getTotalPrice()
    };

    const result = await apiClient.createOrder(orderData);
    showSuccess(result.total);
    
    // Очистка после успешного заказа
    cartModel.clear();
    customerModel.clearData();
    
  } catch (error) {
    console.error('Ошибка оформления заказа:', error);
  }
}

// Функция показа успешного оформления
function showSuccess(total: number): void {
  const successElement = getTemplate('success', '.order-success');
  const successView = new SuccessView(successElement);
  successView.setTotalPrice(total);
  
  successView.setCloseHandler(() => {
    modal.close();
  });

  modal.open(successElement);
}