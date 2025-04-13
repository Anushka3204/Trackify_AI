import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  selector: 'app-main',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="min-h-screen bg-white">
      <!-- Header -->
      <header class="bg-black shadow">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-white">Trackify</h1>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-6 mr-4">
              <div class="text-white">
                <span class="font-semibold">Pending:</span> 
                <span>{{getPendingCount()}}</span>
              </div>
              <div class="text-white">
                <span class="font-semibold">Completed:</span> 
                <span>{{getCompletedCount()}}</span>
              </div>
            </div>
            <button (click)="toggleCompleted()" 
              [class]="getToggleButtonClass()">
              {{ showCompleted ? 'Show Active Tasks' : 'Show Completed Tasks' }}
            </button>
          </div>
        </div>
      </header>

      <div class="container mx-auto px-4 py-8">
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
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadTasks();
    // Restore last view state if available
    const lastViewState = localStorage.getItem('lastViewState');
    if (lastViewState) {
      this.showCompleted = lastViewState === 'completed';
      localStorage.removeItem('lastViewState');
    }
  }

  get filteredTasks() {
    return this.tasks.filter(task => task.completed === this.showCompleted);
  }

  loadTasks() {
    this.http.get<Task[]>('http://localhost:5000/tasks')
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          // Store tasks in localStorage for the edit component
          localStorage.setItem('tasks', JSON.stringify(tasks));
          console.log('Loaded tasks:', tasks);
        },
        error: (error) => {
          console.error('Error loading tasks:', error);
        }
      });
  }

  addTask() {
    if (this.taskForm.valid) {
      const newTask = {
        ...this.taskForm.value,
        completed: false
      };
      this.http.post('http://localhost:5000/tasks', newTask)
        .subscribe({
          next: () => {
            this.taskForm.reset();
            this.loadTasks();
          },
          error: (error) => {
            console.error('Error adding task:', error);
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

    console.log('Toggling task status:', updatedTask);
    this.http.put(`http://localhost:5000/tasks/${task._id}`, updatedTask)
      .subscribe({
        next: (response: any) => {
          console.log('Task status updated successfully:', response);
          // Update the task in the local array
          const taskIndex = this.tasks.findIndex(t => t._id === task._id);
          if (taskIndex !== -1) {
            this.tasks[taskIndex] = { ...task, completed: !task.completed };
          }
          
          // If the task was completed and we're viewing active tasks,
          // or if the task was uncompleted and we're viewing completed tasks,
          // reload the tasks to ensure the list is up to date
          if (this.showCompleted !== updatedTask.completed) {
            this.loadTasks();
          }
        },
        error: (error) => {
          console.error('Error updating task status:', error);
          alert('Failed to update task status. Please try again.');
          // Revert the local change if the server update failed
          this.loadTasks();
        }
      });
  }

  editTask(task: Task) {
    // Store current filter state before navigating
    localStorage.setItem('lastViewState', this.showCompleted ? 'completed' : 'active');
    this.router.navigate(['/edit', task._id]);
  }

  deleteTask(taskId: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.http.delete(`http://localhost:5000/tasks/${taskId}`)
        .subscribe({
          next: () => this.loadTasks(),
          error: (error) => {
            console.error('Error deleting task:', error);
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
}
