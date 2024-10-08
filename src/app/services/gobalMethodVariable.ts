import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { MaskitoOptions } from '@maskito/core';

@Injectable({
  providedIn: 'root',
})
export class GlobleMethods {
  constructor(private toastController: ToastController) {}

  //Max size limit is = 5MB
  public imageMaxSizeLimit: number = 5242880;

  readonly ndcMask: MaskitoOptions = {
    mask: [
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
    ],
  };

  private validTLDs = [
    'com',
    'org',
    'net',
    'int',
    'edu',
    'gov',
    'mil',
    'arpa',
    'ac',
    'ad',
    'ae',
    'af',
    'ag',
    'ai',
    'al',
    'am',
    'an',
    'ao',
    'aq',
    'ar',
    'as',
    'at',
    'au',
    'aw',
    'ax',
    'az',
    'ba',
    'bb',
    'bd',
    'be',
    'bf',
    'bg',
    'bh',
    'bi',
    'bj',
    'bm',
    'bn',
    'bo',
    'br',
    'bs',
    'bt',
    'bv',
    'bw',
    'by',
    'bz',
    'ca',
    'cc',
    'cd',
    'cf',
    'cg',
    'ch',
    'ci',
    'ck',
    'cl',
    'cm',
    'cn',
    'co',
    'cr',
    'cu',
    'cv',
    'cw',
    'cx',
    'cy',
    'cz',
    'de',
    'dj',
    'dk',
    'dm',
    'do',
    'dz',
    'ec',
    'ee',
    'eg',
    'eh',
    'er',
    'es',
    'et',
    'eu',
    'fi',
    'fj',
    'fk',
    'fm',
    'fo',
    'fr',
    'ga',
    'gb',
    'gd',
    'ge',
    'gf',
    'gg',
    'gh',
    'gi',
    'gl',
    'gm',
    'gn',
    'gp',
    'gq',
    'gr',
    'gs',
    'gt',
    'gu',
    'gw',
    'gy',
    'hk',
    'hm',
    'hn',
    'hr',
    'ht',
    'hu',
    'id',
    'ie',
    'il',
    'im',
    'in',
    'io',
    'iq',
    'ir',
    'is',
    'it',
    'je',
    'jm',
    'jo',
    'jp',
    'ke',
    'kg',
    'kh',
    'ki',
    'km',
    'kn',
    'kp',
    'kr',
    'kw',
    'ky',
    'kz',
    'la',
    'lb',
    'lc',
    'li',
    'lk',
    'lr',
    'ls',
    'lt',
    'lu',
    'lv',
    'ly',
    'ma',
    'mc',
    'md',
    'me',
    'mg',
    'mh',
    'mk',
    'ml',
    'mm',
    'mn',
    'mo',
    'mp',
    'mq',
    'mr',
    'ms',
    'mt',
    'mu',
    'mv',
    'mw',
    'mx',
    'my',
    'mz',
    'na',
    'nc',
    'ne',
    'nf',
    'ng',
    'ni',
    'nl',
    'no',
    'np',
    'nr',
    'nu',
    'nz',
    'om',
    'pa',
    'pe',
    'pf',
    'pg',
    'ph',
    'pk',
    'pl',
    'pm',
    'pn',
    'pr',
    'ps',
    'pt',
    'pw',
    'py',
    'qa',
    're',
    'ro',
    'rs',
    'ru',
    'rw',
    'sa',
    'sb',
    'sc',
    'sd',
    'se',
    'sg',
    'sh',
    'si',
    'sj',
    'sk',
    'sl',
    'sm',
    'sn',
    'so',
    'sr',
    'ss',
    'st',
    'su',
    'sv',
    'sx',
    'sy',
    'sz',
    'tc',
    'td',
    'tf',
    'tg',
    'th',
    'tj',
    'tk',
    'tl',
    'tm',
    'tn',
    'to',
    'tp',
    'tr',
    'tt',
    'tv',
    'tw',
    'tz',
    'ua',
    'ug',
    'uk',
    'us',
    'uy',
    'uz',
    'va',
    'vc',
    've',
    'vg',
    'vi',
    'vn',
    'vu',
    'wf',
    'ws',
    'ye',
    'yt',
    'za',
    'zm',
    'zw',
    'com',
    'org',
    'net',
    'info',
    'biz',
    'gov',
    'edu',
    'mil',
    'int',
    'app',
    'blog',
    'shop',
    'guru',
    'xyz',
    'club',
    'app',
    'blog',
    'shop',
    'guru',
    'xyz',
    'club',
    'tech',
    'online',
    'space',
    'website',
    'store',
    'site',
    'art',
    'fun',
    'live',
    'aero',
    'asia',
    'cat',
    'coop',
    'jobs',
    'mobi',
    'museum',
    'post',
    'tel',
    'travel',
    'xxx',
  ];

  measureValue: string[] = [
    'EA',
    'F2',
    'GM',
    'ML',
    'MG',
    'MEQ',
    'MM',
    'UG',
    'UU',
  ];

  getValidatorForWebsite() {
    return new RegExp(
      `^(https?:\/\/)?([a-z0-9-]+\.){1,2}(${this.validTLDs.join(
        '|'
      )})([\/\w \.-]*)*\/?$`,
      'i'
    );
  }

  DAYS_OF_WEEK: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  Title_List: string[] = ['MD', 'DO', 'DPM', 'PA', 'NP', 'CNM'];

  Suffix_List: string[] = ['Sr', 'Jr', 'III', 'IV', 'V'];

  offercodes: any[] = [
    {
      id: '1',
      name: 'MEDRECORD',
    },
    {
      id: '2',
      name: 'AIMEDICALSUMMARY',
    },
    {
      id: '3',
      name: 'SCHEDULING',
    },
    {
      id: '4',
      name: 'AIFACIALSCAN',
    },
    {
      id: '5',
      name: 'AISIMPLSCRIBE',
    },
    {
      id: '6',
      name: 'AIDOCSUMMARY',
    },
    {
      id: '7',
      name: 'SIMPLWRITE ',
    },
    {
      id: '8',
      name: 'VISITNOTES',
    },
    {
      id: '9',
      name: 'TELEHEALTH',
    },
    {
      id: '10',
      name: 'BILLCODING',
    },
    {
      id: '11',
      name: 'MEDRECORDSWRITE',
    },
    {
      id:'12',
      name: 'FORMS_OTHERHISTORY'
    },
    {
      id:'13',
      name: 'FORMS_VISITNOTES'
    },
    {
      id:'14',
      name: 'Forms_Forms'
    },
    {
      id:'15',
      name: 'LABORDERS'
    },
    {
      id:'16',
      name: 'RXORDERS'
    },
  ];

  generateTimeIntervals(): string[] {
    const timeIntervals: string[] = [];
    let currentHour = 0;
    let currentMinute = 0;
    let period = 'AM';

    while (!(currentHour === 24 && currentMinute === 0)) {
      const formattedHour = currentHour % 12 || 12; // Convert 0 to 12
      const formattedMinute = currentMinute === 0 ? '00' : `${currentMinute}`;

      timeIntervals.push(`${formattedHour}:${formattedMinute} ${period}`);

      currentMinute += 15;
      if (currentMinute === 60) {
        currentMinute = 0;
        currentHour++;
      }

      // Toggle between 'AM' and 'PM' based on the current hour
      period = currentHour < 12 ? 'AM' : 'PM';
    }

    return timeIntervals;
  }
  Repeats: string[] = ['Daily', 'Weekly', 'Monthly'];

  genrateEveryNumberItem(): string[] {
    const numbers: string[] = [];
    for (let i = 1; i <= 15; i++) {
      numbers.push('' + i);
    }
    return numbers;
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      cssClass: 'centered-toast',
      color: 'warning',
    });

    toast.present();
  }

  async presentToastSuccess(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      cssClass: 'centered-toast',
      color: 'success',
    });
    toast.present();
  }

  async presentToastFailure(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      cssClass: 'centered-toast',
      color: 'danger',
    });
    toast.present();
  }

  async presentToastWarning(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      cssClass: 'centered-toast',
      color: 'warning',
    });
    toast.present();
  }

  onInputChange(inputStringValue: string): string {
    if (inputStringValue !== undefined && inputStringValue.length > 0) {
      const value = inputStringValue.replace(/\D/g, '').substring(0, 10);
      return this.formatPhoneNumber(value);
    } else {
      return '';
    }
  }

  formatPhoneNumber(value: string): string {
    const match = value.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return value;
  }

  readonly phoneNumberMask: MaskitoOptions = {
    mask: [
      '(',
      /\d/,
      /\d/,
      /\d/,
      ')',
      ' ',
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ],
  };

  removeEmptyProperties(obj: any): any {
    const result: { [key: string]: any } = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        if (
          !(
            value === undefined ||
            value === 'undefined' ||
            value === null ||
            value === 'null' ||
            value === '' ||
            (typeof value === 'object' && Object.keys(value).length === 0)
          )
        ) {
          if (typeof value === 'object') {
            result[key] = this.removeEmptyProperties(value);
          } else {
            result[key] = value;
          }
        }
      }
    }

    return result;
  }

  removeDuplicates(array: any[]): any {
    const unique = (value: any, index: number, self: any[]) => {
      return (
        self.findIndex((v) => v.id === value.id && v.name === value.name) ===
        index
      );
    };
    return array.filter(unique);
  }

  getPageRequestObject(
    pageNo: number,
    pageSize: number,
    sort: string,
    sortByColumn: string
  ) {
    let pageRequest = new PageRequest();
    pageRequest.pageNo = pageNo;
    pageRequest.pageSize = pageSize;
    pageRequest.sort = sort;
    pageRequest.sortByColumn = sortByColumn;

    return pageRequest;
  }

  getSearchRequestDtoObject(
    column: string,
    value: string,
    joinTable: string,
    operation: string
  ) {
    let tempSearchRequestDto = new SearchRequestDto();
    tempSearchRequestDto.column = column;
    tempSearchRequestDto.value = value;
    tempSearchRequestDto.joinTable = joinTable;
    tempSearchRequestDto.operation = operation;

    return tempSearchRequestDto;
  }

  getSearchPaginationModel(
    globalOperator: string,
    pageRequest: PageRequest,
    searchRequestDtoList: SearchRequestDto[]
  ) {
    const searchPaginationModel = new PaginationModel();
    searchPaginationModel.globalOperator = globalOperator;
    searchPaginationModel.pageRequest = pageRequest;
    searchPaginationModel.searchRequestDto = searchRequestDtoList;

    return searchPaginationModel;
  }

  getErrorMessage(error: any) {
    return error?.error?.message;
  }

  getCurrentDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    let month = (now.getMonth() + 1).toString();
    let day = now.getDate().toString();
    // Add leading zeros if month or day is less than 10
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return `${year}-${month}-${day}`;
  }

  restrictToTwoDecimals(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const key = event.key;
 
    if (key === 'Backspace' || key === 'Tab' || key === 'End' || key === 'Home' || key === 'ArrowLeft' || key === 'ArrowRight') {
      return; // Allow special keys
    }
 
    const newValue = value + key;
 
    const regex = /^\d+(\.\d{0,2})?$/;
 
    if (!regex.test(newValue)) {
      event.preventDefault();
    }
  }
}

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
