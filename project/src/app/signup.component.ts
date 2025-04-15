import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-white flex items-center justify-center">
      <div class="max-w-md w-full p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-black">Create Account</h1>
          <p class="text-gray-600 mt-2">Join Trackify to start managing your tasks</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" id="name" [(ngModel)]="name" name="name" required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black">
          </div>

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
              <a routerLink="/login" class="font-medium text-black hover:text-gray-800">
                Already have an account? Sign in
              </a>
            </div>
          </div>

          <button type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
            Create Account
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
export class SignupComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.signup(this.name, this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = 'Error creating account. Please try again.';
      }
    });
  }
} 