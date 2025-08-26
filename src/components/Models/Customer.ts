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

  validate(data: Partial<IBuyer>): boolean {
    let isValid = true;

    if (data.payment)
      isValid = isValid && (data.payment === 'card' || data.payment === 'cash');

    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = isValid && emailRegex.test(data.email);
    }

    if (data.phone)
      isValid = isValid && (data.phone.replace(/\D/g, '').length >= 10);

    if (data.address)
      isValid = isValid && data.address.trim().length > 5;

    return isValid;
  }
}