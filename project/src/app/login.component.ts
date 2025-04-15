import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-white flex items-center justify-center">
      <div class="max-w-md w-full p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-black">Welcome Back</h1>
          <p class="text-gray-600 mt-2">Sign in to continue to Trackify</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" [(ngModel)]="email" name="email" required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black">
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" [(ngModel)]="password" name="password" required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black">
          </div>

          <div class="flex items-center justify-between">
            <div class="text-sm">
              <a routerLink="/signup" class="font-medium text-black hover:text-gray-800">
                Don't have an account? Sign up
              </a>
            </div>
          </div>

          <button type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
            Sign in
          </button>
        </form>

        <div *ngIf="error" class="mt-4 text-center text-red-600">
          {{ error }}
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/main']);
      },
      error: (err) => {
        this.error = 'Invalid email or password';
      }
    });
  }
} 