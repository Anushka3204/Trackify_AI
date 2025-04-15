import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from './task.service';
import { AuthService } from './auth.service';
import { AiSuggestionsComponent } from './ai-suggestions.component';

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  user_id: string;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AiSuggestionsComponent],
  template: `
    <div class="min-h-screen bg-white">
      <!-- Header -->
      <header class="bg-black shadow">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-white">Trackify</h1>
          <div class="flex items-center space-x-4">
            <button (click)="router.navigate(['/ai-assistant'])"
              class="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors duration-300">
              AI Assistant
            </button>
            <button (click)="toggleCompleted()" 
              [class]="getToggleButtonClass()">
              {{ showCompleted ? 'Show Active Tasks' : 'Show Completed Tasks' }}
            </button>
            <button (click)="logout()"
              class="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors duration-300">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div class="container mx-auto px-4 py-8">
        <!-- Welcome Message -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-black">Welcome, {{ authService.getCurrentUser()?.name }}</h2>
        </div>

        <!-- Task Stats -->
        <div class="grid grid-cols-2 gap-4 mb-8">
          <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h3 class="text-xl font-semibold text-black mb-2">Active Tasks</h3>
            <div class="text-3xl font-bold text-black">{{getPendingCount()}}</div>
            <p class="text-gray-600 mt-1">Tasks pending completion</p>
          </div>
          <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h3 class="text-xl font-semibold text-black mb-2">Completed Tasks</h3>
            <div class="text-3xl font-bold text-green-600">{{getCompletedCount()}}</div>
            <p class="text-gray-600 mt-1">Tasks successfully completed</p>
          </div>
        </div>

        <!-- Add Task Form -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200">
          <h2 class="text-xl font-semibold mb-4 text-black">Add New Task</h2>
          <form [formGroup]="taskForm" (ngSubmit)="addTask()" class="space-y-4">
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
            <button type="submit" [disabled]="taskForm.invalid"
              class="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">
              Add Task
            </button>
          </form>
        </div>

        <!-- Tasks List -->
        <div class="grid gap-6">
          <div *ngFor="let task of filteredTasks" 
            class="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
            [ngClass]="{'bg-green-50 border-green-200': task.completed}">
            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-lg font-semibold text-black">{{ task.title }}</h3>
                  <span *ngIf="task.completed" class="text-green-600 text-xl">✓</span>
                </div>
                <p class="text-gray-700 mt-2">{{ task.description }}</p>
              </div>
              <div class="flex space-x-2">
                <button (click)="toggleTaskStatus(task)"
                  class="px-4 py-2 text-white rounded-lg transition-colors duration-200"
                  [ngClass]="task.completed ? 
                    'bg-gray-600 hover:bg-gray-700' : 
                    'bg-green-500 hover:bg-green-600'">
                  {{ task.completed ? 'Mark Incomplete' : 'Mark Complete' }}
                </button>
                <button (click)="editTask(task)"
                  class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200">
                  Edit
                </button>
                <button (click)="deleteTask(task._id)"
                  class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No Tasks Message -->
        <div *ngIf="filteredTasks.length === 0" class="text-center py-8">
          <p class="text-gray-600 text-lg">
            {{ showCompleted ? 'No completed tasks yet' : 'No active tasks. Add one above!' }}
          </p>
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
export class MainComponent implements OnInit {
  tasks: Task[] = [];
  showCompleted = false;
  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public router: Router,
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
    this.loadTasks();
  }

  get filteredTasks() {
    return this.tasks.filter(task => task.completed === this.showCompleted);
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        this.tasks = tasks;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  addTask() {
    if (this.taskForm.valid) {
      const newTask = {
        ...this.taskForm.value,
        completed: false
      };
      this.taskService.createTask(newTask).subscribe({
        next: (task) => {
          this.taskForm.reset();
          this.tasks.push(task);
        },
        error: (error) => {
          console.error('Error adding task:', error);
          if (error.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  toggleTaskStatus(task: Task) {
    const updatedTask = {
      title: task.title,
      description: task.description,
      completed: !task.completed
    };

    this.taskService.updateTask(task._id, updatedTask).subscribe({
      next: (response: any) => {
        const taskIndex = this.tasks.findIndex(t => t._id === task._id);
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = { ...task, completed: !task.completed };
        }
      },
      error: (error) => {
        console.error('Error updating task status:', error);
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  editTask(task: Task) {
    this.router.navigate(['/edit-task', task._id]);
  }

  deleteTask(taskId: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(task => task._id !== taskId);
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          if (error.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  getPendingCount(): number {
    return this.tasks.filter(t => !t.completed).length;
  }

  getCompletedCount(): number {
    return this.tasks.filter(t => t.completed).length;
  }

  toggleCompleted(): void {
    this.showCompleted = !this.showCompleted;
  }

  getToggleButtonClass(): string {
    return this.showCompleted
      ? 'px-4 py-2 rounded-lg transition duration-200 bg-green-500 text-white hover:bg-green-600'
      : 'px-4 py-2 rounded-lg transition duration-200 bg-white text-black hover:bg-gray-200';
  }

  logout() {
    this.authService.logout();
  }
}
