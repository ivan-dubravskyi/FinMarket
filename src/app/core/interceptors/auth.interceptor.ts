import {  inject } from '@angular/core';
import {
  HttpRequest,
  HttpEvent,
  HttpHandlerFn
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from "../services/token.service";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {

  const tokenService = inject(TokenService);
  const token = tokenService.getToken();

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
}


