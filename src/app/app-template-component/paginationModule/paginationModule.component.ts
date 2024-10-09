import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginationModule',
  templateUrl: './paginationModule.component.html',
  styleUrls: ['./paginationModule.component.scss']
})
export class PaginationModuleComponent {

  @Input() currentPage!: number;
  @Input() totalPages!:  number[];
  @Input() listSize!: number;
  @Output() outputPageNumber: EventEmitter<any> = new EventEmitter();

  constructor() { }

  onChangePage(event: any) {
    if (event.target && event.target.value) {
      this.currentPage = event.target.value;
      this.outputPageNumber.emit(this.currentPage);      
    }
  }

}
