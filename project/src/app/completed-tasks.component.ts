import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from './task.service';

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  user_id: string;
}

@Component({
  selector: 'app-completed-tasks',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-white p-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-black mb-8">Completed Tasks</h1>
        
        <div *ngIf="completedTasks.length === 0" class="text-center text-gray-600">
          No completed tasks found.
        </div>

        <div *ngIf="completedTasks.length > 0" class="space-y-4">
          <div *ngFor="let task of completedTasks" 
            class="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300">
            <h3 class="text-xl font-semibold text-black mb-2">{{ task.title }}</h3>
            <p class="text-gray-600 mb-4">{{ task.description }}</p>
            <div class="flex items-center text-green-600">
              <span class="mr-2">✓</span>
              <span>Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CompletedTasksComponent implements OnInit {
  completedTasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        this.completedTasks = tasks.filter((task: Task) => task.completed);
      },
      error: (err) => {
        console.error('Error fetching completed tasks:', err);
      }
    });
  }
}
