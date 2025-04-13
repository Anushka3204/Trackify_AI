import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-white">
      <!-- Header -->
      <header class="bg-black py-6">
        <div class="container mx-auto px-4">
          <h1 class="text-3xl font-bold text-white text-center">Trackify</h1>
        </div>
      </header>

      <main>
        <!-- Hero Section -->
        <div class="container mx-auto px-4 py-16">
          <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-5xl font-bold text-black mb-6">Track Your Progress</h2>
            <p class="text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
              Simple, elegant, and efficient task tracking. No distractions, just pure productivity in black and white.
            </p>

            <!-- Features Grid -->
            <div class="grid md:grid-cols-3 gap-8 mb-16">
              <div class="p-6 border border-gray-200 rounded-lg">
                <div class="text-3xl mb-4">📝</div>
                <h3 class="text-xl font-semibold text-black mb-2">Create Tasks</h3>
                <p class="text-gray-600">Easily add and organize your daily tasks</p>
              </div>
              <div class="p-6 border border-gray-200 rounded-lg">
                <div class="text-3xl mb-4">✓</div>
                <h3 class="text-xl font-semibold text-black mb-2">Track Progress</h3>
                <p class="text-gray-600">Mark tasks as complete and track your productivity</p>
              </div>
              <div class="p-6 border border-gray-200 rounded-lg">
                <div class="text-3xl mb-4">🔄</div>
                <h3 class="text-xl font-semibold text-black mb-2">Stay Organized</h3>
                <p class="text-gray-600">Filter and manage completed and active tasks</p>
              </div>
            </div>

            <!-- CTA Button -->
            <button (click)="router.navigate(['/main'])" 
              class="px-8 py-4 bg-black text-white text-lg rounded-lg hover:bg-gray-800 transition-colors duration-300 shadow-lg">
              Get Started Now
            </button>
          </div>
        </div>

        <!-- Footer -->
        <footer class="bg-gray-100 py-12 mt-16">
          <div class="container mx-auto px-4 text-center">
            <p class="text-gray-600">
              Trackify - Simplify your task management
            </p>
          </div>
        </footer>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HomeComponent {
  constructor(public router: Router) {}
}