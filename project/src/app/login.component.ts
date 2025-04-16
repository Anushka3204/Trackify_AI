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
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
              [disabled]="showOTPInput">
          </div>

          <div *ngIf="showOTPInput">
            <label for="otp" class="block text-sm font-medium text-gray-700">Enter OTP</label>
            <input type="text" id="otp" [(ngModel)]="otp" name="otp" required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
              placeholder="Enter the 6-digit OTP sent to your email">
            <p class="mt-2 text-sm text-gray-500">OTP has been sent to your registered email address</p>
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
            {{ showOTPInput ? 'Verify OTP' : 'Send OTP' }}
          </button>
        </form>

        <div *ngIf="error" class="mt-4 text-center text-red-600">
          {{ error }}
        </div>

        <div *ngIf="success" class="mt-4 text-center text-green-600">
          {{ success }}
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  email: string = '';
  otp: string = '';
  error: string = '';
  success: string = '';
  showOTPInput: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.showOTPInput) {
      // First step: Generate OTP
      this.authService.generateOTP(this.email).subscribe({
        next: (response) => {
          this.showOTPInput = true;
          this.error = '';
          this.success = 'OTP has been sent to your email. Please check your inbox.';
        },
        error: (err) => {
          if (err.status === 404) {
            this.error = 'This email is not registered. Please sign up first.';
          } else {
            this.error = 'Failed to send OTP. Please try again.';
          }
        }
      });
    } else {
      // Second step: Verify OTP
      this.authService.verifyOTP(this.email, this.otp).subscribe({
        next: () => {
          this.router.navigate(['/main']);
        },
        error: (err) => {
          this.error = 'Invalid OTP. Please try again.';
        }
      });
    }
  }
} 