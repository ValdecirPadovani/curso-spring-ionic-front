import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  client : ClienteDTO;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public storage: StorageService,
              public clienteService : ClienteService) {
  }

  ionViewDidLoad() {
    let localUser = this.storage.getLocalUser();
    if(localUser && localUser.email){
       this.clienteService.findByEmail(localUser.email)
       .subscribe(response =>{
         this.client = response;
         this.getImageIfExists();
       },
       error => {})
    }
  }

  getImageIfExists(){
    this.clienteService.getImageFromBuket(this.client.id)
    .subscribe(response =>
      {
        this.client.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.client.id}.jpg`;
        console.log("DENTRO DO CLIENTE> "+this.client.imageUrl);
      },
      error => {})
  }

}
