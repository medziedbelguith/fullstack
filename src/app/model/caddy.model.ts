import {ItemProduct} from './item-product.model';
import {Client} from './client.model';

export class Caddy{
    
    public name:string;
  public items:Map<number,ItemProduct>=new Map();
  public client!:Client;
  constructor(name:string){
      this.name=name;
      
}
}