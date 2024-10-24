import { Component } from '@angular/core';
import { MatToolbar, MatToolbarRow } from "@angular/material/toolbar";

@Component({
  selector: 'app-header',
  standalone: true,
    imports: [
        MatToolbar,
        MatToolbarRow
    ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
