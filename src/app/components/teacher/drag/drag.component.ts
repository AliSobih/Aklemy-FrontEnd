import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-drag',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './drag.component.html',
  styleUrls: ['./drag.component.scss'],
})
export class DragComponent implements OnInit {
  questions = [
    { id: 1, question: 'Question 1', correctAnswer: 'Answer 1' },
    { id: 2, question: 'Question 2', correctAnswer: 'Answer 2' },
    { id: 3, question: 'Question 3', correctAnswer: 'Answer 3' },
    { id: 4, question: 'Question 4', correctAnswer: 'Answer 4' },
  ];

  answers = [
    { id: 1, answer: 'Answer 1' },
    { id: 2, answer: 'Answer 2' },
    { id: 3, answer: 'Answer 3' },
    { id: 4, answer: 'Answer 4' },
  ];

  selectedQuestionId: number | null = null;
  selectedAnswers: { [key: number]: string } = {};
  questionColors: { [key: number]: string } = {};

  constructor() {}

  ngOnInit() {}

  selectQuestion(questionId: number) {
    this.selectedQuestionId = questionId;
    if (!this.questionColors[questionId]) {
      this.questionColors[questionId] = this.getQuestionColor(questionId);
    }
  }

  selectAnswer(answer: string) {
    if (this.selectedQuestionId !== null) {
      this.selectedAnswers[this.selectedQuestionId] = answer;
      this.selectedQuestionId = null; // Reset selected question after answer is selected
    }
  }

  checkAnswers() {
    let correctCount = 0;
    this.questions.forEach((q) => {
      if (this.selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    alert(`You got ${correctCount} out of ${this.questions.length} correct!`);
  }

  isAnswered(questionId: number): boolean {
    return this.selectedAnswers.hasOwnProperty(questionId);
  }

  getAnswerClass(answer: string): string {
    return Object.values(this.selectedAnswers).includes(answer)
      ? 'selected-answer'
      : '';
  }

  isAnswerUsed(answer: string): boolean {
    return Object.values(this.selectedAnswers).includes(answer);
  }

  getQuestionColor(questionId: number): string {
    const colors = ['#ff9999', '#99ccff', '#99ff99', '#ffcc99'];
    return colors[(questionId - 1) % colors.length];
  }

  getQuestionBackgroundColor(questionId: number): string {
    return this.questionColors[questionId] || '#f1f1f1'; // Default color for questions
  }

  getAnswerBackgroundColor(answer: string): string {
    const questionId = Object.keys(this.selectedAnswers).find(
      (key) => this.selectedAnswers[+key] === answer
    );
    return questionId ? this.getQuestionColor(+questionId) : '#f1f1f1'; // Default color for answers
  }
}
