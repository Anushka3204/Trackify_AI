import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: Toast[] = [];
  private toastSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) {
    const toast: Toast = {
      id: Date.now(),
      message,
      type,
      duration
    };

    this.toasts.push(toast);
    this.toastSubject.next(this.toasts);

    if (duration > 0) {
      setTimeout(() => this.remove(toast.id), duration);
    }
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.toastSubject.next(this.toasts);
  }

  clear() {
    this.toasts = [];
    this.toastSubject.next(this.toasts);
  }
} 