import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PreferencesService } from './core/preferences.service';
import { ToastsComponent } from './core/toasts.component';

@Component({
  imports: [RouterOutlet, ToastsComponent],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  /** Inyección temprana: aplica tema/accesibilidad y el listener de `sistema`. */
  constructor() {
    inject(PreferencesService);
  }
}
