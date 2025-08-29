import { Api } from '../base/Api';
import { IApi, IProducts, IOrderRequest, IOrderResponse } from '../../types/index';

export class ApiClient {
  private api: IApi;

  constructor (baseUrl: string, options: RequestInit = {}) {
    this.api = new Api(baseUrl, options);
  }

  async getProductList(): Promise<IProducts> {
    try {
      const response = await this.api.get('/product/');
      return response as IProducts;
    } catch (error) {
      console.error('Ошибка при получении списка товаров:', error);
      throw error;
    }
  }

  async createOrder(orderData: IOrderRequest): Promise<IOrderResponse> {
    try {
      const response = await this.api.post('/order/', orderData);
      return response as IOrderResponse;
    } catch(error) {
      console.log('ОШибка при получении статуса оформления заказа покупателем: ', error);
      throw error;
    }
  }
}