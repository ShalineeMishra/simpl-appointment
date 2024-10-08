import {Component,Input,forwardRef,HostListener,ElementRef,Output,EventEmitter,ViewChild} from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { NgControl } from '@angular/forms';

    @Component({
    selector: "location-search-dropdown",
    templateUrl: "location-search-dropdown.html",
    styleUrls: ["location-search-dropdown.scss"],
    providers: [
        {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => LocationSearchDropdown),
        multi: true
        }
    ]
    })

export class LocationSearchDropdown implements ControlValueAccessor {
    list = [];
    temp_list = [];
    keyword = "";
    _img!: any;
    _label!: any;
    _uid!: any;
    @Output() locationvalueSelected = new EventEmitter<any>();
    @ViewChild("input", { static: false }) input!: ElementRef;
    @Input("size") size!: any;
    @Input("items") set items(value: any) {
        this.list = value;
        this.temp_list = value;
    }
    @Input("img") img! : any;
    @Input("label") label!: any;
    @Input("uid") uid! : any;
    @Input("avl") avl! : any;
    @Input("defaultLabel") defaultLabel! : string;
    @Input("ngModelselectedValue") ngModelselectedValue! : any;
    onChange: any = () => { };
    onTouch: any = () => { };
    value: any = "Select";
    shown = false;
    selectedOption = null;
    
    constructor(private ele: ElementRef) 
    {}

    ngOnChanges() {
      this._label = (typeof this.label !== 'undefined' && this.label !== '') ? this.label : 'name';
      this._img = (typeof this.img !== 'undefined' && this.img !== '') ? this.img : 'img';
      this._uid = (typeof this.uid !== 'undefined' && this.uid !== '') ? this.uid : 'id';
      this.value = this.defaultLabel;
      if(this.ngModelselectedValue !== null){
        let result: any = this.list.find((item: any) => item.id === Number(this.ngModelselectedValue));
        let name = result ? result.name : this.defaultLabel;
        this.value = name;
      }
    }

    writeValue(value: any) {
      if (value) {
        this.temp_list.map(x => {
          if (x[this._uid] == value) {
            this.value = x[this._label];
          }
        })
      }
    }

    registerOnChange(fn: any) {
      this.onChange = fn;
    }

    registerOnTouched(fn: any) {
      this.onTouch = fn;
    }

    search(e: any) {
      const val = e.toLowerCase();
      const temp = this.temp_list.filter((x:any) => {
        if (x[this._label].toLowerCase().indexOf(val) !== -1 || !val) {
          return x;
        }
      });
      this.list = temp;
    }

    select(item: any) {
      this.onChange(item[this._label]);
      this.value = item[this._label];
      this.shown = false;
      this.locationvalueSelected.emit(item);

    }

    show() {
      this.shown = this.shown ? false : true;
      setTimeout(() => {
        this.input.nativeElement.focus();
      }, 200);
    }

    @HostListener("document:click", ["$event"]) onClick(e: any) {
      if (!this.ele.nativeElement.contains(e.target)) {
        this.shown = false;
      }
    }
  }
  