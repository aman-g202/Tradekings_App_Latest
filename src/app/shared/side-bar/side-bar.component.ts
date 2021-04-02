import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

interface NavigationItem {
  title: string; icon: string; class: string; route: string;
}

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {
  timeStamp = new Date().getTime();
  pages: Array<NavigationItem>;
  @Input() partyName: string;
  @Input() userType: string;

  constructor(
    private router: Router,
    private menuCtrl: MenuController
  ) { }

  ngOnInit() {
    if (this.userType === 'ADMIN' || this.userType === 'ADMINHO') {
      this.pages = [
        { title: 'Dashboard', icon: 'dashboard-new', class: 'default', route: `/dashboard/${this.userType}?timeStamp=${this.timeStamp}` },
        { title: 'Orders', icon: 'cart', class: 'default', route: '/orders' },
        { title: 'Customers', icon: 'shopping-bag-new', class: 'default', route: `/user-list/${'customerList'}` },
        { title: 'Sales Executive', icon: 'briefcase', class: 'default', route: `/user-list/${'salesmanList'}` },
        { title: 'Products', icon: 'products', class: 'default', route: '/shop' },
        { title: 'Capture Price', icon: 'information', class: 'default', route: '/capture-price' },

      ];
    } else if (this.userType === 'SALESMAN' || this.userType === 'SALESMANAGER') {
      this.pages = [
        { title: 'Dashboard', icon: 'dashboard-new', class: 'default', route: `/dashboard/${this.userType}?timeStamp=${this.timeStamp}` },
        { title: 'Orders', icon: 'cart', class: 'default', route: '/orders' },
        { title: 'Products', icon: 'products', class: 'default', route: '/shop' },
        { title: 'Payments', icon: 'payment', class: 'default', route: '/payment-history' },
        { title: 'Capture Price', icon: 'information', class: 'default', route: '/capture-price' },
      ];
    } else {
      this.pages = [
        { title: 'Dashboard', icon: 'dashboard-new', class: 'default', route: `/dashboard/${this.userType}` },
        { title: 'Your Orders', icon: 'cart', class: 'default', route: '/orders' },
        { title: 'Payment History', icon: 'payment', class: 'default', route: '/payment-history' },
      ];
    }
  }

  onSelectNavigationItem(page: NavigationItem) {
    this.menuCtrl.toggle('menu');
    this.router.navigateByUrl(page.route);
  }

}
