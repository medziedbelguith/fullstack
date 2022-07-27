import { HttpClient,HttpRequest, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { Product } from './model/product.model';
@Injectable({
  providedIn: 'root'
})
export class CatelogueService {
  public host:string="http://localhost:8080"
  constructor(private http:HttpClient) { }
  getResource(url:any){
    return this.http.get(this.host+url);
  }
  getProduct(url:any):Observable<Product>{
    return this.http.get<Product>(url);
  }
  uploadPhotoProduct(file: File, idProduct:any): Observable<HttpEvent<{}>> {
    let formdata: FormData = new FormData();
    formdata.append('file', file);
    const req = new HttpRequest('POST', this.host+'/uploadPhoto/'+idProduct, formdata, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }
  public patchResource(url:any,data:any){
    return this.http.patch(url,data);
  }

}
