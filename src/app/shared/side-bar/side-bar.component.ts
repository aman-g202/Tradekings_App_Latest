import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface NavigationItem {
  title: string; icon: string; class: string; route: string;
}

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {

  pages: Array<NavigationItem>;
  @Input() partyName: string;
  @Input() userType: string;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    if (this.userType === 'CUSTOMER') {
      this.pages = [
        {title: 'Dashboard', icon: 'dashboard-new', class: 'default', route: `/dashboard/${this.userType}`},
        {title: 'Your Orders', icon: 'cart', class: 'default', route: '/orders'},
        {title: 'Payment History', icon: 'payment', class: 'default', route: '/payment-history'},
      ];
    } else if (this.userType === 'SALESMAN' || this.userType === 'SALESMANAGER') {
      this.pages = [
        {title: 'Dashboard', icon: 'dashboard-new', class: 'default', route: `/dashboard/${this.userType}`},
        {title: 'Orders', icon: 'cart', class: 'default', route: '/orders'},
        {title: 'Products', icon: 'products', class: 'default', route: '/shop'},
        {title: 'Payments', icon: 'payment', class: 'default', route: '/payment-history'},
        {title: 'Capture Price', icon: 'information', class: 'default', route: '/capture-price'},
      ];
    }
  }

  onSelectNavigationItem(page: NavigationItem) {
    this.router.navigateByUrl(page.route);
  }

}
