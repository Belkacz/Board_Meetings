import { AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Observable, of } from "rxjs";

export class FormValidators {
    public static notEmpty(): ValidatorFn {
        return (control: AbstractControl) => {
            const value = control.value;
            //console.log(control)
            if (!value && !control.pristine) {
                return { notEmpty: true };
            }
            return null;
        };
    }

    public static startBeforeEnd(endDate: Date | null): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            const value = control.value;
            //console.log(value);
            console.log(endDate)
            if (value && endDate && value > endDate ) {
                return of({ endBeforeBeginning: true });
            }
            return of(null);
        };
    }
    public static startBeforeEnd2(startDate: Date, endDate: Date, startControl: FormControl, endControl: FormControl): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
          const value = control.value;
          if (startDate.getTime() > endDate.getTime()) {
            startControl.setErrors({ endBeforeBeginning: true });
            endControl.setErrors({ endBeforeBeginning: true });
            console.log(startControl);
          }
          else {
            startControl.setErrors(null);
            endControl.setErrors(null);
          }
          return of(null);
        };
      }
}