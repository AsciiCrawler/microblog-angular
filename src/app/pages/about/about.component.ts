import { Component } from '@angular/core';
import { CenterContainerComponent } from '../../components/center-container/center-container.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-about',
  imports: [CenterContainerComponent, HeaderComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

}
