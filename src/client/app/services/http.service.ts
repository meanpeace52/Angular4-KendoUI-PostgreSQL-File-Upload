import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions  } from "@angular/http";
import { Observable } from "rxjs/Rx";

@Injectable()

export class HttpService {
  public companies: any[];
  public headers: Headers;

  constructor(
    private http:Http
  ) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
  }

  createCompany(data) {
      let body = JSON.stringify(data);
      return this.http.post('http://localhost:3000/api/company', body, {headers: this.headers})
          .map(res => res.json())
  }

  getCompanies () {
      return new Observable((observer) => {
        if(this.companies) {
          observer.next(this.companies);
          observer.complete();
        }
        else {
          this.http.get('http://localhost:3000/api/company').subscribe(
            res => {
              this.companies = res.json();
              observer.next(this.companies);
              observer.complete();
            }, err => console.log(err)
          )
        }
      })
  }

  updateCompany(data) {
      let body = JSON.stringify(data);
      return this.http.put('http://localhost:3000/api/company', body, {headers: this.headers})
          .map(res => res.json())
  }

  removeCompany(data) {
      let body = JSON.stringify(data);
      let options = new RequestOptions({
        body: body,
        headers: this.headers,
      });
      return this.http.delete('http://localhost:3000/api/company', options)
          .map(res => res.json())
  }
}
