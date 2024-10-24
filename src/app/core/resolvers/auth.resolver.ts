import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: 'root' })
export class AuthResolver implements Resolve<string> {

  constructor(private authService: AuthService) {}

  resolve(): Observable<string> {
    return this.authService.authorize();
  }
}
