import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProfileModel } from '../../../providers/models/profile.model';
import { StorageServiceProvider } from '../../../providers/services/storage/storage.service';
import { WidgetUtilService } from '../../../providers/utils/widget';
import { PaymentService } from '../../../providers/services/payment/payment.service ';
import { CONSTANTS } from '../../../providers/utils/constants';
import { ReportService } from '../../../providers/services/reports/reports.service';


@Component({
  selector: 'app-view-statement',
  templateUrl: './view-statement.page.html',
  styleUrls: ['./view-statement.page.scss'],
  providers: [PaymentService, DecimalPipe, ReportService]
})

export class ViewStatementPage implements OnInit {
  hrefTag = '';
  fileName = 'STATEMENT';
  type = 'download';
  selectedCustomer: any = [];
  totalDebAmount = 0;
  totalCredAmount = 0;
  statements: any = [];
  externalId: string;
  customerName: string;
  customerAddress: string;
  stmtAvailable = true;
  height = 0;
  width = 0;
  documentDefinition: any = {};



  constructor(
    private storageService: StorageServiceProvider,
    private widgetUtil: WidgetUtilService,
    private paymentService: PaymentService,
    private decimalPipe: DecimalPipe,
    private report: ReportService

  ) { }

  async ngOnInit() {
    const loggedInUser: ProfileModel = await this.storageService.getFromStorage('profile') as ProfileModel;
    this.hrefTag = '/dashboard/' + loggedInUser.userType;
    this.getCustomerStatement();
  }


  async getCustomerStatement() {
    const showLoader = await this.widgetUtil.showLoader('Please wait..', 2000);
    this.selectedCustomer = await this.storageService.getFromStorage('selectedCustomer');
    this.externalId = this.selectedCustomer.externalId;
    this.customerName = this.selectedCustomer.name,
      this.customerAddress = this.selectedCustomer.province;
    this.paymentService.getCustomerStatement(this.externalId).subscribe((res: any) => {
      showLoader.dismiss();
      if (res.body && res.body && res.body.length) {
        this.stmtAvailable = true;
        this.statements = res.body[0].statements;
        this.selectedCustomer = res.body[0];
        this.statements.map(statement => {
          if (statement.credit) { statement.credit = Number(statement.credit).toFixed(2); }
          if (statement.debit) { statement.debit = Number(statement.debit).toFixed(2); }
          if (statement.balance) { statement.balance = Number(statement.balance).toFixed(2); }
        });
        this.statements.sort((a, b) => {
          const c: any = new Date(a.date);
          const d: any = new Date(b.date);
          return (c - d);
        });
        this.totalDebCredAmount();
      } else {
        this.stmtAvailable = false;
        showLoader.dismiss();
      }
    }, (error: any) => {
      showLoader.dismiss();
      console.error('View Statement Page Could not load', error);
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.presentToast(CONSTANTS.INTERNET_ISSUE);
      } else {
        this.widgetUtil.presentToast(CONSTANTS.SERVER_ERROR);
      }
    });
  }


  totalDebCredAmount() {
    this.statements.forEach(statement => {
      if (statement && statement.debit) {
        statement.debit = Number(statement.debit);
        this.totalDebAmount = this.totalDebAmount + statement.debit;
      }
      if (statement && statement.credit) {
        statement.credit = Number(statement.credit);
        this.totalCredAmount = this.totalCredAmount + statement.credit;
      }
    });
  }


  prepareRowData() {
    const headingColor = '#8f1515';
    const textColorSecondary = '#202020';
    const body = [];
    body.push(
      [
        { text: 'DATE', color: headingColor, fontSize: 10, margin: [0, 6, 0, 6] },
        { text: 'REFERENCE', color: headingColor, fontSize: 10, margin: [0, 6, 0, 6] },
        { text: 'DESCRIPTION', color: headingColor, fontSize: 10, margin: [0, 6, 0, 6] },
        { text: 'DEBIT', color: headingColor, fontSize: 10, margin: [0, 6, 0, 6], alignment: 'right' },
        { text: 'CREDIT', color: headingColor, fontSize: 10, margin: [0, 6, 0, 6], alignment: 'right' },
        { text: 'BALANCE', color: headingColor, fontSize: 10, margin: [0, 6, 0, 6], alignment: 'right' }
      ]
    );

    this.statements.forEach(statement => {
      this.height += 26;
      const row = [
        {
          text: new DatePipe('en_ZM').transform(statement.date, 'dd/M/yy'),
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1
        },
        {
          text: statement.ref,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1
        },
        {
          text: statement.desc,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1
        },
        {
          text: statement.debit ? this.decimalPipe.transform(statement.debit, '.2') : '',
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1,
          alignment: 'right'
        },
        {
          text: statement.credit ? this.decimalPipe.transform(statement.credit, '.2') : '',
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1,
          alignment: 'right'
        },
        {
          text: statement.balance ? this.decimalPipe.transform(statement.balance, '.2') + '  DR' : '',
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1,
          alignment: 'right'
        }
      ];
      body.push(row);
    });
    // Total Credit Debit Row
    this.height += 20;
    body.push(
      [
        { text: '' },
        { text: '' },
        { text: '' },
        {
          text: this.decimalPipe.transform(Number(this.totalDebAmount), '.2'),
          color: 'black', fontSize: 11, margin: [0, 6, 0, 6], alignment: 'right'
        },
        {
          text: this.decimalPipe.transform(Number(this.totalCredAmount), '.2'),
          color: 'black', fontSize: 11, margin: [0, 6, 0, 6], alignment: 'right'
        },
        { text: '' }
      ]
    );

    body.push(
      [
        {
          border: [true, false, true, false], text: 'TOTAL AMOUNT DUE',
          colSpan: 6, margin: [0, 6, 0, 0], fontSize: 11, bold: true, alignment: 'right', color: '#000000'
        },
        { border: [false, false, false, false], text: '' },
        { border: [false, false, false, false], text: '' },
        { border: [false, false, false, false], text: '' },
        { border: [false, false, false, false], text: '' },
        { border: [false, false, false, false], text: '' }
      ]
    );
    body.push(
      [
        {
          text: `${this.decimalPipe.transform(Number(this.statements[this.statements.length - 1].balance), '.2')} DR`,
          border: [true, false, true, true],
          colSpan: 6,
          fontSize: 10,
          bold: true,
          color: 'blue',
          alignment: 'right',
          margin: [0, 6, 0, 6]
        },
        { border: [false, false, false, false], text: '' },
        { border: [false, false, false, false], text: '' },
        { border: [false, false, false, false], text: '' },
        { border: [false, false, false, false], text: '' },
        { border: [false, false, false, false], text: '' },
      ]
    );
    return body;
  }



  async createPdf() {
    this.height = 0;
    this.width = 0;
    const textColorPrimary = '#000000';
    this.documentDefinition = {
      header(currentPage, pageCount) {
        return [
          {
            text: `Page ${currentPage} of ${pageCount}`,
            fontSize: 12,
            color: 'grey',
            margin: 20,
            alignment: 'right'
          }
        ];
      },
      pageSize: 'A4',
      content: [
        { text: 'STATEMENT', fontSize: 18, bold: true, alignment: 'center', color: 'blue', decoration: 'underline', margin: 10 },
        { text: 'CUSTOMER\'S NAME & ADDRESS', bold: true, color: textColorPrimary },
        {
          canvas: [
            {
              type: 'rect',
              x: 0.5,
              y: this.height += 2,
              w: 203,
              h: 105,
              r: 4,
              lineColor: '#D3D3D3',
              color: '#D3D3D3'
            },
            {
              type: 'rect',
              x: 0.5,
              y: this.height,
              w: 200,
              h: 102,
              r: 4,
              lineColor: '#D3D3D3',
              color: 'white'
            }
          ]
        },
        {
          text: this.selectedCustomer.customerName,
          absolutePosition: { x: 50, y: this.height += 115 },
          fontSize: 10,
          color: textColorPrimary
        },
        {
          text: this.selectedCustomer.customerAddress,
          absolutePosition: { x: 50, y: this.height += 20 },
          fontSize: 9,
          color: textColorPrimary
        },
        {
          text: `Period ${new DatePipe('en_ZM').transform(this.statements[0].date, 'dd/M/yy')} to ${new DatePipe('en_ZM').transform(this.statements[this.statements.length - 1].date, 'dd/M/yy')}`,
          absolutePosition: { x: 50, y: this.height += 60 },
          fontSize: 9,
          alignment: 'right',
          bold: true,
          color: textColorPrimary
        },
        {
          absolutePosition: { x: 50, y: this.height += 30 },
          table: {
            headerRows: 1,
            widths: ['*', '*', 100, 70, 70, 80],
            body: this.prepareRowData()
          },
          layout: { hLineColor: 'black', vLineColor: 'black' }
        }
      ],
      pageBreakBefore(currentNode, followingNodesOnPage) {
        let flag = false;
        if (currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0) {
          flag = true;
        }
        if (currentNode.startPosition.top > 750) {
          flag = true;
        }
        return flag;
      }
    };
    this.report.downloadPdf(this.documentDefinition, this.type, this.fileName);
  }
}
