import { Component, OnInit } from '@angular/core';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  popoverOptions: any = []
  type: string = '';

  constructor( 
    private storageService: StorageServiceProvider, 
    private widgetUtil: WidgetUtilService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      this.type = params.popOverType
      this.getData()
    });
    
  }

  async getData () {
    let profile = await this.storageService.getFromStorage('profile')
    if (profile['userType'] === 'ADMIN' || profile['userType'] === 'ADMINHO') {
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
        ]
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
      ]
      }
    } else{
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
        ]
      } else {
        if (profile['userType'] === 'PRICEEXECUTIVE' || profile['userType'] === 'CUSTOMER') {
          this.popoverOptions = [
            {
              name: 'Change Password',
              icon: 'key',
            },
            {
              name: 'Logout',
              icon: 'log-out'
            }
          ]
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
          ]
        }
      }
    }
  }

  action (name)  {
    switch(name) {
      case 'Logout':
        this.logout()
        break
      case 'Reset':
        this.resetFilter()
        break
    }
  }


  async logout () {
    this.storageService.clearStorage()
    localStorage.clear()
    this.router.navigate(['/auth']); 
    this.widgetUtil.dismissPopover()
  }


  filterByOrderDate () {
    this.widgetUtil.dismissPopover('filterbyorderdate');
  }

  filterByInvoiceDate () {
    this.widgetUtil.dismissPopover('filterbyinvoicedate');
  }

  resetFilter () {
    this.widgetUtil.dismissPopover('resetfilter');
  }

  dismissPopover () {
    this.widgetUtil.dismissPopover()
  }

}
