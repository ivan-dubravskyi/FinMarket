import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import {catchError, tap} from "rxjs";
import { TokenService } from "./token.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private apiService: ApiService,
              private tokenService: TokenService,
              private snackbar: MatSnackBar) {}

  authorize() {
    return this.apiService.getToken()
      .pipe(
        tap(token => this.tokenService.setToken(token)),
        catchError((err: HttpErrorResponse) => {
          this.snackbar.open(err.message, '', {duration: 1500});
          throw err;
        })
      );
  }
}
