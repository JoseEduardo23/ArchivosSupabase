import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { supabase } from 'src/app/supabase.client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class AuthPage {
  email = '';
  password = '';
  username = '';
  error = '';
  isLogin = true;
  isLoading = false;

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {}

  async login() {
    if (!this.validateCredentials()) return;
    
    this.isLoading = true;
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password
      });

      if (error) throw error;
      
      await this.showToast('¡Bienvenido!', 'success');
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.error = this.parseAuthError(error.message);
      await this.showToast(this.error, 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async register() {
    if (!this.validateCredentials() || !this.username) {
      this.error = 'Por favor completa todos los campos';
      await this.showToast(this.error, 'danger');
      return;
    }

    this.isLoading = true;
    try {
      const { error } = await supabase.auth.signUp({
        email: this.email,
        password: this.password,
        options: {
          data: {
            username: this.username,
            email: this.email // Guardar email también en metadata por conveniencia
          }
        }
      });

      if (error) throw error;
      
      await this.showToast('Registro exitoso. Verifica tu email!', 'success');
      this.resetForm();
      this.isLogin = true; // Cambiar a modo login
    } catch (error: any) {
      this.error = this.parseAuthError(error.message);
      await this.showToast(this.error, 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  private validateCredentials(): boolean {
    if (!this.email || !this.password) {
      this.error = 'Email y contraseña son requeridos';
      return false;
    }
    return true;
  }

  private resetForm() {
    this.email = '';
    this.password = '';
    this.username = '';
    this.error = '';
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }

  private parseAuthError(error: string): string {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': 'Credenciales incorrectas',
      'Email not confirmed': 'Confirma tu email primero',
      'User already registered': 'Usuario ya registrado',
      'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres'
    };
    return errorMap[error] || error;
  }
}