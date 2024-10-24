import { Routes } from '@angular/router';
import { FinancialMarketComponent } from "./pages/financial-market/financial-market.component";
import { AuthResolver } from "./core/resolvers/auth.resolver";

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'finmarket',
  },
  {
    path: 'finmarket',
    component: FinancialMarketComponent,
    resolve: [AuthResolver],
  },
];
