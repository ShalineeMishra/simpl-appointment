import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ThemeService, AuthService, TitleService, HostService, PROVIDER_HOST } from 'simpl-shared-ui';
import { CommonDtoService } from '../services/common.dto.service';
import { HTTPProviderService } from '../services/http-provider.service';
import { LocationListModel } from '../models/appointment.model';

@Component({
  selector: 'app-app-template-component',
  templateUrl: './app-template-component.component.html',
  styleUrl: './app-template-component.component.scss'
})
export class AppTemplateComponent implements OnInit {
  menuItems: any[] = [
    {
      subMenuItems: [
        {
          id: 'appointments',
          label: 'Appointments',
          icon: 'appointments.svg',
          routerLink: ['/', 'appointment'],
          visible: true,
        },       
        {
          id: 'appointments',
          label: '1',
          icon: 'appointments.svg',
          routerLink: ['/', 'appointment'],
          visible: false,
        },
        {
          id: 'appointments',
          label: '2',
          icon: 'appointments.svg',
          routerLink: ['/', 'appointment'],
          visible: false,
        },{
          id: 'appointments',
          label: '1',
          icon: 'appointments.svg',
          routerLink: ['/', 'appointment'],
          visible: false,
        },
        {
          id: 'appointments',
          label: '2',
          icon: 'appointments.svg',
          routerLink: ['/', 'appointment'],
          visible: false,
        },
        {
          id: 'appointments',
          label: '1',
          icon: 'appointments.svg',
          routerLink: ['/', 'appointment'],
          visible: false,
        },
        {
          id: 'appointments',
          label: '1',
          icon: 'appointments.svg',
          routerLink: ['/', 'appointment'],
          visible: false,
        },
        {
          id: 'appointments',
          label: '1',
          icon: 'appointments.svg',
          routerLink: ['/', 'appointment'],
          visible: false,
        },
        {
          id: 'appointments',
          label: '1',
          icon: 'appointments.svg',
          routerLink: ['/', 'appointment'],
          visible: false,
        },
        {
          id: 'appointments',
          label: '1',
          icon: 'appointments.svg',
          routerLink: ['/', 'appointment'],
          visible: false,
        },
        {
          id: 'appointments',
          label: '1',
          icon: 'appointments.svg',
          routerLink: ['/', 'appointment'],
          visible: false,
        },
      ],
    }
  ];
  providerLocation : any[] = [];
  selectedProviderLocation : any;  
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
  constructor(public themeService: ThemeService,
    private titleService: TitleService,
    public httpProvider: HTTPProviderService,
    private router: Router,
    private route: ActivatedRoute,
    public commonDtoService: CommonDtoService,
    private menuCtrl: MenuController,
    private ele: ElementRef,
    private activatedRoute: ActivatedRoute,){
      this.activatedRoute.queryParams?.subscribe((params: any) => {
        if (Object.keys(params).length !== 0) {
          localStorage.setItem('providerId', params?.providerId);
          localStorage.setItem('locationId',params?.locationId);  
          localStorage.setItem('mailId',params?.mailId);  
          localStorage.setItem('id_token',params?.token);  

          //Clear query parameters after saving them to local storage
          this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: {},  // Clear the query params
            replaceUrl: true  // Remove them from the URL
          });
        }          
      }); 
      this.themeService.setApplicationTheme(this.themeService.currentTheme);
      this.titleService.init(this.themeService.currentTheme?.partner_name);
      // this.hostService.setHost(PROVIDER_HOST);
      // this.http.get('assets/jsons/provider-vars.json').subscribe((x) => {
      //   this.hostService.setHostVariables(x);
      // });
      // this.hostService.setHost(CONSUMER_HOST);
      // this.http.get('assets/jsons/consumer-vars.json').subscribe((x) => {
      //   this.hostService.setHostVariables(x);
      // });
    }

  ngOnInit(): void {
  }

  /**
   * This function call on page load, get list of location
   */
 
  handleOnClickOfMenuItems(menu: any) {
    console.log("menu",menu);
  }

  getProviderName() {
    let offer_codesList = this.offercodes;
    const email = localStorage.getItem("email") ||'';
    if(email !== ''){
      this.httpProvider.getLoggedInProviderDetail(email).subscribe(async (res: any) => {
        let offerCodes = res?.body?.provider?.offer_codes || [];
        const availofferCodes = offer_codesList.filter((item: any) => offerCodes.includes(item.id));      
        localStorage.setItem('AvailofferCodes', JSON.stringify(availofferCodes));
        localStorage.setItem('professionalId', res?.body?.id || 0);
        localStorage.setItem('professionalSimplId', res?.body?.professional_simpl_id || "");
        localStorage.setItem('provider_location_name',res?.body?.provider?.provider_location_dto?.name ||'')
        localStorage.setItem('providerName', res?.body?.provider?.name || "");
        localStorage.setItem('firstName', res?.body?.first_name || "");
        localStorage.setItem('lastName', res?.body?.last_name || "");
        localStorage.setItem('providerId', res?.body?.provider?.id || 0);
        let l_role_types: any = res?.body?.role_types || [];
        localStorage.setItem('role_types', JSON.stringify(l_role_types));
        
      }, (error: any) => {
        console.error("Error occured.!",error);
      });
    }
   
  }
}
