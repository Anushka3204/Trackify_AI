import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

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

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  private apiKey = environment.geminiApiKey;

  constructor(private http: HttpClient) {}

  private extractJsonFromResponse(text: string): string {
    // Remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    // Remove any leading/trailing whitespace
    return text.trim();
  }

  async generateTaskSuggestions(mainTask: string): Promise<string[]> {
    const prompt = `Break down the following task into 3-5 smaller, actionable subtasks. 
    Task: "${mainTask}"
    Return only the subtasks in a numbered list format, without any additional text.`;

    try {
      const response = await this.http.post<any>(`${this.apiUrl}?key=${this.apiKey}`, {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }).toPromise();

      const suggestions = response.candidates[0].content.parts[0].text
        .split('\n')
        .filter((line: string) => line.trim().length > 0)
        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim());

      return suggestions;
    } catch (error) {
      console.error('Error generating task suggestions:', error);
      throw error;
    }
  }

  async analyzeTask(task: string): Promise<TaskAnalysis> {
    const prompt = `Analyze the following task and provide a JSON response with these exact keys:
    - priority (High/Medium/Low)
    - estimatedTime (e.g., "2 hours", "30 minutes")
    - dependencies (array of strings)
    - suggestions (array of strings)
    
    Task: "${task}"
    
    Return only the JSON object, no additional text.`;

    try {
      const response = await this.http.post<any>(`${this.apiUrl}?key=${this.apiKey}`, {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }).toPromise();

      const jsonText = this.extractJsonFromResponse(response.candidates[0].content.parts[0].text);
      const analysis = JSON.parse(jsonText);
      return analysis;
    } catch (error) {
      console.error('Error analyzing task:', error);
      throw error;
    }
  }

  async getProductivityInsights(tasks: string[]): Promise<ProductivityInsights> {
    const prompt = `Analyze the following list of tasks and provide a JSON response with these exact keys:
    - patterns (array of strings describing common patterns)
    - recommendations (array of strings with productivity recommendations)
    - focusAreas (array of strings identifying areas needing focus)
    
    Tasks: ${JSON.stringify(tasks)}
    
    Return only the JSON object, no additional text.`;

    try {
      const response = await this.http.post<any>(`${this.apiUrl}?key=${this.apiKey}`, {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }).toPromise();

      const jsonText = this.extractJsonFromResponse(response.candidates[0].content.parts[0].text);
      const insights = JSON.parse(jsonText);
      return insights;
    } catch (error) {
      console.error('Error getting productivity insights:', error);
      throw error;
    }
  }
} 