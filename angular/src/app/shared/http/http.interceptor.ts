import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable()
export class CommonHttpInterceptor implements HttpInterceptor {
    constructor(private message: NzMessageService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const url = req.url;

        req = req.clone({ url });
        return next.handle(req).pipe(
            tap(
                event => {
                    if (event instanceof HttpResponse) {
                        if (event.status >= 500) {
                        }
                    }
                },
                error => {
                    this.message.error(error.url + ' ' + error.statusText);
                })
        );
    }
}