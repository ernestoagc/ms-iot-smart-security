import { Injectable, InternalServerErrorException, Scope } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { randomUUID } from 'crypto';
import {
    AxiosRequestConfig,
    RawAxiosRequestHeaders,
    AxiosResponse,
    Method,
  } from 'axios';

@Injectable({ scope: Scope.TRANSIENT })
export class HttpHelperService<T>  {
    constructor(
        private readonly httpService: HttpService,
      ) {}


      public getHeaders(
        requestId?: string,
      ): RawAxiosRequestHeaders {
    
        return {
          'Content-Type': 'application/json',
        };
      }


      private buildConfiguration(
        url: string,
        method: Method,
        headers?: RawAxiosRequestHeaders,
        timeout?: number,
      ): AxiosRequestConfig {
        return {
          url,
          method,
          headers,
          timeout,
        };
      }


      public async post(
        url: string,
        data: T,
        headers?: RawAxiosRequestHeaders,
        params?: any,
        timeout?: number,
      ): Promise<AxiosResponse<any>> {
        const configuration = this.buildConfiguration(
          url,
          'post',
          headers==null?this.getHeaders():headers,
          timeout,
        );
    
        configuration.data = data;
    
        return this.request(configuration);
      }

      public async get(
        url: string,
        headers?: RawAxiosRequestHeaders,
        params?: any,
        timeout?: number,
      ): Promise<AxiosResponse<any>> {
        const configuration = this.buildConfiguration(
          url,
          'get',
          headers==null?this.getHeaders():headers,
          timeout,
        );
    
        return this.request(configuration);
      }


      private async request(
        configuration: AxiosRequestConfig<T>
      ): Promise<AxiosResponse<any>> {
        let response: AxiosResponse;
        try {
          response = await firstValueFrom(this.httpService.request(configuration));
          console.log(response.data);
        } catch (error) {
            new InternalServerErrorException(error);
        }
        return response;
      }
}


