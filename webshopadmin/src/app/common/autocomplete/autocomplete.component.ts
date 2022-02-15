import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Customer } from 'src/app/model/customer';
import { Observable, startWith, map } from 'rxjs';
import { Address } from 'src/app/model/address';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements OnInit {
  myControl = new FormControl();
  options: Customer[] = [
    {
      id: 1,
      firstName: 'Ilka',
      lastName: 'Perschke',
      email: 'iperschke0@slideshare.net',
      address: new Address(),
      active: true,
    },
    {
      id: 2,
      firstName: 'Waylon',
      lastName: 'Leavens',
      email: 'wleavens1@mapy.cz',
      address: new Address(),
      active: true,
    },
    {
      id: 3,
      firstName: 'Caryl',
      lastName: 'Berrington',
      email: 'cberrington2@wunderground.com',
      address: new Address(),
      active: true,
    },
    {
      id: 4,
      firstName: 'Heloise',
      lastName: 'Stoddart',
      email: 'hstoddart3@psu.edu',
      address: new Address(),
      active: false,
    },
    {
      id: 5,
      firstName: 'Guendolen',
      lastName: 'Theobalds',
      email: 'gtheobalds4@about.me',
      address: new Address(),
      active: false,
    },
  ];
  filteredOptions: Observable<Customer[]>;

  constructor() {}

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.options.slice()))
    );
  }

  displayFn(customer: Customer): string {
    return customer && customer.lastName ? customer.lastName : '';
  }

  private _filter(name: string): Customer[] {
    const filterValue = name.toLowerCase();

    return this.options.filter((option) =>
      option.lastName.toLowerCase().includes(filterValue)
    );
  }
}
