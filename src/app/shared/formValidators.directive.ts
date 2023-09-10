import { AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Observable, of } from "rxjs";

export class FormValidators {

    public static notEmpty(): ValidatorFn {
        return (control: AbstractControl) => {
            const value = control.value;
            if (!value && !control.pristine) {
                return { notEmpty: true };
            }
            return null;
        };
    }

    // public static startBeforeEnd(endDate: Date | null): AsyncValidatorFn {
    //     return (control: AbstractControl): Observable<ValidationErrors | null> => {
    //         const value = control.value;
    //         if (value && endDate && value > endDate ) {
    //             return of({ endBeforeBeginning: true });
    //         }
    //         return of(null);
    //     };
    // }
    public static startBeforeEnd(startDate: Date, endDate: Date, startControl: FormControl, endControl: FormControl): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
          const value = control.value;
          console.log('startDate ', startDate)
          console.log('endDate ', endDate)
          if (startDate.getTime() > endDate.getTime()) {
            console.log("startDate.getTime() > endDate.getTime()")
            startControl.setErrors({ endBeforeBeginning: true });
            endControl.setErrors({ endBeforeBeginning: true });
          } else {
            console.log('else')
            startControl.setErrors({ endBeforeBeginning: null });
            endControl.setErrors({ endBeforeBeginning: null });
          }
          return of(null);
          console.log(startControl)
          console.log(endControl)
        };
      }

      public static locationValidator(isHybridChecked: boolean, isAddressChecked: boolean, isOnlineChecked: boolean){
        return (control: AbstractControl) => {
          //console.log(control)
          const onlineAddress = control.get('onlineAddress');
          const meetingAddress = control.get('meetingAddress');
          const hybridType = control.get('hybridType');
          
          let validLocation = false
          if(hybridType!.value){
            validLocation = onlineAddress!.value && meetingAddress!.value ? true : false
          } else {
            validLocation = onlineAddress!.value || meetingAddress!.value ? true : false
          }

          if (!validLocation) {
            return { 'addressRequired': true };
          }
          return null;
        };
      }

}