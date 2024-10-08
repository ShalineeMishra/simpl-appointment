import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener,
  Inject,
  OnDestroy,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { DOCUMENT, Location } from '@angular/common';
import {
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl,
  FormArray,
  FormControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { IonInput, MenuController, ToastController } from '@ionic/angular';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IState, LoggedInUser } from '../../../models/appointment.model';
import { CommunicationService } from '../../../services/communication.service';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { catchError, debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HTTPProviderService } from '../../../services/http-provider.service';
import { ToastMessageService } from 'simpl-shared-ui';
import { GlobleMethods } from '../../../services/gobalMethodVariable';

@Component({
  selector: 'addpatient-component',
  templateUrl: './addpatient.component.html',
  styleUrls: ['./addpatient.component.scss'],
})
export class AddpatientComponent implements OnInit, OnDestroy {
  phoneMask: MaskitoOptions = this.globleMethod.phoneNumberMask;
  maskPredicate: MaskitoElementPredicate = async (el) =>
    (el as HTMLIonInputElement).getInputElement();

  loggedInUserEmail: any;
  loggedInUserDetails: LoggedInUser = new LoggedInUser();
  inputname: any;
  inputvalue: any;
  payload: any;
  dataarr: any = [];
  regForm1!: FormGroup;
  patientdata: any;
  birthDate: string = '';
  isInvalidInput: boolean = false;
  selectedLeave: string = '';
  stateList: IState[] = [];
  selectedValue: string = '';
  selectedState: string = '';
  ssnNumber: string = '';
  Offer_Code_avail: any;
  hasRelationData: boolean = false;

  public jwtHelper: JwtHelperService = new JwtHelperService();

  selectItem(value: string) {
    this.selectedValue = value;
  }

  selectState(value: string) {
    this.selectedState = value;
  }

  searchTerm: string = '';
  showSuggestions: boolean = false;
  suggestions: string[] = []; // Your autocomplete suggestions

  @ViewChild('modal') modal: any;
  @ViewChild('input1', { static: false }) input1: IonInput | undefined;
  @ViewChild('input2', { static: false }) input2: IonInput | undefined;
  @ViewChild('input3', { static: false }) input3: IonInput | undefined;
  @ViewChild('input4', { static: false }) input4: IonInput | undefined;
  @Input() type!: string;
  @Input() events!: Observable<void>;
  eventsSubscription: Subscription = new Subscription();
  @Output() requestBodyForAddPatient: EventEmitter<any> = new EventEmitter();
  valueChangesSubscription: Subscription | undefined;
  showPassword = false;
  disableButton = false;

  // Set the default expanded accordion
  firstAccordion: string = 'firstAccordion';
  secondAccordion: string = 'secondAccordion';
  thirdAccordion: string = 'thirdAccordion';
  forthAccordion: string = 'forthAccordion';
  fifthAccordion: string = 'fifthAccordion';
  isHoveredPast: boolean = false;
  RelationDD: any[] = ['Self', 'Dependent'];
  insuranceTypeDD: any[] = ['Primary Insurance', 'Secondary Insurance'];
  files: File[] = [];
  insuranceFiles: { [index: number]: { [key: string]: File } } = {};
  selectedFileNames: string[] = [];
  selectedFiles: string[] = [];
  currentIndex: number = 0;
  fileNames: { [key: string]: string } = {
    insuranceFront: '',
    insuranceBack: '',
    idFront: '',
    idBack: ''
  };
  private searchSubject: Subject<string> = new Subject();
  public searchText = '';
  public isLoading = false;
  isListVisible: boolean = true;
  hasResults: boolean = false;
  public planNames: any[] = [];
  filteredPlanNames: any[] = [];
  numericOnly(event: any): boolean {
    let pattern = /^([0-9])$/;
    let result = pattern.test(event.key);
    return result;
  }
  dropdownStates: boolean[] = [];
  shownCodeDD = false;
  validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private location: Location,
    private toastController: ToastController,
    private toastMessageService: ToastMessageService,
    public httpProvider : HTTPProviderService,
    private globleMethod: GlobleMethods,
    private http: HttpClient,
    private communicationService: CommunicationService,
    private menuCtrl: MenuController,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.patientdata = this.router?.getCurrentNavigation()?.extras?.state;
    this.regForm1 = this.formBuilder.group(
      {
        firstname: [
          '',
          [
            Validators.required,
            Validators.maxLength(32),
            Validators.pattern("^[ a-zA-Z-']+$"),
          ],
        ],
        middlename: [
          '',
          [Validators.maxLength(32), Validators.pattern("^[ a-zA-Z-']+$")],
        ],
        lastname: [
          '',
          [
            Validators.required,
            Validators.maxLength(32),
            Validators.pattern("^[ a-zA-Z-']+$"),
          ],
        ],
        phone: ['', [Validators.maxLength(15), Validators.minLength(14)]],
        email: [
          '',
          [
            Validators.maxLength(50),
            Validators.pattern(
              /^(?![@._%+-])(?=.{1,50})(?=.{1,24}@.{1,49}$)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/
            ),
          ],
        ],
        dob: ['', [Validators.required]], // DOBValidator.ageCheck, Validators.pattern("^(1[0-2]|0[1-9])-(3[01]|[12][0-9]|0[1-9])-[0-9]{4}$")]
        gender: ['', [Validators.required]],
        ssn1: ['', [Validators.minLength(3), Validators.maxLength(3)]],
        ssn2: ['', [Validators.minLength(2), Validators.maxLength(2)]],
        ssn3: ['', [Validators.minLength(4), Validators.maxLength(4)]],

        addresses: this.formBuilder.array([
          this.createAddress(), // Initialize with one address (mandatory)
        ]),
        insurances: this.formBuilder.array([
          this.createInsurance('Primary Insurance'), // Initialize with one insurance (mandatory)
        ]),

      },
      { validator: this.ssnValidator }
    );
    this.dropdownStates.push(false);
    // Subscribe to valueChanges for all SSN fields
    this.valueChangesSubscription = this.regForm1.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.updateValidators();
      });

    if (this.patientdata !== undefined) {
      this.regForm1
        ?.get('firstname')
        ?.setValue(this.patientdata.data.first_name);
      this.regForm1
        ?.get('middlename')
        ?.setValue(this.patientdata.data.middle_name);
      this.regForm1?.get('lastname')?.setValue(this.patientdata.data.last_name);
      this.regForm1?.get('phone')?.setValue(this.patientdata.data.phone);
      this.regForm1?.get('email')?.setValue(this.patientdata.data.email);
      this.regForm1?.get('add1')?.setValue(this.patientdata.data.add1);
      this.regForm1?.get('add2')?.setValue(this.patientdata.data.add2);
      this.regForm1?.get('city')?.setValue(this.patientdata.data.city);
      this.regForm1?.get('state')?.setValue(this.patientdata.data.state);
      this.regForm1?.get('postal')?.setValue(this.patientdata.data.postal);
      this.regForm1?.get('dob')?.setValue(this.patientdata.data.dob);
      this.regForm1?.get('gender')?.setValue(this.patientdata.data.gender);
      this.regForm1?.get('ssn1')?.setValue(this.patientdata.data.ssn1);
      this.regForm1?.get('ssn2')?.setValue(this.patientdata.data.ssn2);
      this.regForm1?.get('ssn3')?.setValue(this.patientdata.data.ssn3);
    }
  }

  ngOnDestroy() {
    // Unsubscribe from the valueChanges observable to prevent memory leaks
    this.valueChangesSubscription?.unsubscribe();
  }

  ssnValidator(group: FormGroup) {
    const ssn1 = group.get('ssn1')?.value;
    const ssn2 = group.get('ssn2')?.value;
    const ssn3 = group.get('ssn3')?.value;
    const ssnNumber = ssn1 + ssn2 + ssn3;

    if (ssnNumber.length > 0 && ssnNumber.length !== 9) {
      return { invalidSSN: true };
    }
    return null;
  }

  updateValidators() {
    const ssn1Value = this.regForm1.get('ssn1')?.value;
    const ssn2Value = this.regForm1.get('ssn2')?.value;
    const ssn3Value = this.regForm1.get('ssn3')?.value;
    this.ssnNumber = ssn1Value + ssn2Value + ssn3Value;

    if (
      ssn1Value.length !== 3 ||
      ssn2Value.length !== 2 ||
      ssn3Value.length !== 4
    ) {
      this.setSSNValidate();
    } else if (this.ssnNumber.length === 0) {
      this.clearSSNValidation();
    }
    if (
      ssn1Value.length == 3 &&
      ssn2Value.length == 2 &&
      ssn3Value.length == 4
    ) {
      this.clearSSNValidation();
    }
    if (
      ssn1Value.length !== 3 &&
      ssn2Value.length !== 2 &&
      ssn3Value.length !== 4
    ) {
      this.clearSSNValidation();
    } else {
      this.clearSSNValidation();
    }
    this.updateValidity();
  }

  ssnLengthValid() {
    if (this.ssnNumber.length === 0) {
      this.clearSSNValidation();
    } else {
      this.setSSNValidate();
    }
    this.updateValidity();
  }

  clearSSNValidation() {
    this.regForm1.get('ssn1')?.clearValidators();
    this.regForm1.get('ssn2')?.clearValidators();
    this.regForm1.get('ssn3')?.clearValidators();
  }

  setSSNValidate() {
    this.regForm1
      .get('ssn1')
      ?.setValidators([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(3),
      ]);
    this.regForm1
      .get('ssn2')
      ?.setValidators([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(2),
      ]);
    this.regForm1
      .get('ssn3')
      ?.setValidators([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4),
      ]);
  }

  updateValidity() {
    this.regForm1.get('ssn1')?.updateValueAndValidity();
    this.regForm1.get('ssn2')?.updateValueAndValidity();
    this.regForm1.get('ssn3')?.updateValueAndValidity();
  }

  onSearchInput(event: any, divIdx: any) {
    this.searchText = event.target.value;
    this.isListVisible = true
    if (this.searchText.length >= 3) {
      this.toggleDropdown(divIdx, true);
      this.shownCodeDD = true;
      this.planNameApi(divIdx);
    } else {
      this.planNames = [];
      this.isLoading = false;
      this.hasResults = false;
    }
  }

  planNameApi(indx: number) {
    this.httpProvider.searchplanName(this.searchText).subscribe(
      (res: any) => {
        try {
          this.planNames = res.body;
          this.cdr.detectChanges();
        } catch (error: any) {
          console.error('Json parsing error : ', error);

        }
      },
      (error: any) => {
        this.toggleDropdown(indx, false);
        this.planNames = [];
        this.isLoading = false;
        this.hasResults = false;
        console.error('Endpoint call error : ', error);
      }
    );
  }

  alphanumericValidator(control: AbstractControl): ValidationErrors | null {
    const alphanumericRegex = /^[a-zA-Z0-9 ]*$/;
    const valid = alphanumericRegex.test(control.value);
    return valid ? null : { alphanumeric: true };
  }

  get addresses(): FormArray {
    return this.regForm1.get('addresses') as FormArray;
  }
  get insurances(): FormArray {
    return this.regForm1.get('insurances') as FormArray;
  }

  createAddress(): FormGroup {
    return this.formBuilder.group({
      add1: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(128),
        ],
      ],
      add2: ['', [Validators.maxLength(128)]],
      city: ['', [Validators.required, Validators.maxLength(64)]],
      state: ['', [Validators.required]],
      postal: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(5)],
      ],
    });
  }

  createInsurance(type: string): FormGroup {
    return this.formBuilder.group({
      insuranceType: [type],
      relation: [''],
      insuranceCarrierName: ['', [Validators.maxLength(255)]],
      planName: [''],
      groupId: ['', [this.alphanumericValidator, Validators.maxLength(255)]],
      memberId: ['', [this.alphanumericValidator, Validators.maxLength(255)]],

    });
  }

  addAddress(): void {
    const addresses = this.regForm1.get('addresses') as FormArray;
    addresses.push(this.createAddress());
  }

  addInsurance(): void {
    const addresses = this.regForm1.get('insurances') as FormArray;
    addresses.push(this.createInsurance('Secondary Insurance'));
    this.dropdownStates.push(false);
  }

  removeAddress(index: number): void {
    const addresses = this.regForm1.get('addresses') as FormArray;
    addresses.removeAt(index);
  }

  removeInsurance(index: number): void {
    const insurances = this.insurances;
    const primaryCount = insurances.controls.filter(ctrl => ctrl.get('insuranceType')?.value === 'Primary Insurance').length;

    // Check if the removed insurance is the only 'Primary'
    if (insurances.at(index)?.get('insuranceType')?.value === 'Primary Insurance' && primaryCount === 1) {
      // Prevent removing the only 'Primary' insurance
      return;
    }

    // Remove the insurance normally
    insurances.removeAt(index);

    // If there's still at least one insurance left, ensure the first one is 'Primary'
    if (insurances.length > 0 && !insurances.at(0).get('insuranceType')?.value) {
      insurances.at(0).get('insuranceType')?.setValue('Primary Insurance');
    }
    this.dropdownStates.splice(index, 1);
  }

  toggleDropdown(index: number, isShowDD: boolean) {
    this.dropdownStates[index] = isShowDD;
  }

  onTypeChange(index: number): void {
    const insurances = this.insurances;
    const selectedType = insurances.at(index)?.get('insuranceType')?.value;

    // Determine if there is only one insurance entry
    const totalInsurances = insurances.length;
    const primaryCount = insurances.controls.filter(ctrl => ctrl.get('insuranceType')?.value === 'Primary Insurance').length;


    // Check if the insurance array has only one item
    if (totalInsurances === 1) {
      if (selectedType === 'Secondary Insurance') {
        // If there is only one insurance and it's being changed to 'Secondary Insurance', revert the change
        insurances.at(index).get('insuranceType')?.setValue('Primary Insurance');
        this.clearAllInsuranceFiles();
      }
    } else {
      // If there are multiple insurances
      if (selectedType === 'Primary Insurance') {
        // Ensure other insurances are 'Secondary Insurance'
        insurances.controls.forEach((control, i) => {
          if (i !== index) {
            control.get('insuranceType')?.setValue('Secondary Insurance');
            this.clearAllInsuranceFiles();
          }
        });
        // Move the selected insurance to the top
        const removedInsurance = insurances.at(index);
        insurances.removeAt(index);
        insurances.insert(0, removedInsurance);

        // Trigger change detection to update the UI
        this.cdr.detectChanges();
      } else if (selectedType === 'Secondary Insurance') {
        // Ensure that there is at least one 'Primary Insurance'
        const remainingPrimaryCount = insurances.controls.filter((ctrl, i) => i !== index && ctrl.get('insuranceType')?.value === 'Primary Insurance').length;

        if (primaryCount <= 1 && remainingPrimaryCount === 0) {
          // If no other 'Primary Insurance' exists, revert the change
          insurances.at(index).get('insuranceType')?.setValue('Primary Insurance');
        }
      }
    }
  }

  clearAllInsuranceFiles(): void {
    this.insuranceFiles = [];
  }

  getPrefixForInsuranceType(index: number): string {
    // Prefix based on index (0: '1_', 1: '2_', etc.)
    return `${index + 1}_`;
  }

  onFileSelected(event: any, type: string, index: number): void {
    const file: File = event.target.files[0];
    if (file) {
      // Get the prefix based on the index
      const prefix = this.getPrefixForInsuranceType(index);

      // Determine the file type based on the input name
      let fileName = '';
      switch (type) {
        case 'insuranceFront':
          fileName = `${prefix}INSURANCECARD_FRONT.jpg`;
          break;
        case 'insuranceBack':
          fileName = `${prefix}INSURANCECARD_BACK.jpg`;
          break;
        case 'idFront':
          fileName = `${prefix}IDCARD_FRONT.jpg`;
          break;
        case 'idBack':
          fileName = `${prefix}IDCARD_BACK.jpg`;
          break;
      }
      const newFile = new File([file], fileName, { type: file.type });
      if (this.validImageTypes.includes(file.type)) {
        // Store the file in the insuranceFiles object
        if (!this.insuranceFiles[index]) {
          this.insuranceFiles[index] = {};
        }
        this.insuranceFiles[index][type] = newFile;
        // Update the file name to the actual file name
        this.fileNames[type] = fileName;

        // Add the actual file name to the selectedFileNames list if not already present
        if (!this.selectedFileNames.includes(fileName)) {
          this.selectedFileNames.push(fileName);
        }
        this.selectedFiles.push(fileName)
      } else {
        this.toastMessageService.presentErrorMessage("Please upload only jpeg,png,jpg images");
      }

    }
  }

  removeFile(fileName: string): void {
    // Remove the file name from the list
    const index = this.selectedFileNames.indexOf(fileName);
    if (index > -1) {
      this.selectedFileNames.splice(index, 1);
    }

    // Remove the file from insuranceFiles
    for (const idx in this.insuranceFiles) {
      if (this.insuranceFiles.hasOwnProperty(idx)) {
        const files = this.insuranceFiles[idx];
        for (const type in files) {
          if (files.hasOwnProperty(type)) {
            if (this.fileNames[type] === fileName) {
              delete files[type];
              this.fileNames[type] = ''; // Clear the file name from the input field
            }
          }
        }
        if (Object.keys(this.insuranceFiles[idx]).length === 0) {
          delete this.insuranceFiles[idx];
        }
      }
    }

    // Reset the file input field value
    this.clearFileInputs();
  }

  clearFileInputs(): void {
    // Get all file input elements
    const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;

    // Clear the value of each file input
    inputs.forEach(input => {
      input.value = '';
    });
  }

  
  ngOnInit(): void {
    if (this.type === 'appointment') {
      this.eventsSubscription = this.events.subscribe(() => {
        this.hasInsuranceValue() ? this.sendData() : this.addpatient();
      });
    }
    this.getAllActiveStates();
    this.checkoffercodes();

  }

  searchPlanName(searchText: string) {
    // Replace the URL with your actual API endpoint
    const apiUrl = this.httpProvider.searchplanName(searchText);
    return apiUrl;
  }

  async getAllActiveStates() {
    const active = true; // To get all active time zones.
    await this.httpProvider.getAllStatesByStatus<IState[]>(active).subscribe({
      next: (res: any) => {
        this.stateList = [];
        this.stateList = res;
      },
      error: (error) => {
        console.error(error.error.message);
      },
    });
  }

  checkoffercodes() {
    let availofferCodes: any = localStorage.getItem('AvailofferCodes');
    availofferCodes = JSON.parse(availofferCodes) || '';
    this.Offer_Code_avail = [];
    if (availofferCodes?.length !== 0) {
      let value = availofferCodes?.some((item: any) => item.id === '1');
      if (value) {
        this.Offer_Code_avail.push('MEDRECORD');
      }
      let value2 = availofferCodes?.some((item: any) => item.id === '2');
      if (value2) {
        this.Offer_Code_avail.push('AIMEDICALSUMMARY');
      }
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onInput(currentInput: IonInput | undefined, nextInput: IonInput | undefined) {
    const value = currentInput?.value as string;
    const maxLength = currentInput?.maxlength?.toString() || '0';

    if (value && value.length === +maxLength && nextInput) {
      nextInput.setFocus();
    }
  }

  validateZipCodePaste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData;
    const pastedData = clipboardData?.getData('text');
    // Convert pasted data to a number
    const numericValue = Number(pastedData);

    // Check if the pasted data is a valid number and matches the original string value
    if (isNaN(numericValue) || numericValue.toString() !== pastedData) {
      // If not numeric, prevent the paste
      event.preventDefault();
    }
  }
 


  openEndMenu(index: any) {
    // Clear out existing file names and selected file names
    this.fileNames = {};
    this.selectedFileNames = [];

    // Set the current index and update file names for the selected index
    this.currentIndex = index;

    // Update file names based on the files for the current index
    const files = this.insuranceFiles[index] || {};
    for (const type of ['insuranceFront', 'insuranceBack', 'idFront', 'idBack']) {
      if (files[type]) {
        this.fileNames[type] = `${this.getPrefixForInsuranceType(index)}${this.getFileName(type)}`;
        if (!this.selectedFileNames.includes(this.fileNames[type])) {
          this.selectedFileNames.push(this.fileNames[type]);
        }
      }
    }

    this.menuCtrl.open('uploadInsuraceMenuId');
  }

  private getFileName(type: string): string {
    switch (type) {
      case 'insuranceFront':
        return 'INSURANCECARD_FRONT.jpg';
      case 'insuranceBack':
        return 'INSURANCECARD_BACK.jpg';
      case 'idFront':
        return 'IDCARD_FRONT.jpg';
      case 'idBack':
        return 'IDCARD_BACK.jpg';
      default:
        return '';
    }
  }
  closeEndMenu() {
    this.menuCtrl.close('uploadInsuraceMenuId');
  }
  searchPatientList() {
    this.menuCtrl.close('uploadInsuraceMenuId');
  }

  toggleIconColorPast() {
    this.isHoveredPast = !this.isHoveredPast; // Toggle the state
  }

  // Method to check if any insurance has a value
  hasInsuranceValue(): boolean {
    const insurances = this.regForm1.get('insurances') as FormArray;
    return insurances.controls.some(
      (control) => control.get('insuranceCarrierName')?.value?.trim() !== ''
    );
  }

  compressImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (ctx) {
              // Set the canvas dimensions to the image dimensions
              canvas.width = img.width;
              canvas.height = img.height;

              // Draw the image onto the canvas
              ctx.drawImage(img, 0, 0);

              // Compress the image by resizing the canvas
              const maxWidth = 800; // Maximum width
              const maxHeight = 800; // Maximum height
              const scale = Math.min(maxWidth / img.width, maxHeight / img.height);

              canvas.width = img.width * scale;
              canvas.height = img.height * scale;
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

              // Convert canvas to Blob
              canvas.toBlob((blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error('Error compressing image'));
                }
              }, 'image/jpeg', 0.6); // JPEG format with quality 0.7
            } else {
              reject(new Error('Could not get canvas context'));
            }
          };
          img.src = reader.result as string;
        } else {
          reject(new Error('File reader result is null'));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  async sendData() {
    this.ssnNumber =
      this.regForm1?.value?.ssn1 +
      '' +
      this.regForm1?.value?.ssn2 +
      '' +
      this.regForm1?.value?.ssn3;
    let AddressArray: any[] = [];
    let insuranceArray: any[] = [];
    this.ssnLengthValid();
    if (this.regForm1.valid && !this.isInvalidInput) {
      this.regForm1.value?.addresses?.forEach((element: any, index: any) => {
        let addressData = {
          address_line_1:
            this.regForm1?.value?.addresses[index]?.add1.trim() || '',
          address_line_2:
            this.regForm1?.value?.addresses[index]?.add2.trim() || '',
          city: this.regForm1?.value?.addresses[index]?.city.trim() || '',
          state: this.regForm1?.value?.addresses[index]?.state.trim() || '',
          country: 'USA',
          zip: this.regForm1?.value?.addresses[index]?.postal || '',
          order_of_address: index + 1,
        };
        AddressArray.push(addressData);
      });
      this.regForm1.value?.insurances?.forEach((element: any, index: any) => {
        let insuranceData: { [key: string]: any } = {
          insurance_carrier_name:
            this.regForm1?.value?.insurances[index]?.insuranceCarrierName.trim() || '',
          plan_name:
            this.regForm1?.value?.insurances[index]?.planName.trim() || '',
          group_id:
            this.regForm1?.value?.insurances[index]?.groupId.trim() || '',
          member_id: this.regForm1?.value?.insurances[index]?.memberId || '',
          insurance_type: index + 1,
        };
      
        let relation = this.regForm1?.value?.insurances[index]?.relation?.trim();
        
        // Only add 'relation' key if it has a value
        if (relation) {
          insuranceData['relation'] = relation;
        }
        
        insuranceArray.push(insuranceData);
      });
      let data = {
        username: this.regForm1?.value?.email.trim() || '',
        first_name: this.regForm1?.value?.firstname.trim() || '',
        middle_name: this.regForm1?.value?.middlename.trim() || '',
        last_name: this.regForm1?.value?.lastname.trim() || '',
        phone: this.regForm1?.value?.phone || '',
        email: this.regForm1?.value?.email.trim() || '',
        ssn: this.ssnNumber || '',
        partner_number: '00000000',
        role_type: 'PRIMARY',
        hc_professional_simpl_id: localStorage.getItem('professionalSimplId'),
        offer_codes: this.Offer_Code_avail,
        provider_id: localStorage.getItem('providerId'),
        hc_professional_id: localStorage.getItem('professionalSimplId'),
        location_id: localStorage.getItem('locationId'),
        consumer_detail: {
          date_of_birth: this.formatDobDate(this.regForm1?.value?.dob) || '',
          gender: this.regForm1?.value?.gender || '',
          ssn: this.ssnNumber || '',
          language: 'es'
        },
        consumer_address: AddressArray, // multiple address
        consumer_insurance: insuranceArray, //multiple insurances
      };
      const formData = new FormData();

      // Create FormData object

      // formData.append('consumerDto', JSON.stringify(data)); // Send as text
      formData.append(
        'consumerDto',
        new Blob([JSON.stringify(data)], { type: 'application/json' })
      );
      // Iterate over insuranceFiles to append each file to FormData

      // Log the updated insuranceFiles to check the result
      for (const index in this.insuranceFiles) {
        if (this.insuranceFiles.hasOwnProperty(index)) {
          const files = this.insuranceFiles[index];
          for (const type in files) {
            if (files.hasOwnProperty(type)) {
              const file = files[type];
              const compressedBlob = await this.compressImage(file);
              formData.append('files', compressedBlob, file.name);
            }
          }
        }
      }
      // Inspect FormData contents

      let token = localStorage?.getItem('id_token');
      const simpl_id = localStorage?.getItem('locationId');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'x-simpl-locationid': `${simpl_id}`,
      });
      let url = this.httpProvider.createInsuranceURL()
      this.http
        .post(
          url,
          formData,
          { headers }
        )
        .subscribe(
          (res: any) => {
            if (res?.code === 2001) {
              if (this.type == "appointment") {
                let sendDataObj = {
                  simpl_id: res?.body?.simpl_id
                }
                this.passPatientDataToappointment(sendDataObj)
              } else {
                this.disableButton = true;
                this.communicationService.sendMessage('added');
                this.regForm1.reset();
                while (this.insurances.length) {
                  this.insurances.removeAt(0);
                }

                // Add a single insurance entry
                this.insurances.push(this.createInsurance('Primary Insurance'));
                this.router.navigate(['/patient']);
              }

            }
          },
          (error) => {
            console.error('Error:', error); // Log the full error for debugging
            this.toastMessageService.presentErrorMessage('Error adding new patient: ' + (error?.message || 'Unknown error'));
          }
        );

    } else {
      if (!this.regForm1?.value?.firstname) {
        this.regForm1?.get('firstname')?.markAsTouched();
      }
      if (!this.regForm1?.value?.lastname) {
        this.regForm1?.get('lastname')?.markAsTouched();
      }
      if (!this.regForm1?.value?.phone) {
        this.regForm1?.get('phone')?.markAsTouched();
      } if (!this.regForm1?.value?.email) {
        this.regForm1?.get('email')?.markAsTouched();
      }
      if (!this.regForm1?.value?.dob) {
        this.regForm1?.get('dob')?.markAsTouched();
      }
      if (!this.regForm1?.value?.gender) {
        this.regForm1?.get('gender')?.markAsTouched();
      }
      if (!this.regForm1?.value?.ssn1) {
        this.regForm1?.get('ssn1')?.markAsTouched();
      }
      if (!this.regForm1?.value?.ssn2) {
        this.regForm1?.get('ssn2')?.markAsTouched();
      }
      if (!this.regForm1?.value?.ssn3) {
        this.regForm1?.get('ssn3')?.markAsTouched();
      }
      this.addresses?.controls.forEach(addressForm => {
        if (!addressForm?.value?.add1) {
          addressForm?.get('add1')?.markAsTouched();
        }
        if (!addressForm?.value?.city) {
          addressForm?.get('city')?.markAsTouched();
        }
        if (!addressForm?.value?.state) {
          addressForm?.get('state')?.markAsTouched();
        }
        if (!addressForm?.value?.postal) {
          addressForm?.get('postal')?.markAsTouched();
        }
      });
    }
  }

  addpatient() {
    this.ssnNumber =
      this.regForm1?.value?.ssn1 +
      '' +
      this.regForm1?.value?.ssn2 +
      '' +
      this.regForm1?.value?.ssn3;
    let AddressArray: any[] = [];
    this.ssnLengthValid();
    if (this.regForm1.valid && !this.isInvalidInput) {
      this.regForm1.value?.addresses?.forEach((element: any, index: any) => {
        let addressData = {
          address_line_1:
            this.regForm1?.value?.addresses[index]?.add1.trim() || '',
          address_line_2:
            this.regForm1?.value?.addresses[index]?.add2.trim() || '',
          city: this.regForm1?.value?.addresses[index]?.city.trim() || '',
          state: this.regForm1?.value?.addresses[index]?.state.trim() || '',
          country: 'USA',
          zip: this.regForm1?.value?.addresses[index]?.postal || '',
          order_of_address: index + 1,
        };
        AddressArray.push(addressData);
      });

      let data = {
        username: this.regForm1?.value?.email.trim() || '',
        first_name: this.regForm1?.value?.firstname.trim() || '',
        middle_name: this.regForm1?.value?.middlename.trim() || '',
        last_name: this.regForm1?.value?.lastname.trim() || '',
        phone: this.regForm1?.value?.phone || '',
        email: this.regForm1?.value?.email.trim() || '',
        ssn: this.ssnNumber || '',
        partner_number: '00000000',
        role_type: 'PRIMARY',
        hc_professional_simpl_id: localStorage.getItem('professionalSimplId'),
        offer_codes: this.Offer_Code_avail,
        //[ "MEDRECORD","AIMEDICALSUMMARY"],
        provider_id: localStorage.getItem('providerId'),
        hc_professional_id: localStorage.getItem('providerId'),
        location_id: localStorage.getItem('locationId'),
        consumer_detail: {
          date_of_birth: this.formatDobDate(this.regForm1?.value?.dob) || '',
          gender: this.regForm1?.value?.gender || '',
          ssn: this.ssnNumber || '',
          language: 'es'//need to remove
        },
        consumer_address: AddressArray, // multiple address
      };

      this.httpProvider.savepatient(data).subscribe({
        next: (res: any) => {
          if (res.code === 2001) {
            if (this.type == "appointment") {
              let sendDataObj = {
                simpl_id: res?.body?.simpl_id
              }
              this.passPatientDataToappointment(sendDataObj)
            } else {
              this.disableButton = true;
              this.communicationService.sendMessage("added");
              this.regForm1.reset();
              this.router.navigate(['/patient']);
            }
          }
        },
        error: (error: any) => {
          this.toastMessageService.presentErrorMessage('Error adding new patient:' + " " + error.error.message)
        }
      });

    } else {
      if (!this.regForm1?.value?.firstname) {
        this.regForm1?.get('firstname')?.markAsTouched();
      }
      if (!this.regForm1?.value?.lastname) {
        this.regForm1?.get('lastname')?.markAsTouched();
      }
      if (!this.regForm1?.value?.phone) {
        this.regForm1?.get('phone')?.markAsTouched();
      }
      if (!this.regForm1?.value?.email) {
        this.regForm1?.get('email')?.markAsTouched();
      }
      if (!this.regForm1?.value?.dob) {
        this.regForm1?.get('dob')?.markAsTouched();
      }
      if (!this.regForm1?.value?.gender) {
        this.regForm1?.get('gender')?.markAsTouched();
      }
      if (!this.regForm1?.value?.ssn1) {
        this.regForm1?.get('ssn1')?.markAsTouched();
      }
      if (!this.regForm1?.value?.ssn2) {
        this.regForm1?.get('ssn2')?.markAsTouched();
      }
      if (!this.regForm1?.value?.ssn3) {
        this.regForm1?.get('ssn3')?.markAsTouched();
      }
      this.addresses?.controls.forEach((addressForm) => {
        if (!addressForm?.value?.add1) {
          addressForm?.get('add1')?.markAsTouched();
        }
        if (!addressForm?.value?.city) {
          addressForm?.get('city')?.markAsTouched();
        }
        if (!addressForm?.value?.state) {
          addressForm?.get('state')?.markAsTouched();
        }
        if (!addressForm?.value?.postal) {
          addressForm?.get('postal')?.markAsTouched();
        }
      });
    }
  }

  close() {
    this.location.back();
  }


  passPatientDataToappointment(data: any) {
    const dataToSend = { PatientData: data };
    this.requestBodyForAddPatient.emit(dataToSend);
  }

  findIndexInArray(value: string, array: [string]) {
    return array.indexOf(value);
  }

  onDobInput() {
    if (!new RegExp('^[0-9-]*$').test(this.regForm1?.get('dob')?.value)) {
      let varr = this.regForm1?.get('dob')?.value;
      this.regForm1?.get('dob')?.setValue(varr.substr(0, varr.length - 1));
    }

    const regex = /(?<=^\d{2}|^\d{4})(?=\d)/g;
    this.regForm1
      ?.get('dob')
      ?.setValue(
        this.regForm1?.get('dob')?.value.replace(/\D+/g, '').replace(regex, '-')
      );
  }

  formatDobDate(inputDobDate: string) {
    if (inputDobDate) {
      const dateParts = inputDobDate.split('-');
      return `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`;
    }
    return undefined;
  }

  validateDate() {
    // Split the input into parts
    const parts = this.birthDate.split('-');
    const month = parseInt(parts[0], 10);
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    const currentYear = new Date().getFullYear();
    if (
      month < 1 ||
      month > 12 ||
      day < 1 ||
      (day > 31 && !(day <= 30 && [4, 6, 9, 11].includes(month))) ||
      (day > 30 && [4, 6, 9, 11].includes(month)) ||
      day < 1 ||
      (day > 28 && !this.isLeapYear(year) && month === 2) || // Check for February and leap year
      (year < 1900 && parts[2].length === 4) ||
      (year > currentYear && parts[2].length === 4)
    ) {
      this.isInvalidInput = true;
    } else {
      this.isInvalidInput = false;
    }
  }

  isLeapYear(year: number): boolean {
    return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
  }

  onclickYes() {
    this.modal.dismiss();
    this.close();
  }
  openModal() {
    this.modal.present();
  }
  closeModal() {
    this.modal.dismiss();
  }


  onSelectPlan(plan: any, divIdx: number) {
    this.shownCodeDD = false;
    this.dropdownStates[divIdx] = false;
    this.searchText = plan.plan_name;

    // Access the FormArray
    const insurancesArray = this.regForm1.get('insurances') as FormArray;

    if (insurancesArray && divIdx < insurancesArray.length) {
      // Get the specific FormGroup from the FormArray
      const insuranceGroup = insurancesArray.at(divIdx) as FormGroup;

      if (insuranceGroup) {
        // Update the specific property
        insuranceGroup.get('planName')?.setValue(plan.plan_name);
      }
    }

    this.planNames = [];
    this.cdr.detectChanges();
  }

}
