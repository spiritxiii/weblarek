export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export type TPayment = 'card' | 'cash' | '';

export interface IProducts {
  total: number;
  items: IProduct[];
}

export interface IOrderRequest extends IBuyer {
  items: string[];
  total: number;
}

export interface IOrderResponse {
  id: string;
  total: number;
}

export interface IValidErrors {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface IValidResult {
  isValid: boolean;
  errors: IValidErrors;
  data: Partial<IBuyer>;
}

export type TProductCategory = 'софт-скил' | 'хард-скил' | 'кнопка' | 'дополнительное' | 'другое';

export interface IBasketProduct extends IProduct {
  index: number;
}

export interface IBasketCount {
  count: number;
}

export interface ITimer {
  delay: number;
  timeoutId: ReturnType<typeof setTimeout> | null;
}