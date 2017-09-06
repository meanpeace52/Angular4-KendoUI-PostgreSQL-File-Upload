import { Component, OnInit } from '@angular/core';
import { process, State } from '@progress/kendo-data-query';
import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { HttpService } from "../services/http.service";
import { FileRestrictions, SelectEvent, ClearEvent, RemoveEvent, UploadEvent } from '@progress/kendo-angular-upload';
import _ from 'lodash';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [HttpService]
})
export class HomeComponent implements OnInit {
  private title: String;
  private companies: any[];
  private companyName: String;
  private imagePreviews: any = [];
  private uploadRemoveUrl: string = "removeUrl";
  private uploadSaveUrl: string = "http://localhost:3000/api/company/upload";
  private viewCreateForm: Boolean;
  private viewUpdateForm: Boolean;
  private selectedCompany: Object;
  private newName: string;

  constructor(
    private httpService:HttpService
  ) {
    this.title = 'File Upload to S3';
    this.companies = [];
    this.viewCreateForm = false;
    this.viewUpdateForm = false;
    this.selectedCompany = {};
    this.newName = '';
  }

  ngOnInit() {
    if(!this.companies.length) {
      this.httpService.getCompanies().subscribe (
          res => {
            this.companies = _.toArray(res);
          },
          err => console.log(err, 'getting companies error')
      )
    }
  }

  create() {
    if(!this.companyName)
      return;

    this.httpService.createCompany({name: this.companyName}).subscribe (
          res => {
            this.companies.push(res);
            this.viewCreateForm = false;
          },
          err => console.log(err, 'creating company error')
      )
  }

  update(company) {
    if(!this.newName)
      return;

    this.httpService.updateCompany({id: company.id, newName: this.newName}).subscribe (
          res => {
             let index = _.findIndex(this.companies, {id: res.id});
             this.companies.splice(index, 1, res);
             this.selectedCompany = {
               id: company.id,
               name: this.newName
             };

             this.newName = '';
          },
          err => console.log(err, 'updating company error')
      )
  }

  remove(company) {
    if(!company)
      return;

    this.httpService.removeCompany({id: company.id}).subscribe (
          res => {
             let index = _.findIndex(this.companies, {id: company.id});
             this.companies.splice(index, 1);
             this.selectedCompany = this.companies[0];
          },
          err => console.log(err, 'removing company error')
      )
  }

  clearEventHandler(e: ClearEvent): void {
    console.log("Clearing the file upload");
    this.imagePreviews = [];
  }

  completeEventHandler() {

  }

  removeEventHandler(e: RemoveEvent): void {
    console.log(`Removing ${e.files[0].name}`);

    let index = _.findIndex(this.imagePreviews, function(item) {
      return item.uid === e.files[0].uid
    });

    if (index >= 0) {
      this.imagePreviews.splice(index, 1);
    }
  }

  selectEventHandler(e: SelectEvent): void {
    let that = this;
    e.files.forEach((file) => {
      console.log(`File selected: ${file.name}`);

      if (!file.validationErrors) {
        let reader = new FileReader();

        reader.onload = function (ev: any) {
          let image = {
            src: ev.target.result,
            uid: file.uid
          };

          that.imagePreviews.unshift(image);
        };

        reader.readAsDataURL(file.rawFile);
      }
    });
  }

  uploadEventHandler(company, e: UploadEvent) {
    e.data = {
      company_id: company.id,
      file: e.files[0]
    };
  }

  updateCompanyData(): void {
    let that = this;
    this.viewUpdateForm = false;
    setTimeout(function(){
      that.viewUpdateForm = true;
    }, 100);

    this.imagePreviews = [];
    this.newName = '';
  }
}
