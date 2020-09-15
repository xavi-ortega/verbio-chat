import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpCommonService {
  private headers: HttpHeaders;

  constructor() {}

  setHeaders(headers: HttpHeaders) {
    this.headers = headers;
  }

  getHeaders(): HttpHeaders {
    return this.headers;
  }
}
