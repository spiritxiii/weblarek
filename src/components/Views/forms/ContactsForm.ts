import { Form } from './Form';
import { IBuyer } from '../../../types';

export class ContactsForm extends Form<Partial<IBuyer>> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(container: HTMLElement) {
    super(container);

    const emailInput = this.container.querySelector('[name="email"]');
    if (!(emailInput instanceof HTMLInputElement)) {
      throw new Error('Поле для email не найдено');
    }
    this.emailInput = emailInput;

    const phoneInput = this.container.querySelector('[name="phone"]');
    if (!(phoneInput instanceof HTMLInputElement)) {
      throw new Error('Поле для телефона не найдено');
    }
    this.phoneInput = phoneInput;
  }

  setEmail(email: string): void {
    this.emailInput.value = email;
  }

  setPhone(phone: string): void {
    this.phoneInput.value = phone;
  }

  setInputHandler(handler: (field: keyof Partial<IBuyer>, value: string) => void): void {
    this.emailInput.addEventListener('input', () => handler('email', this.emailInput.value));
    this.phoneInput.addEventListener('input', () => handler('phone', this.phoneInput.value));
  }

  getData(): Partial<IBuyer> {
    const formData = new FormData(this.form);
    return {
      email: formData.get('email') as string,
      phone: formData.get('phone') as string
    };
  }
}