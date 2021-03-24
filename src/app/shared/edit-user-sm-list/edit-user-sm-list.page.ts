import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, NavController } from '@ionic/angular';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { CONSTANTS } from '../../../providers/utils/constants';
import { UserListService } from '../../../providers/services/userList/user-list.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-user-sm-list',
  templateUrl: './edit-user-sm-list.page.html',
  styleUrls: ['./edit-user-sm-list.page.scss'],
  providers: [UserListService]
})
export class EditUserSmListPage implements OnInit {
  showLoader: any;
  salesmanList: any[];
  salesmanListAvailable = true;
  filteredSalesmanList: any[];


  constructor(
    private modalController: ModalController,
    private widgetUtil: WidgetUtilService,
    private userListService: UserListService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getAllSalemanList();
  }


  async getAllSalemanList() {
    this.showLoader = await this.widgetUtil.showLoader('Data Fetching...', 2000);
    try {
      this.userListService.getAllSalesmanList().subscribe((res: any) => {
        this.showLoader.dismiss();
        this.salesmanList = res.body;
        this.filteredSalesmanList = this.salesmanList;
        if (this.salesmanList.length > 0) {
          this.salesmanListAvailable = true;
        } else {
          this.salesmanListAvailable = false;
        }
      }, (error) => {
        if (error.statusText === 'Unknown Error') {
          this.showLoader.dismiss();
          this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
        } else {
          this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
        }
      });
    } catch (err) {
      this.showLoader.dismiss();
      console.error('error: SalemanList not could not load', err);
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async addSalesman(salesman) {
    const confirm = await this.widgetUtil.showConfirm('Add Salesman For Customer', 'Are you sure to add?', 'Disagree', 'Agree');
    if (confirm === 'Agree') {
      this.router.navigate([], { queryParams: salesman });
      this.closeModal();
    }
  }


  searchSalesman(value) {
    this.filteredSalesmanList = this.salesmanList.filter(salesman =>
      salesman.name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.filteredSalesmanList.length > 0) {
      this.salesmanListAvailable = true;
    } else {
      this.salesmanListAvailable = false;
    }
  }
}
