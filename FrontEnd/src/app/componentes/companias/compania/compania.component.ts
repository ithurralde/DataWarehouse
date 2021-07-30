import { Component, Input, OnInit } from '@angular/core';
import { CompaniaModule } from 'src/app/model/compania/compania.module';

@Component({
  selector: 'app-compania',
  templateUrl: './compania.component.html',
  styleUrls: ['./compania.component.css']
})
export class CompaniaComponent implements OnInit {
  @Input() compania: CompaniaModule;
  constructor() { }

  ngOnInit(): void {
  }

}
