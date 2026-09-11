import { Component } from '@angular/core';
import { Navbar } from '../../layouts/navbar/navbar';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [Navbar],
  templateUrl: './landing.html',
})
export class Landing {}
