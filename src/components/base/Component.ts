/**
 * Базовый компонент
 */
export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {
        // Учитывайте что код в конструкторе исполняется ДО всех объявлений в дочернем классе
    }

    // Инструментарий для работы с DOM в дочерних компонентах

    // Вернуть корневой DOM-элемент
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }

    // Изменить текст в Dom-элементе
    protected setText(element: HTMLElement, text?: string): void {
      if (element && text) {
        element.textContent = text;
      } else {
        element.textContent = '';
      }
    }

    // Активировать/деактивировать кнопку
    protected setDisabled(element: HTMLButtonElement, disabled: boolean, newText: string | null = null): void {
      if (element) {
        if (disabled) {
          element.setAttribute('disabled', 'true');

          if (newText) {
            this.setText(element, newText);
          }
        } else {
          element.removeAttribute('disabled');
        }
      }
    }

    // Установить изображение с альтернативным текстом
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }
}
