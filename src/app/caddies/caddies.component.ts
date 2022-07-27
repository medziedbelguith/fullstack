import { Component, OnInit } from '@angular/core';
import {CatelogueService} from '../catelogue.service';
import {CaddyService} from '../services/caddy.service';
import {AuthenticationService} from '../services/authentication.service';
import {Router} from '@angular/router';
import {Caddy} from '../model/caddy.model';
import {ItemProduct} from '../model/item-product.model';
@Component({
  selector: 'app-caddies',
  templateUrl: './caddies.component.html',
  styleUrls: ['./caddies.component.css']
})
export class CaddiesComponent implements OnInit {
  public caddy!:Caddy;
  constructor(public catService:CatelogueService, private router:Router,
    public caddyService:CaddyService, private authService:AuthenticationService) { }

ngOnInit() {
if(!this.authService.isauthenticated())
this.router.navigateByUrl('/login');
this.caddy=this.caddyService.getCaddy();
console.log(this.caddy);
}



onRemoveProductFromCaddy(p: ItemProduct) {
this.caddyService.removeProduct(p.id);
}

getTotal() {
return this.caddyService.getTotalCurrentCaddy();
}

onNewOrder() {
this.router.navigateByUrl("/client");
}

onAddCaddy() {

let size=this.caddyService.listCaddies.length;
let index:number=this.caddyService.listCaddies[size-1].num;
this.caddyService.addNewCaddy({num:index+1,name:"Caddy"+(index+1)});
}

onSelectCaddy(c: { num: number; name: string }) {
this.caddyService.currentCaddyName=c.name;
this.caddy=this.caddyService.getCaddy();
}
}
