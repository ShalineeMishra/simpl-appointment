import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
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
export class AppComponent {
  logoUrl!: string;
  loginLogoUrl!: string;
  poweredByLogo!: string;

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
        this.handleGetBrandingByPartnerNumber(params?.partner_number);
      });      
    }

  ngOnInit(): void {    
    // Programmatically navigate to appointment route with query params
    let paramData ={
      partner_number:'00000000',
      providerId :1,//instead of this we can ask provider mail id
      locationId : 2,
      mailId:'simpladmin123@yopmail.com',
      token:'eyJraWQiOiJBRFJ6cHlxR1JHbHAzM1p0cmZuVFNvbzExaGMrT1JzT0F2Nm43bjUxaFdRPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI1YmU1MzNmMS1iMzIwLTQ0OWUtYWYwMi00ODQxZjRiZTkyNWMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfU1JSaTVSSk9vIiwiY29nbml0bzp1c2VybmFtZSI6IjViZTUzM2YxLWIzMjAtNDQ5ZS1hZjAyLTQ4NDFmNGJlOTI1YyIsIm9yaWdpbl9qdGkiOiJjMTVmMjZiZC02ZTgwLTRlNDItYjFiNC03MThlMzUyYjFkN2IiLCJhdWQiOiJzbHVscHZmdHJkbWUxdWNicHQ5YWFodXNiIiwiZXZlbnRfaWQiOiJmMzQ3NGY4MS04YjQzLTRmZDUtYjFhYy04N2EyOTUyZjM3MjUiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTcyODM5MDgzOSwiZXhwIjoxNzI4Mzk0NDM5LCJpYXQiOjE3MjgzOTA4MzksImp0aSI6ImJkZWQxMTU3LTc2MTMtNGIxMi1iODk0LWVlMzk3MmZhMjViZCIsImVtYWlsIjoic2ltcGxhZG1pbjEyM0B5b3BtYWlsLmNvbSJ9.MldGDdzAaop0l0LKw0kEN4iazQpYhjYzxYs6fE8lCqVo-q34PN1ptiHV2hoTsuD_ck73s7e5JRw_wHBJTn99HuUKsNKUpD4xWt1YPTtArQCDF8ynX4yW6v6wmas_oJKBq4hW-Ri4R0RCaP0nxRRizJekG6UEWjLAmF0hy_m7tt0gTLziJNVUyBNxXxR0Gz_AYYCJg_ctT474542Zfqapux5rdDet2ErMl0gUj91lNtqmjTfs6lKocoQuHJJfC7V8J6doPbCh4g4IkSB9dfs5HAuBpSViV7KnFld4qCsAwb1uU4-7xZUhkHUC1dgD8hjbCZ9oETFNMAD_SKtwGGmS6g'
    }
    this.router.navigate(['/appointment'], { queryParams:  paramData});//{ partnerNumber: '00000000' }
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
