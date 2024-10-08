import { FormControl } from "@angular/forms";
var currentDate;
export class DOBValidator {
  
    public static ageCheck(control: FormControl) {
        if (control?.errors && !control.errors['under18']) {
            return false;
          } 
      
          if(control?.value === ""){
           currentDate = new Date().toISOString();
          }
          else{
            currentDate = control?.value;
          }
          if (DOBValidator.getAge(currentDate) <= 18) {
            return { under18: true }
          } else {
            return false;   
          }
    }

    public static getAge(date: string): number {
        let today = new Date();
        let birthDate = new Date(date);
        let age = today.getFullYear() - birthDate.getFullYear();
        let month = today.getMonth() - birthDate.getMonth();
        
        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      }
}

