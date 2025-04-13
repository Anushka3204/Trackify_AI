import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="min-h-screen bg-white">
      <header class="bg-black shadow">
        <div class="container mx-auto px-4 py-4">
          <h1 class="text-2xl font-bold text-white">Edit Task</h1>
        </div>
      </header>

      <div class="container mx-auto px-4 py-8">
        <div class="bg-white p-6 rounded-lg shadow max-w-2xl mx-auto border border-gray-200">
          <form [formGroup]="taskForm" (ngSubmit)="updateTask()" class="space-y-4">
            <div>
              <label class="block text-gray-800 mb-2">Title</label>
              <input type="text" formControlName="title" 
                class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black">
              <div *ngIf="taskForm.get('title')?.invalid && taskForm.get('title')?.touched" class="text-red-500 mt-1">
                Title is required
              </div>
            </div>
            <div>
              <label class="block text-gray-800 mb-2">Description</label>
              <textarea formControlName="description" rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"></textarea>
              <div *ngIf="taskForm.get('description')?.invalid && taskForm.get('description')?.touched" class="text-red-500 mt-1">
                Description is required
              </div>
            </div>
            <div class="flex items-center space-x-2 py-2">
              <input type="checkbox" 
                     [checked]="taskCompleted"
                     (change)="taskCompleted = !taskCompleted"
                     class="w-4 h-4 text-black border-gray-300 rounded focus:ring-black">
              <label class="text-gray-800">Mark as completed</label>
            </div>
            <div class="flex space-x-4">
              <button type="submit" [disabled]="taskForm.invalid"
                class="flex-1 bg-black text-white py-2 rounded hover:bg-gray-800 disabled:bg-gray-400">
                Update Task
              </button>
              <button type="button" (click)="cancel()"
                class="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class EditTaskComponent implements OnInit {
  taskForm: FormGroup;
  taskId: string = '';
  taskCompleted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.taskId) {
      console.error('No task ID provided');
      this.router.navigate(['/main']);
      return;
    }
    this.loadTask();
  }

  loadTask() {
    if (!this.taskId) {
      console.error('Cannot load task: No task ID provided');
      this.router.navigate(['/main']);
      return;
    }

    console.log('Loading task with ID:', this.taskId);
    const headers = { 'Content-Type': 'application/json' };
    
    // First try to get the task from the main component's task list
    const cachedTasks = localStorage.getItem('tasks');
    if (cachedTasks) {
      const tasks = JSON.parse(cachedTasks);
      const task = tasks.find((t: Task) => t._id === this.taskId);
      if (task) {
        console.log('Found task in cache:', task);
        this.taskForm.patchValue({
          title: task.title,
          description: task.description || ''
        });
        this.taskCompleted = task.completed || false;
        return;
      }
    }

    // If not found in cache, fetch from server
    this.http.get<Task>(`http://localhost:5000/tasks/${this.taskId}`, { headers })
      .subscribe({
        next: (task) => {
          console.log('Task loaded successfully:', task);
          if (task && task.title) {
            this.taskForm.patchValue({
              title: task.title,
              description: task.description || ''
            });
            this.taskCompleted = task.completed || false;
            console.log('Form updated with task data:', this.taskForm.value);
            console.log('Task completed status:', this.taskCompleted);
          } else {
            console.error('Invalid task data received:', task);
            alert('Invalid task data received. Returning to main page.');
            this.router.navigate(['/main']);
          }
        },
        error: (error) => {
          console.error('Error loading task:', error);
          if (error.status === 405) {
            console.error('Method not allowed. Please check server configuration.');
          }
          alert('Failed to load task. Returning to main page.');
          this.router.navigate(['/main']);
        }
      });
  }

  updateTask() {
    if (this.taskForm.valid) {
      const updatedTask = {
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        completed: this.taskCompleted
      };

      console.log('Updating task:', updatedTask);
      const headers = { 'Content-Type': 'application/json' };
      this.http.put(`http://localhost:5000/tasks/${this.taskId}`, updatedTask, { headers })
        .subscribe({
          next: (response) => {
            console.log('Task updated successfully:', response);
            localStorage.setItem('lastViewState', this.taskCompleted ? 'completed' : 'active');
            this.router.navigate(['/main']);
          },
          error: (error) => {
            console.error('Error updating task:', error);
            alert('Failed to update task. Please try again.');
          }
        });
    } else {
      Object.keys(this.taskForm.controls).forEach(key => {
        const control = this.taskForm.get(key);
        control?.markAsTouched();
      });
      alert('Please fill in all required fields.');
    }
  }

  cancel() {
    this.router.navigate(['/main']);
  }
} 