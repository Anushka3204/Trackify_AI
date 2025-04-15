import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from './task.service';
import { AuthService } from './auth.service';

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  user_id: string;
}

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="min-h-screen bg-white">
      <!-- Header -->
      <header class="bg-black shadow">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-white">Trackify</h1>
          <div class="flex items-center space-x-4">
            <div class="text-white">
              Welcome, {{ authService.getCurrentUser()?.name }}
            </div>
            <button (click)="goBack()"
              class="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors duration-300">
              Back to Tasks
            </button>
          </div>
        </div>
      </header>

      <div class="container mx-auto px-4 py-8">
        <div class="max-w-2xl mx-auto">
          <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 class="text-xl font-semibold mb-4 text-black">Edit Task</h2>
            <form [formGroup]="taskForm" (ngSubmit)="updateTask()" class="space-y-4">
              <div>
                <label class="block text-gray-800 mb-2">Title</label>
                <input type="text" formControlName="title" 
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black">
              </div>
              <div>
                <label class="block text-gray-800 mb-2">Description</label>
                <textarea formControlName="description" rows="3"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"></textarea>
              </div>
              <div class="flex items-center space-x-4">
                <button type="submit" [disabled]="taskForm.invalid"
                  class="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
                  Update Task
                </button>
                <button type="button" (click)="goBack()"
                  class="px-6 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
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
export class EditTaskComponent implements OnInit {
  taskForm: FormGroup;
  taskId: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    public authService: AuthService
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.taskId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.taskId) {
      this.router.navigate(['/']);
      return;
    }

    this.loadTask();
  }

  loadTask() {
    this.taskService.getTask(this.taskId).subscribe({
      next: (task: Task) => {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description
        });
      },
      error: (error) => {
        console.error('Error loading task:', error);
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  updateTask() {
    if (this.taskForm.valid) {
      this.taskService.updateTask(this.taskId, this.taskForm.value).subscribe({
        next: () => {
          this.router.navigate(['/main']);
        },
        error: (error) => {
          console.error('Error updating task:', error);
          if (error.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/main']);
  }
} 