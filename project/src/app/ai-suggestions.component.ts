import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from './gemini.service';
import { ToastService } from './toast.service';
import { TaskService } from './task.service';

interface TaskAnalysis {
  priority: string;
  estimatedTime: string;
  dependencies: string[];
  suggestions: string[];
}

interface ProductivityInsights {
  patterns: string[];
  recommendations: string[];
  focusAreas: string[];
}

@Component({
  selector: 'app-ai-suggestions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 bg-white rounded-lg border border-black hover:shadow-lg transition-all duration-300">
      <h3 class="text-xl font-semibold mb-4">AI Task Assistant</h3>
      
      <!-- Task Analysis -->
      <div class="mb-6">
        <h4 class="font-semibold mb-2">Analyze Task</h4>
        <div class="mb-4">
          <input 
            [(ngModel)]="taskToAnalyze" 
            placeholder="Enter a task to analyze..."
            class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          />
        </div>
        <button 
          (click)="analyzeTask()" 
          [disabled]="!taskToAnalyze || isAnalyzing"
          class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50"
        >
          {{ isAnalyzing ? 'Analyzing...' : 'Analyze Task' }}
        </button>

        <div *ngIf="taskAnalysis" class="mt-4 p-4 bg-gray-50 rounded-lg">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="font-semibold">Priority:</p>
              <p class="text-gray-700">{{ taskAnalysis.priority }}</p>
            </div>
            <div>
              <p class="font-semibold">Estimated Time:</p>
              <p class="text-gray-700">{{ taskAnalysis.estimatedTime }}</p>
            </div>
          </div>
          <div class="mt-4">
            <p class="font-semibold">Dependencies:</p>
            <ul class="list-disc list-inside text-gray-700">
              <li *ngFor="let dep of taskAnalysis.dependencies">{{ dep }}</li>
            </ul>
          </div>
          <div class="mt-4">
            <p class="font-semibold">Suggestions:</p>
            <ul class="list-disc list-inside text-gray-700">
              <li *ngFor="let suggestion of taskAnalysis.suggestions">{{ suggestion }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Productivity Insights -->
      <div class="mb-6">
        <h4 class="font-semibold mb-2">Productivity Insights</h4>
        <button 
          (click)="getInsights()" 
          [disabled]="isGettingInsights"
          class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50"
        >
          {{ isGettingInsights ? 'Analyzing...' : 'Get Insights' }}
        </button>

        <div *ngIf="productivityInsights" class="mt-4 p-4 bg-gray-50 rounded-lg">
          <div class="mb-4">
            <p class="font-semibold">Patterns:</p>
            <ul class="list-disc list-inside text-gray-700">
              <li *ngFor="let pattern of productivityInsights.patterns">{{ pattern }}</li>
            </ul>
          </div>
          <div class="mb-4">
            <p class="font-semibold">Recommendations:</p>
            <ul class="list-disc list-inside text-gray-700">
              <li *ngFor="let rec of productivityInsights.recommendations">{{ rec }}</li>
            </ul>
          </div>
          <div>
            <p class="font-semibold">Focus Areas:</p>
            <ul class="list-disc list-inside text-gray-700">
              <li *ngFor="let area of productivityInsights.focusAreas">{{ area }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Task Breakdown -->
      <div>
        <h4 class="font-semibold mb-2">Task Breakdown</h4>
        <div class="mb-4">
          <input 
            [(ngModel)]="mainTask" 
            placeholder="Enter your main task..."
            class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          />
        </div>
        <button 
          (click)="generateSuggestions()" 
          [disabled]="!mainTask || isLoading"
          class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50"
        >
          {{ isLoading ? 'Generating...' : 'Break Down Task' }}
        </button>

        <div *ngIf="suggestions.length > 0" class="mt-6">
          <h4 class="font-semibold mb-2">Suggested Subtasks:</h4>
          <ul class="list-disc list-inside space-y-2">
            <li *ngFor="let suggestion of suggestions" class="text-gray-700">
              {{ suggestion }}
            </li>
          </ul>
          <button 
            (click)="addAllToTasks()"
            [disabled]="isAddingTasks"
            class="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50"
          >
            {{ isAddingTasks ? 'Adding Tasks...' : 'Add All to Tasks' }}
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
export class AiSuggestionsComponent {
  mainTask = '';
  taskToAnalyze = '';
  suggestions: string[] = [];
  taskAnalysis: TaskAnalysis | null = null;
  productivityInsights: ProductivityInsights | null = null;
  isLoading = false;
  isAnalyzing = false;
  isGettingInsights = false;
  isAddingTasks = false;

  constructor(
    private geminiService: GeminiService,
    private toastService: ToastService,
    private taskService: TaskService
  ) {}

  async generateSuggestions() {
    if (!this.mainTask.trim()) return;

    this.isLoading = true;
    try {
      this.suggestions = await this.geminiService.generateTaskSuggestions(this.mainTask);
      this.toastService.show('Task breakdown generated successfully!', 'success');
    } catch (error) {
      this.toastService.show('Error generating suggestions. Please try again.', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  async analyzeTask() {
    if (!this.taskToAnalyze.trim()) return;

    this.isAnalyzing = true;
    try {
      this.taskAnalysis = await this.geminiService.analyzeTask(this.taskToAnalyze);
      this.toastService.show('Task analysis completed!', 'success');
    } catch (error) {
      this.toastService.show('Error analyzing task. Please try again.', 'error');
    } finally {
      this.isAnalyzing = false;
    }
  }

  async getInsights() {
    this.isGettingInsights = true;
    try {
      const tasks = await this.taskService.getTasks().toPromise();
      if (tasks) {
        const taskTitles = tasks.map(task => task.title);
        this.productivityInsights = await this.geminiService.getProductivityInsights(taskTitles);
        this.toastService.show('Productivity insights generated!', 'success');
      }
    } catch (error) {
      this.toastService.show('Error getting insights. Please try again.', 'error');
    } finally {
      this.isGettingInsights = false;
    }
  }

  async addAllToTasks() {
    if (this.suggestions.length === 0) return;

    this.isAddingTasks = true;
    try {
      for (const suggestion of this.suggestions) {
        await this.taskService.createTask({
          title: suggestion,
          description: `Part of: ${this.mainTask}`,
          completed: false
        }).toPromise();
      }
      
      this.toastService.show('Tasks added successfully!', 'success');
      this.suggestions = [];
      this.mainTask = '';
    } catch (error) {
      this.toastService.show('Error adding tasks. Please try again.', 'error');
    } finally {
      this.isAddingTasks = false;
    }
  }
} 