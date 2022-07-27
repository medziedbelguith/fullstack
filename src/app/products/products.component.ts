import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CatelogueService } from 'src/app/catelogue.service';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';
import { Product } from '../model/product.model';
import {CaddyService} from '../services/caddy.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products:any;
  editPhoto!:boolean;
  currentProduct:any;
  selectedFiles:any;
  progress!: number;
  currentFileUpload: any;
  title!:string;
  currentRequest!:string;
  currentTime: number=0;
  constructor(public catService:CatelogueService,private route:ActivatedRoute,private router:Router,public authService:AuthenticationService, private caddyService:CaddyService) { 
    
  }

  ngOnInit(): void {
    this.router.events.subscribe((val:any)=>{
      if(val instanceof NavigationEnd)
      {
      let url=val.url;
      console.log(url);
      let p1=this.route.snapshot.params.p1;
      if(p1==1){
        this.title="selection";
        this.getProducts('/products/search/selectedProducts');
      }
      else if(p1==2){
        let idCat=this.route.snapshot.params.p2;
        this.title="produit de la categorie"+idCat;
        this.getProducts('/categories/'+idCat+'/products')
      }
      else if(p1==3){
        this.title="produit en promotion";
        let idCat=this.route.snapshot.params.p2;
        this.getProducts('/products/search/promoProducts')
      }
      else if(p1==4){
        this.title="produit Disponibles";
        let idCat=this.route.snapshot.params.p2;
        this.getProducts('/products/search/dispoProducts')
      }
      else if(p1==5){
        this.title="Recherche";
        let idCat=this.route.snapshot.params.p2;
        this.getProducts('/products/search/dispoProducts')
      }
     }
    })
    let p1=this.route.snapshot.params.p1;
    if(p1==1){
      this.getProducts('/products/search/selectedProducts');
    }
}
private getProducts(url:any){
  this.catService.getResource(url)
  .subscribe(data=>{
    console.log(data);
    this.products=data;
  },err=>{
    console.log(err);
  })
}
onEditPhoto(p:any){
  this.currentProduct=p;
  this.editPhoto=true;
}
onSelectedFile(event:any){
  this.selectedFiles=event.target.files;
}
uploadPhoto() {
  this.progress = 0;
  this.currentFileUpload = this.selectedFiles.item(0)
  this.catService.uploadPhotoProduct(this.currentFileUpload, this.currentProduct.id).subscribe((event:any) => {
    if (event.type === HttpEventType.UploadProgress) {
      this.progress = Math.round(100 * event.loaded / event.total);
      console.log(this.progress)
    } else if (event instanceof HttpResponse) {
      //console.log(this.router.url);
      //this.getProducts(this.currentRequest);
      //this.refreshUpdatedProduct();
      this.currentTime=Date.now();
      this.getProducts('/products/search/selectedProducts');
    }
  },(err:any)=>{
    alert("Problème de chargement");
  })



  this.selectedFiles = undefined
}
getTS(){
  return this.currentTime;
}
onProductDetails(p:Product) {
  let url=btoa(p._links.product.href);
  this.router.navigateByUrl("product-detail/"+url);
}

onAddProductToCaddy(p:Product) {
  if(!this.authService.isauthenticated()){
    this.router.navigateByUrl("/login");
  }
  else{
    this.caddyService.addProduct(p);
  }
}
}
