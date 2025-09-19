import './scss/styles.scss';

import { IBuyer, IProduct, IOrderRequest, IValidResult, ITimer } from './types/index';
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
import { HeaderCartView } from './components/Views/HeaderCartView';
import { debounce } from './utils/utils';

import { apiProducts } from './utils/data';

// Инициализация компонентов
const eventEmitter = new EventEmitter();
const apiClient = new ApiClient(API_URL);
const catalogModel = new Catalog(eventEmitter);
const cartModel = new Cart(eventEmitter);
const customerModel = new Customer(eventEmitter);
const modal = new ModalView(eventEmitter);

// Таймер для debounce
const timer: ITimer = {
  delay: 800,
  timeoutId: null
};

// START Инициализируем слой представления кнопки корзины в шапке сайта
const headerCart = document.querySelector('.header__basket');
if (!(headerCart instanceof HTMLButtonElement)) {
  throw new Error('Кнопка корзины в шапке сайта не найдена');
}
const header = new HeaderCartView(headerCart);

// Обработчик открытия корзины
header.setBasketClickHandler(() => {
  updateBasket();
});
// END Инициализируем слой представления кнопки корзины в шапке сайта

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
  header.count = cartModel.getTotalCount();
});

// START Инициализируем слой представления корзины
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

basketView.setOrderHandler(() => {
  showForm('order', ['payment', 'address']);
  basketView.isOpen = false;
});

// Обработка удаления товара из корзины
cartModel.eventBroker.on('basket:item-remove', (data: {productId: string}) => {
  const product = catalogModel.getProductById(data.productId);
  if (product) {
    cartModel.removeItem(product);
  }
});

// Обработка закрытия модального окна
cartModel.eventBroker.on('modal:close', () => {
  basketView.isOpen = false;
});

// обработка изменения состава корзины
cartModel.eventBroker.on('cart:changed', () => {
  if (basketView.isOpen) {
    updateBasket();
  }
});
// END Инициализируем слой представления корзины

initializeApp();

/**
 * Инициализирует приложение, загружая товары с сервера или используя локальные данные
 * @async
 * @returns {Promise<void>}
 */
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

/**
 * Обновляет корзину товаров в модальном окне
 * @returns {void}
 */
function updateBasket(): void {
  basketView.setTotalPrice(cartModel.getTotalPrice());
  basketView.setItems(cartModel.getItems());
  basketView.setButtonDisabled(cartModel.getTotalCount() === 0);
  basketView.isOpen = true;

  modal.open(basketElement as HTMLElement);
}

/**
 * Отображает форму (оформления заказа или контактов) в модальном окне
 * @param {string} templateName - имя шаблона формы ('order' или 'contacts')
 * @param {(keyof IBuyer)[]} [customerParams] - параметры покупателя для валидации
 * @returns {void}
 */
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

    const debounceValidate = debounce(() => {
      customerModel.validate(customerModel.getData(customerParams))
    }, timer);
    
    debounceValidate();
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
      const debounceValidate = debounce(() => {
        customerModel.validate(customerData)
      }, timer);

      debounceValidate();
    }
  }

  modal.open(element);
}

/**
 * Восстанавливает ранее введенные пользователем данные в форму
 * @param {OrderForm | ContactsForm} form - экземпляр формы
 * @param {Partial<IBuyer>} customer - данные покупателя
 * @returns {void}
 */
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

/**
 * Получает DOM-элемент формы из шаблона
 * @param {string} templateName - имя шаблона
 * @param {string} classname - CSS-класс элемента формы
 * @returns {HTMLElement} DOM-элемент формы
 * @throws {Error} Если шаблон или элемент не найдены
 */
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

/**
 * Создает экземпляр класса формы на основе имени шаблона
 * @param {string} templateName - имя шаблона ('order' или 'contacts')
 * @param {HTMLElement} orderElement - DOM-элемент формы
 * @returns {OrderForm | ContactsForm} экземпляр класса формы
 */
function getInstance(templateName: string, orderElement: HTMLElement): OrderForm | ContactsForm {
  switch(templateName) {
    case 'order':
      return new OrderForm(orderElement);
    default: // 'contacts'
      return new ContactsForm(orderElement);
  }
}

/**
 * Отправляет заказ на сервер и обрабатывает результат
 * @async
 * @param {Customer} customerModel - модель покупателя с данными для заказа
 * @param {Cart} cartModel - модель корзины с товарами
 * @returns {Promise<void>}
 */
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

/**
 * Отображает экран успешного оформления заказа
 * @param {number} total - общая сумма заказа
 * @returns {void}
 */
function showSuccess(total: number): void {
  const successElement = getTemplate('success', '.order-success');
  const successView = new SuccessView(successElement);
  successView.setTotalPrice(total);
  
  successView.setCloseHandler(() => {
    modal.close();
  });

  modal.open(successElement);
}