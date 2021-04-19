import { Component, OnInit } from '@angular/core';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileModel } from 'src/providers/models/profile.model';
import { NavController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  popoverOptions: any = [];
  type = '';

  constructor(
    private storageService: StorageServiceProvider,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private router: Router,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    // this.route.queryParams
    //   .subscribe(params => {
    //     this.type = params.popOverType;
    //     this.getData();
    //   });
   this.type = this.route.snapshot.queryParams.popOverType;
   this.getData();
  }

  async getData() {
    const profile = await this.storageService.getFromStorage('profile') as ProfileModel;
    if (profile.userType === 'ADMIN' &&
    profile.userLoginId !== 'R0001'|| profile.userType === 'ADMINHO' && profile.userLoginId !== 'R0001') {
      if (this.type === 'filter') {
        this.popoverOptions = [
          {
            name: 'Filter By Order Date',
            icon: 'calendar'
          },
          {
            name: 'Filter By Invoice Date',
            icon: 'calendar'
          },
          {
            name: 'Reset',
            icon: 'remove-circle'
          }
        ];
      } else {
        this.popoverOptions = [
          {
            name: 'Reports',
            icon: 'document'
          },
          {
            name: 'Add User',
            icon: 'person-add'
          },
          {
            name: 'Add Category',
            icon: 'add-circle',
          },
          {
            name: 'Add Product',
            icon: 'add-circle',
          },
          {
            name: 'Add TK Product',
            icon: 'add-circle',
          },
          {
            name: 'Add Competitive Product',
            icon: 'add-circle',
          },
          {
            name: 'Change Password',
            icon: 'key',
          },
          {
            name: 'Logout',
            icon: 'log-out',
          }
        ];
      }
    } else {
      if (this.type === 'filter') {
        this.popoverOptions = [
          {
            name: 'Filter By Order Date',
            icon: 'calendar'
          },
          {
            name: 'Filter By Invoice Date',
            icon: 'calendar'
          },
          {
            name: 'Reset',
            icon: 'remove-circle'
          }
        ];
      } else {
        if (profile.userType === 'PRICEEXECUTIVE' || profile.userType === 'CUSTOMER' || profile.userLoginId === 'R0001') {
          this.popoverOptions = [
            {
              name: 'Change Password',
              icon: 'key',
            },
            {
              name: 'Logout',
              icon: 'log-out'
            }
          ];
        } else {
          this.popoverOptions = [
            {
              name: 'Reports',
              icon: 'document'
            },
            {
              name: 'Change Password',
              icon: 'key',
            },
            {
              name: 'Logout',
              icon: 'log-out'
            }
          ];
        }
      }
    }
  }

  action(name: string) {
    switch (name) {
      case 'Logout':
        this.logout();
        break;
      case 'Reset':
        this.resetFilter();
        break;
      case 'Add Category':
        this.addCategory();
        break;
      case 'Change Password':
        this.changePassword();
        break;
      case 'Add Competitive Product':
        this.addCompProduct();
        break;
      case 'Add TK Product':
        this.addTkProduct();
        break;
      case 'Add Product':
        this.addProduct();
        break;
      case 'Add User':
        this.addUser();
        break;
    }
  }


   logout() {
    this.dismissPopover();
    this.storageService.clearStorage();
    localStorage.clear();
    this.navCtrl.navigateRoot('/auth');
  }

  filterByOrderDate() {
    this.dismissPopover('filterbyorderdate');
  }

  filterByInvoiceDate() {
    this.dismissPopover('filterbyinvoicedate');
  }

  resetFilter() {
    this.dismissPopover('resetfilter');
  }

  changePassword() {
    this.dismissPopover();
    this.router.navigateByUrl('/change-password');
  }

  addUser () {
    this.dismissPopover();
    this.router.navigateByUrl('admin/add-user');
  }
       

  addTkProduct() {
    this.dismissPopover();
    this.router.navigateByUrl('admin/add-tk-product');
  }

  addCategory() {
    this.dismissPopover();
    this.router.navigateByUrl('admin/add-category');
  }

  addCompProduct() {
    this.dismissPopover();
    this.router.navigateByUrl('admin/add-comp-product');
  }

  addProduct() {
    this.dismissPopover();
    this.router.navigateByUrl('admin/add-product');
  }

  dismissPopover(data = '') {
    this.popoverController.dismiss();
  }
}
