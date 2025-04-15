import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { ToastComponent } from './toast.component';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  template: `
    <div class="min-h-screen bg-white relative">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz48cGF0aCBkPSJNMjAgMjBoMjB2MjBIMjB6TTAgMjBoMjB2MjBIMHoiIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjxwYXRoIGQ9Ik0yMCAyMGgxMHYxMEgyMHoiIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div class="absolute inset-0 bg-white/98"></div>
      </div>
      
      <!-- Content -->
      <div class="relative z-10 min-h-screen flex flex-col">
        <!-- Header -->
        <header class="bg-black/95 py-6">
          <div class="container mx-auto px-4 flex justify-between items-center">
            <h1 class="text-3xl font-bold text-white">Trackify</h1>
            <div class="flex items-center space-x-4">
              <div *ngIf="authService.isAuthenticated()" class="text-white">
                Welcome, {{ authService.getCurrentUser()?.name }}
              </div>
              <div *ngIf="!authService.isAuthenticated()" class="flex space-x-4">
                <button (click)="router.navigate(['/login'])"
                  class="px-6 py-2 text-white hover:bg-gray-800 rounded-lg transition-colors duration-300">
                  Login
                </button>
                <button (click)="router.navigate(['/signup'])"
                  class="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors duration-300">
                  Sign Up
                </button>
              </div>
              <button *ngIf="authService.isAuthenticated()" (click)="router.navigate(['/main'])"
                class="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors duration-300">
                Go to Tasks
              </button>
            </div>
          </div>
        </header>

        <main class="flex-grow">
          <!-- Hero Section -->
          <div class="container mx-auto px-4 py-16">
            <div class="max-w-4xl mx-auto text-center">
              <h2 class="text-5xl font-bold text-black mb-6">Track Your Progress</h2>
              <div class="w-24 h-1 bg-black mx-auto mb-6"></div>
              <p class="text-xl text-gray-800 mb-12 max-w-2xl mx-auto">
                Stay organized and boost your productivity with Trackify. A simple, elegant task management solution that helps you focus on what matters most.
              </p>

              <!-- Features Grid -->
              <div class="grid md:grid-cols-3 gap-8 mb-16">
                <div class="p-6 bg-white/95 backdrop-blur-sm border border-black rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <div class="text-3xl mb-4">📝</div>
                  <h3 class="text-xl font-semibold text-black mb-2">Create Tasks</h3>
                  <p class="text-gray-700">Easily add and organize your daily tasks</p>
                </div>
                <div class="p-6 bg-white/95 backdrop-blur-sm border border-black rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <div class="text-3xl mb-4">✓</div>
                  <h3 class="text-xl font-semibold text-black mb-2">Track Progress</h3>
                  <p class="text-gray-700">Mark tasks as complete and track your productivity</p>
                </div>
                <div class="p-6 bg-white/95 backdrop-blur-sm border border-black rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <div class="text-3xl mb-4">📊</div>
                  <h3 class="text-xl font-semibold text-black mb-2">Analytics</h3>
                  <p class="text-gray-700">Get insights into your productivity patterns</p>
                </div>
              </div>

              <!-- CTA Buttons -->
              <div class="flex justify-center space-x-4">
                <button *ngIf="!authService.isAuthenticated()" (click)="router.navigate(['/login'])"
                  class="px-8 py-4 bg-black text-white text-lg rounded-lg hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-lg">
                  Get Started
                </button>
                <button *ngIf="authService.isAuthenticated()" (click)="router.navigate(['/main'])"
                  class="px-8 py-4 bg-black text-white text-lg rounded-lg hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-lg">
                  Go to Tasks
                </button>
              </div>
            </div>
          </div>

          <!-- Additional Features Section -->
          <div class="bg-white/95 backdrop-blur-sm py-16">
            <div class="container mx-auto px-4">
              <h2 class="text-3xl font-bold text-center mb-12">Why Choose Trackify?</h2>
              <div class="grid md:grid-cols-2 gap-8">
                <div class="p-6 bg-white rounded-lg shadow-sm border border-black hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <h3 class="text-xl font-semibold mb-4">Simple Interface</h3>
                  <p class="text-gray-700">Clean and intuitive design that helps you focus on what matters most - your tasks.</p>
                </div>
                <div class="p-6 bg-white rounded-lg shadow-sm border border-black hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <h3 class="text-xl font-semibold mb-4">Cross-Platform</h3>
                  <p class="text-gray-700">Access your tasks from anywhere, on any device. Your data is always in sync.</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <!-- Footer -->
        <footer class="bg-black/95 py-12">
          <div class="container mx-auto px-4 text-center">
            <p class="text-white">
              Trackify - Simplify your task management
            </p>
          </div>
        </footer>
      </div>
      <app-toast></app-toast>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HomeComponent {
  constructor(
    public router: Router,
    public authService: AuthService,
    private toastService: ToastService
  ) {}

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastService.show(message, type);
  }
}