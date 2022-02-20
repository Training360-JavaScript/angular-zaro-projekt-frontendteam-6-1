import { NavigationEnd, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

interface IBreadCrumb {
  [key: string]: any;
  name: string;
  routerLink: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  readonly part2name: {
    [key: string]: any
  } = {
    'bill': 'Bills',
    'order': 'Orders',
    'category': 'Categories',
    'product': 'Products',
    'customer': 'Customers'
  }

  constructor( private router: Router ) {

    router.events.subscribe( (val) => {

      if ( val instanceof NavigationEnd ) {

        const breadCrumb: IBreadCrumb[] = [];
        breadCrumb.push( { name: 'Dashboard', routerLink: '/' } );
        const parts: string[] = val.url.split('/');
        if ( parts[1] === 'list' ) {
          if (Object.keys(this.part2name).includes(parts[2] )) {
            breadCrumb.push( { name: this.part2name[parts[2]], routerLink: val.url } );
          }
        } else {
          if (Object.keys(this.part2name).includes(parts[1] )) {
            if (parts[2]==='0') {
              breadCrumb.push( { name: this.part2name[parts[1]], routerLink: `/list/${parts[1]}` } );
              const t = parts[1];
              breadCrumb.push( { name: 'New ' + t.charAt(0).toUpperCase() + t.substring(1,t.length).toLowerCase(), routerLink: val.url } );
            } else {
              breadCrumb.push( { name: this.part2name[parts[1]], routerLink: `/list/${parts[1]}` } );
              const t = parts[1];
              breadCrumb.push( { name: 'Modify ' + t.charAt(0).toUpperCase() + t.substring(1,t.length).toLowerCase(), routerLink: val.url } );
            }
          }
        }

        this.breadCrumb = breadCrumb;
      }
    });
  }

  breadCrumb: {name:string,routerLink:string}[] = [];

  ngOnInit(): void {
  }

}
