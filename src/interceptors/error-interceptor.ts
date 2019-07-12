import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { Injectable } from "@angular/core";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
    
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

            return Observable.throw(errorObj)
        }) as any;
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,        
};
