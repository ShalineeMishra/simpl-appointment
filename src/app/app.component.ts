import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
import { BrandingService, HostService, ShellService, ThemeService, TitleService } from 'simpl-shared-ui';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  logoUrl!: string;
  loginLogoUrl!: string;
  poweredByLogo!: string;
  urlParams: any;

  constructor(
    private titleSerice: TitleService,
    private router: Router,
    private themeService: ThemeService,
    private hostService: HostService,
    private http: HttpClient,
    private brandingService: BrandingService,
    private shellService: ShellService,
    private title: Title,
    private activatedRoute: ActivatedRoute,
    ) {

      this.activatedRoute.queryParams?.subscribe((params: any) => {
        this.urlParams = params;
        this.handleGetBrandingByPartnerNumber(params?.partner_number);
      });      
    }

  ngOnInit(): void {    
  // Programmatically navigate to appointment route with query params
    const currentUrl = window.location.href; // Get the current URL
    const url = new URL(currentUrl); // Create a URL object
    const params = url.searchParams; // Get the search parameters

    // Convert the search parameters to an object
    this.urlParams = {};
    params.forEach((value: any, key: any) => {
      this.urlParams[key] = value; // Set each parameter in the object
    });


   //for local run
    this.urlParams ={
      partner_number:'00000000',
      providerId :1,//instead of this we can ask provider mail id
      locationId : 2,
      mailId:'simpladmin123@yopmail.com',
      token:'eyJraWQiOiJBRFJ6cHlxR1JHbHAzM1p0cmZuVFNvbzExaGMrT1JzT0F2Nm43bjUxaFdRPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI1YmU1MzNmMS1iMzIwLTQ0OWUtYWYwMi00ODQxZjRiZTkyNWMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfU1JSaTVSSk9vIiwiY29nbml0bzp1c2VybmFtZSI6IjViZTUzM2YxLWIzMjAtNDQ5ZS1hZjAyLTQ4NDFmNGJlOTI1YyIsIm9yaWdpbl9qdGkiOiI3YmI3ZTZlNi03Y2RjLTRmODItOGJkZi02ZTU0MzNmMzYyN2UiLCJhdWQiOiJzbHVscHZmdHJkbWUxdWNicHQ5YWFodXNiIiwiZXZlbnRfaWQiOiJhN2MwYzVkMS1lNjNkLTRkZDItYTAwYS1kNDgxOGZmMTQ5YTAiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTcyODQ3MjUyNSwiZXhwIjoxNzI4NDc2MTI1LCJpYXQiOjE3Mjg0NzI1MjUsImp0aSI6ImM1OGU1OWRjLWM3MTYtNGE5Yy05MzkzLTZhMzNhNDczYmQ5MiIsImVtYWlsIjoic2ltcGxhZG1pbjEyM0B5b3BtYWlsLmNvbSJ9.gTQPGwf9Wl0UjnqBldMUGISx60ysAXOtIXejGL2cvkLsD0371KV3QGvl9jmeTyOq4wAmw6qBpG3Pcl3_jdAFFPzhJq8dci-tGAO_iF6jJZURlwx5oaOCRfslzfcEHwui7K5x_N9jMeSIS47CdbaW1_QATY1TYc3smUBfc4ZVdPR2-kGqxWd53tp-qF-2rWy_MmvDjtv-GjHy12xCjZgskK5mrpvsqgkih5BKDmD4q3LL4MKU15i5rJag1eXgV3V1hvIcdsxw9wOmfOCtzdJ_hHlOdHuFwZSYd8X02v2vsZr82TBSSdCpx2K8e-hh2BIoXGpJGUFNzRSnG6PsbOCmYA',
      test :'fromweb'
    }
    this.router.navigate(['/appointment'], { queryParams:  this.urlParams});//{ partnerNumber: '00000000' }
  }

  handleGetBrandingByPartnerNumber(partnerNumber: any) {
    if (!partnerNumber) {
      partnerNumber = '00000000';
    }
    this.brandingService
      .getBrandingByPartnerNumber(environment.partnerApiPrefix, partnerNumber)
      .subscribe(
        (x) => {
          this.themeService.setApplicationTheme(x?.body);
          this.title.setTitle(x?.body?.partner_name);
          this.shellService
            .getLogoByBranding(environment.providerApiPrefix, x?.body?.logo)
            .subscribe((y) => {
              this.logoUrl = y?.body;
              const currentTheme = {
                ...this.themeService.currentTheme,
                logoUrl: y?.body,
              };
              this.themeService?.setApplicationTheme(currentTheme);
            });
          if (x?.body?.login_logo) {
            this.shellService
              .getLogoByBranding(
                environment.providerApiPrefix,
                x?.body?.login_logo
              )
              .subscribe(
                (z) => {
                  this.loginLogoUrl = z?.body || '';
                  const currentTheme = {
                    ...this.themeService.currentTheme,
                    loginLogoUrl: z?.body || '',
                  };
                  this.themeService?.setApplicationTheme(currentTheme);
                },
                (error) => {
                  this.loginLogoUrl = '';
                }
              );
          }
          if (x?.body?.poweredby_logo) {
            this.shellService
              .getLogoByBranding(
                environment.providerApiPrefix,
                x?.body?.poweredby_logo
              )
              .subscribe(
                (z) => {
                  this.poweredByLogo = z?.body || '';
                  const currentTheme = {
                    ...this.themeService.currentTheme,
                    poweredByLogo: z?.body || '',
                  };
                  this.themeService?.setApplicationTheme(currentTheme);
                },
                (error: any) => {
                  this.poweredByLogo = '';
                }
              );
          }
        },
        (error: any) => {
          console.error('Error getting branding : ', error);
        }
      );
  }
}
