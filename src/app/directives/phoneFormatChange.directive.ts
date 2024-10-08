import { Directive, ElementRef, HostListener ,AfterViewInit } from '@angular/core';
 
@Directive({
  selector: '[appPhoneFormat]'
})
export class PhoneFormatDirective implements AfterViewInit{
 
  constructor(private el: ElementRef) { }
 
  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value.replace(/\D/g, '').substring(0, 10); // Remove non-numeric characters and limit to 10 digits
    const formattedValue = this.formatPhoneNumber(value);
    this.el.nativeElement.value = formattedValue;
  }
 
  @HostListener('ionChange', ['$event'])
  onIonChange(event: CustomEvent) {
    const value = (event.target as HTMLInputElement).value.replace(/\D/g, '').substring(0, 10); // Remove non-numeric characters and limit to 10 digits
    const formattedValue = this.formatPhoneNumber(value);
    this.el.nativeElement.value = formattedValue;
  }
 
  formatPhoneNumber(value: string): string {
    const match = value.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return value;
  }
    ngAfterViewInit(): void {
    // Format the value of the span element
    const formattedValue = this.formatPhoneNumber(this.el.nativeElement.textContent);
    this.el.nativeElement.textContent = formattedValue;
  }
}