import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpRestApiService {

  constructor(public http: HttpClient) { }

  post(url: string, body: any) {
    if (url.includes("consumer-service") || url.includes("provider-service") ) {
       if (body instanceof FormData) {
         return this.http.post(url, body, { headers: this.getHttpHeadersForFormData() });
       } else {
         return this.http.post(url, body, { headers: this.getHttpHeaders() });
       }
    } else {
      if (body instanceof FormData) {
        return this.http.post(url, body);
      } else {
        return this.http.post(url, body);
      }
    }
  }

  get(url: string) {
    if (url.includes("consumer-service") || url.includes("provider-service")) {
      const headers = this.getHttpHeaders();
      return this.http.get(url, { headers });
    } else {
      return this.http.get(url,{responseType: 'json'});
    }
  }

  put(url: string, body: any) {
    if (url.includes("consumer-service") || url.includes("provider-service")) {
      return this.http.put(url, body, { headers: this.getHttpHeaders() });
    } else {
      return this.http.put(url, body);
    }
  }

  patch(url: string, body: any) {
    if (url.includes("consumer-service") || url.includes("provider-service")) {
      return this.http.patch(url, body, { headers: this.getHttpHeaders() });
    } else {
      return this.http.patch(url, body);
    }
  }

  delete(url: string) {
    if (url.includes("consumer-service") || url.includes("provider-service")) {
      return this.http.delete(url, { headers: this.getHttpHeaders() });
    } else {
      return this.http.delete(url);
    }
  }

  deleteWithBody(url: string, body?: any) {
    const headers = this.getHttpHeaders();
    if (url.includes("consumer-service") || url.includes("provider-service")) {
      return this.http.request('delete', url, { headers: headers, body: body });
    } else {
      return this.http.delete(url, { headers: headers, body: body });
    }
  }

  getHttpHeaders(): HttpHeaders {
    let token =  localStorage?.getItem('id_token');
    let locationId =  localStorage?.getItem('location_id') || 0;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+token,
      'x-simpl-locationid': locationId,
    });
  }

  getHttpHeadersForFormData(): HttpHeaders {
    let token =  localStorage?.getItem('id_token');
    let locationId =  localStorage?.getItem('location_id') || 0;
    return new HttpHeaders({
      'Authorization': 'Bearer '+token,
      'x-simpl-locationid': locationId,
    });
  }
}