/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private messageSource = new Subject<string>();
  private transferObj = new Subject<any>();

  private dataSource = new BehaviorSubject<any>('nodata');
  currentData = this.dataSource.asObservable();

  message$ = this.messageSource.asObservable();
  transfer$ = this.transferObj.asObservable();

  sendMessage(message: string) {
    this.messageSource.next(message);
  }

  transferObject(objectData : any){
    this.transferObj.next(objectData);
  }


  changeData(data: any) {
    if (data === null || data === undefined) {
      this.dataSource.next('nodata'); // or any other initial value
    } else {
      this.dataSource.next(data);
    }
  }
}
