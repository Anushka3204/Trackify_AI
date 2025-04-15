import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-4 right-4 z-50 space-y-2">
      <div *ngFor="let toast of toasts" 
           [class]="getToastClasses(toast.type)"
           class="p-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
        <div class="flex items-center">
          <span class="mr-2">{{ getIcon(toast.type) }}</span>
          <span>{{ toast.message }}</span>
          <button (click)="removeToast(toast.id)" class="ml-4 text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ToastComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toasts$.subscribe((toasts: Toast[]) => {
      this.toasts = toasts;
    });
  }

  getToastClasses(type: string): string {
    const baseClasses = 'border';
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-50 text-green-800 border-green-200`;
      case 'error':
        return `${baseClasses} bg-red-50 text-red-800 border-red-200`;
      default:
        return `${baseClasses} bg-blue-50 text-blue-800 border-blue-200`;
    }
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      default:
        return 'ℹ';
    }
  }

  removeToast(id: number) {
    this.toastService.remove(id);
  }
} 