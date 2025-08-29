import { TPayment, IBuyer, IValidErrors, IValidResult } from '../../types/index';

export class Customer {
  private payment: TPayment = '';
  private email: string = '';
  private phone: string = '';
  private address: string = '';

  saveData(data: Partial<IBuyer>): void {
    if (data.payment)
      this.payment = data.payment;

    if (data.email)
      this.email = data.email;

    if (data.phone)
      this.phone = data.phone;
    
    if (data.address) {
      this.address = data.address;
    }
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    }
  }

  clearData(): void {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  validate(data: Partial<IBuyer>): IValidResult {
    let isValid = true;
    const errors: IValidErrors = {};

    if (data.payment !== undefined) {
      if (data.payment !== 'card' && data.payment !== 'cash') {
        errors.payment = 'Неверный способ оплаты';
        isValid = false;
      }
    }

    if (data.email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.email = 'Неверный формат email';
        isValid = false;
      }
    }

    if (data.phone !== undefined) {
      if (data.phone.replace(/\D/g, '').length < 10) {
        errors.phone = 'Телефон должен содержать не менее 10 цифр';
        isValid = false;
      }
    }

    if (data.address !== undefined) {
      if (data.address.trim().length <= 5) {
        errors.address = 'Адрес должен содержать более 5 символов';
        isValid = false;
      }
    }

    return { isValid, errors };
  }
}