import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  templateUrl: './login.page.html',
})
export default class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly esNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  /** Correo recordado entre sesiones (solo el correo — nunca la clave). */
  private static readonly CLAVE_CORREO = 'beanflow.recordar-correo';

  /** A quién se le pide restablecer la clave; sin flujo de reset propio (backlog). */
  protected readonly correoSoporte = 'nikolasmp92@gmail.com';

  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly verClave = signal(false);

  protected readonly formulario = inject(FormBuilder).nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    clave: ['', Validators.required],
    recordar: [false],
  });

  constructor() {
    if (!this.esNavegador) return;
    const correo = localStorage.getItem(LoginPage.CLAVE_CORREO);
    if (correo) {
      this.formulario.patchValue({ correo, recordar: true });
    }
  }

  protected entrar(): void {
    if (this.formulario.invalid || this.cargando()) return;
    this.cargando.set(true);
    this.error.set(null);

    const { correo, clave, recordar } = this.formulario.getRawValue();
    this.auth.ingresar(correo, clave).subscribe((resultado) => {
      this.cargando.set(false);
      if (resultado === 'ok') {
        if (this.esNavegador) {
          if (recordar) {
            localStorage.setItem(LoginPage.CLAVE_CORREO, correo);
          } else {
            localStorage.removeItem(LoginPage.CLAVE_CORREO);
          }
        }
        this.router.navigate(['/']);
        return;
      }
      this.error.set(
        resultado === 'credenciales'
          ? 'Correo o clave incorrectos.'
          : 'No se pudo conectar con el servidor. Intenta de nuevo.',
      );
    });
  }
}
