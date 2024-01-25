import React from 'react';
import { useParams } from 'react-router-dom';

const questions = [
    {
        id: 1,
        question: 'What is the capital of France?',
        options: ['Berlin', 'Paris', 'Madrid', 'Rome'],
        correctAnswer: 'Paris',
    },
    {
        id: 2,
        question: 'Which planet is known as the Red Planet?',
        options: ['Earth', 'Mars', 'Venus', 'Jupiter'],
        correctAnswer: 'Mars',
    },
    {
        id: 3,
        question: 'What programming language is this app built with?',
        options: ['Java', 'Python', 'JavaScript', 'C++'],
        correctAnswer: 'JavaScript',
    },
    {
        id: 4,
        question: 'What is the largest mammal?',
        options: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'],
        correctAnswer: 'Blue Whale',
    },
    {
        id: 5,
        question: 'Who painted the Mona Lisa?',
        options: ['Pablo Picasso', 'Vincent van Gogh', 'Leonardo da Vinci', 'Claude Monet'],
        correctAnswer: 'Leonardo da Vinci',
    },
    // Add more questions as needed
];

function RenderResults() {
    // const { id } = useParams();
    const userAnswers = JSON.parse(localStorage.getItem('userAnswers')) || {}; // Retrieve user answers from localStorage
    return questions.map((question, index) => {
        const isCorrect = userAnswers[index + 1] === question.correctAnswer;
        return (
          <div key={index}>
            <p>{question.question}</p>
            <ul>
                        {question.options.map((option) => (
                            <li>{option}</li>
                        ))}
                    </ul>
            <p>
              Your answer: {userAnswers[index + 1]}, Correct answer: {question.correctAnswer}
              {isCorrect ? ' (Correct)' : ' (Wrong)'}
            </p>
            <hr />
          </div>
        );
      });
}

export default function Result({score}) {

    return (
        <div>
        <h2>Quiz Results</h2>
        <p>Your final score is: {score}</p>
        <RenderResults/>
      </div>
    )
}