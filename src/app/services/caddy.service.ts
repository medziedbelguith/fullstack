import { Injectable } from '@angular/core';
import {ItemProduct} from '../model/item-product.model';
import { Product } from '../model/product.model';
import {AuthenticationService} from './authentication.service';
import {Caddy} from '../model/caddy.model';
import {Client} from '../model/client.model';
@Injectable({
  providedIn: 'root'
})
export class CaddyService {
  public currentCaddyName:string="Caddy1";
  public listCaddies:Array<{num:number,name:string}>=[{num:1,name:'Caddy1'}];
  public caddies:Map<string,Caddy> = new Map();
  constructor(private authService:AuthenticationService) { 
    
   if(this.authService.isauthenticated()) {
      this.loadCaddyFromLocalStorage();
    }
    else{
      let caddy=new Caddy(this.currentCaddyName)
     // console.log(caddy);
      this.caddies[this.currentCaddyName]=caddy;
  }
  }
  
 public addProductToCaddy(id:number,name:string,price:number,quantity:number):void{
    let caddy=this.caddies[this.currentCaddyName];
    let item=caddy.items[id];
   if(item===undefined) {
     item=new ItemProduct();
     item.id=id;
     item.name=name;
     item.price=price;
     item.quantity=quantity;
     caddy.items[id]=item;
   }
   else{
     item.quantity+=quantity;
   }
 }
 public addProduct(product:Product){
    this.addProductToCaddy(product.id,product.name,product.currentPrice,product.quantity)
    this.saveCaddy();
  }
  saveCaddy() {
    let caddy=this.caddies[this.currentCaddyName];
   localStorage.setItem("myCaddy_"+this.authService.userAuthenticated.username+"_"+this.currentCaddyName,JSON.stringify(caddy));
  }
  public loadCaddyFromLocalStorage(){
    let myCaddiesList=localStorage.getItem("ListCaddies_"+this.authService.userAuthenticated.username);
    this.listCaddies=myCaddiesList==undefined?[{num:1,name:'Caddy1'}]:JSON.parse(myCaddiesList);
    this.listCaddies.forEach(c=>{
      let cad=localStorage.getItem("myCaddy_"+this.authService.userAuthenticated.username+"_"+c.name);
      this.caddies[c.name]=cad==undefined?new Caddy(c.name):JSON.parse(cad);
    })
}
getCurrentCady(){
  return this.caddies.get(this.currentCaddyName);
}
getTotalCurrentCaddy() {
  let caddy=this.caddies[this.currentCaddyName];
  let total=0;
  for(let key in caddy.items ){
    total+=caddy.items[key].price*caddy.items[key].quantity;
  }
  return total;
}
addNewCaddy(c: { num: number; name: string }) {
  this.listCaddies.push(c);
  this.caddies[c.name]=new Caddy(c.name);
  localStorage.setItem("ListCaddies_"+this.authService.userAuthenticated.username,JSON.stringify(this.listCaddies));
}
public getCaddy():Caddy{
  let caddy=this.caddies[this.currentCaddyName];
  return caddy;
}
setClient(client: Client) {
  this.getCaddy().client=client;
  this.saveCaddy();
}
public removeProduct(id:number):void{
  let caddy=this.caddies.values[this.currentCaddyName];
 delete caddy.items[id];
 this.saveCaddy();
}
emptyCaddy(){
  this.caddies=new Map();
  this.listCaddies=[];
}
getSize(){
  let caddy=this.caddies[this.currentCaddyName];
  return Object.keys(caddy.items).length;
}

}
