import { Injectable } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(public http: HttpClient) { }

  getHttpHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('id_token')}`,
      'x-simpl-locationid': `${localStorage.getItem('locationId')}`,
    });
  }

  private isDefined<T>(value: T | undefined): value is NonNullable<T> {
    return value !== undefined && value !== null;
  }

  private makeApiCall<T>(endpoint: string, method: string, data?: any): Observable<T> {
    const url = `${endpoint}`;
    if(url.includes("consumer-service") || url.includes("provider-service")){
      return this.http.request<T>(method, url, { body: data, headers: this.getHttpHeaders() }).pipe(
        filter(this.isDefined)
      );
    }else{
      return this.http.request<T>(method, url, { body: data }).pipe(
        filter(this.isDefined)
      );
    } 
  }

  get<T>(endpoint: string): Observable<any> {
    return this.makeApiCall<any>(endpoint, 'GET', undefined).pipe(
      map(response => response?.body as T)
    );
  }

  getDataList<T>(endpoint: string, headers?: HttpHeaders): Observable<any[]> {
    return this.makeApiCall<any>(endpoint, 'GET', undefined).pipe(
      map(response => response?.body as T[])
    );
  }

  post<T>(endpoint: string, data: any): Observable<any> {
    return this.makeApiCall<any>(endpoint, 'POST', data).pipe(
      map(response => response?.body as T)
    );
  }

  put(url: string, body: any) {
    if (url.includes("consumer-service") || url.includes("provider-service")) {
      return this.http.put(url, body, { headers: this.getHttpHeaders() });
    } else {
      return this.http.put(url, body);
    }
  }

  delete<T>(endpoint: string): Observable<any> {
    return this.makeApiCall<any>(endpoint, 'DELETE', undefined).pipe(
      map(response => response?.body as T)
    );
  }

  patch<T>(endpoint: string, data: any): Observable<any> {
    return this.makeApiCall<any>(endpoint, 'PATCH', data).pipe(
      map(response => response?.body as T)
    );
  }

  patchWithoutData<T>(endpoint: string): Observable<any> {
    return this.makeApiCall<any>(endpoint, 'PATCH').pipe(
      map(response => response?.body as T)
    );
  }
  
  postBlob(endpoint: string, data: any): Observable<Blob> {
    const url = `${endpoint}`;
    const headers = this.getHttpHeaders();

    return this.http.post(url, data, {
      headers: headers,
      responseType: 'blob' // Specify response as Blob
    });
  }
}
