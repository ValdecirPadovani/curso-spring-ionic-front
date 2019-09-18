import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { Injectable } from "@angular/core";
import { StorageService } from "../services/storage.service";
import { AlertController } from "ionic-angular";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
    
    constructor(public storage: StorageService, public alertCtrl: AlertController ){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       return next.handle(req)
        .catch((error, caught) =>{
            let errorObj = error;
            //Verifica se a resposta de erro tem o campo error
            if(errorObj.error){
                errorObj = errorObj.error
            }
            //validação para caso o retorno não seja JSON faça um parse
            if(!errorObj.status){
                errorObj = JSON.parse(errorObj);
            }
            console.log("Erro detectado pelo Interceptor");
            console.log(errorObj);

            switch(errorObj.status){

                case 401:
                this.handle401();    
                break;

                case 403:
                this.handle403();
                break;
                
                default:
                    this.handleDefautError(errorObj);
            }

            return Observable.throw(errorObj)
        }) as any;
    }

    handleDefautError(errorObj) {
         let alert = this.alertCtrl.create({
            title: 'Erro: '+ errorObj.status + ": "+errorObj.error,
            message: errorObj.message,
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }

    handle403(){
        this.storage.setLocalUser(null);
    }

    handle401(){
        let alert = this.alertCtrl.create({
            title: 'Erro 401: Falha na autenticação',
            message: 'Email ou senha incorretos',
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }

}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,        
};
