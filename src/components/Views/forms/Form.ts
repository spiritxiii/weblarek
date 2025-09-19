import { Component } from '../../base/Component';
import { IBuyer } from '../../../types';

export abstract class Form<T> extends Component<T> {
  protected form: HTMLFormElement;
  protected errorElement: HTMLElement;
  protected submitButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    if (!(this.container instanceof HTMLFormElement)) {
        throw new Error('Контейнер не найден');
    }
    this.form = this.container;

    const errorElement = this.container.querySelector('.form__errors');
    if (!(errorElement instanceof HTMLElement)) {
      throw new Error('DOM-элемент для ошибок не найден');
    }
    this.errorElement = errorElement;
    
    const submitButton = this.container.querySelector('button[type="submit"]');
    if (!(submitButton instanceof HTMLButtonElement)) {
      throw new Error('Кнопка отправки не найдена');
    }
    this.submitButton = submitButton;
  }

  setSubmitHandler(handler: (event: SubmitEvent) => void): void {
    this.form.addEventListener('submit', handler);
  }

  setValidations(errors?: Partial<Record<keyof T, string>>): void {
    if (errors) {
      const errorMessages = Object.values(errors).filter(Boolean);
      this.setText(this.errorElement, errorMessages.join(', '));
    } else {
      this.setText(this.errorElement);
    }
  }

  setButtonState(disabled: boolean): void {
    this.setDisabled(this.submitButton, disabled);
  }

  abstract getData(): T;

  abstract setInputHandler(handler: (field: keyof Partial<IBuyer>, value: string) => void): void;
}