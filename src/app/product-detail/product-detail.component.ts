import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CatelogueService } from '../catelogue.service';
import { Product } from '../model/product.model';
import {AuthenticationService} from '../services/authentication.service';
import {HttpEventType, HttpResponse} from '../../../node_modules/@angular/common/http';
import {CaddyService} from '../services/caddy.service';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  currentProduct:any;
  selectedFiles:any;
  progress!: number;
  currentFileUpload: any;
  currentTime!: number;
  editPhoto!: boolean;
   mode: number=0;

  constructor(private router:Router, private route:ActivatedRoute,
              public catalService:CatelogueService,
              public authService:AuthenticationService,
              public caddyService:CaddyService) { }

  ngOnInit() {
    let url=atob(this.route.snapshot.params.url);
    this.catalService.getProduct(url)
      .subscribe((data:any)=>{
        this.currentProduct=data;
      },(err:any)=>{
        console.log(err);
      })
  }

  onEditPhoto(p:any) {
    this.currentProduct=p;
    this.editPhoto=true;
  }

  onSelectedFile(event:any) {
    this.selectedFiles=event.target.files;
  }

  uploadPhoto() {
    this.progress = 0;
    this.currentFileUpload = this.selectedFiles.item(0)
    this.catalService.uploadPhotoProduct(this.currentFileUpload, this.currentProduct.id).subscribe((event:any) => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        //console.log(this.router.url);
        //this.getProducts(this.currentRequest);
        //this.refreshUpdatedProduct();
        this.currentTime=Date.now();
        this.editPhoto=false;
      }
    },err=>{
      alert("Problème de chargement");
    })



    this.selectedFiles = undefined
  }

  onAddProductToCaddy(p:Product) {
    if(!this.authService.isauthenticated()){
      this.router.navigateByUrl("/login");
    }
    else{
      this.caddyService.addProduct(p);
    }
  }

  getTS() {
    return this.currentTime;
  }

  onProductDetails(p:any) {
    this.router.navigateByUrl("/product/"+p.id);
  }

  onEditProduct() {
    this.mode=1;
  }

  onUpdateProduct(data:any) {
    let url=this.currentProduct._links.self.href;
    this.catalService.patchResource(url,data)
      .subscribe((d:any)=>{
        this.currentProduct=d;
        this.mode=0;
      },(err:any)=>{
        console.log(err);
      })
  }

}
