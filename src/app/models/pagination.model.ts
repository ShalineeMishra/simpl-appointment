export class PaginationModel {
    globalOperator!: string;
    pageRequest!: PageRequest;
    searchRequestDto!: SearchRequestDto[];
  }
  
  export class PageResponse {
    total_pages!: number;
    total_elements!: number;
    size!: number;
    number_of_elements!: number;
  }
  
  export class PageableObject {
    constructor(
      public page_number: number = 0,
      public page_size?: string,
      public paged?: string
    ) {}
  }
  
  export class PageRequest {
    pageNo!: number;
    pageSize!: number;
    sort!: string;
    sortByColumn!: string;
  }
  
  export class SearchRequestDto {
    column!: string;
    value!: string;
    joinTable!: string;
    operation!: string;
  }
  