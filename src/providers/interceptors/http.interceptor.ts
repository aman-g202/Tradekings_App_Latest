import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(
        private router: Router
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (localStorage.getItem('token') != null) {
            req = req.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
        }
        return next.handle(req).pipe(tap((event: HttpEvent<any>) => {}, err => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 400) {
                  localStorage.removeItem('token');
                  this.router.navigateByUrl('/auth');
                }
              }
        }));
    }
}
