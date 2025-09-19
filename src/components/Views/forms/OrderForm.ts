import { Form } from './Form';
import { IBuyer, TPayment } from '../../../types';

export class OrderForm extends Form<Partial<IBuyer>> {
  private cardButton: HTMLButtonElement;
  private cashButton: HTMLButtonElement;
  private addressInput: HTMLInputElement;

  constructor(container: HTMLElement) {
    super(container);

    const cardButton = this.container.querySelector('[name="card"]');
    if (!(cardButton instanceof HTMLButtonElement)) {
      throw new Error('Кнопка онлайн оплаты не найдена');
    }
    cardButton.addEventListener('click', () => this.setPaymentMethod('card'));
    this.cardButton = cardButton;

    const cashButton = this.container.querySelector('[name="cash"]');
    if (!(cashButton instanceof HTMLButtonElement)) {
      throw new Error('Кнопка оплаты наличными не найдена');
    }
    cashButton.addEventListener('click', () => this.setPaymentMethod('cash'));
    this.cashButton = cashButton;

    const addressInput = this.container.querySelector('[name="address"]');
    if (!(addressInput instanceof HTMLInputElement)) {
      throw new Error('Поле для адреса не найдено');
    }
    this.addressInput = addressInput;
  }

  setPaymentMethod(method: TPayment): void {
    // Сбрасываем активное состояние
    this.cardButton.classList.remove('button_alt-active');
    this.cashButton.classList.remove('button_alt-active');

    // Устанавливаем активное состояние
    if (method === 'card') {
      this.cardButton.classList.add('button_alt-active');
    } else if (method === 'cash') {
      this.cashButton.classList.add('button_alt-active');
    }
  }

  setAddress(address: string): void {
    this.addressInput.value = address;
  }

  setInputHandler(handler: (field: keyof Partial<IBuyer>, value: string) => void): void {
    this.cardButton.addEventListener('click', () => handler('payment', 'card'));
    this.cashButton.addEventListener('click', () => handler('payment', 'cash'));
    this.addressInput.addEventListener('input', () => handler('address', this.addressInput.value));
  }

  getData(): Partial<IBuyer> {
    const formData = new FormData(this.form);
    return {
      payment: formData.get('payment') as TPayment,
      address: formData.get('address') as string
    };
  }
}