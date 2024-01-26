import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
    const navigate = useNavigate();
    const handleClearAnswers = () => {
        // Clear user answers from localStorage
        localStorage.removeItem('userAnswers');
        // Redirect to the first question
        navigate('/question/1');
    };

    const [userAnswers, setUserAnswers] = useState({});

    const [score, setScore] = useState(0);

    useEffect(() => {
        // Retrieve user answers and questions from localStorage
        const storedUserAnswers = JSON.parse(localStorage.getItem('userAnswers')) || {};
        setUserAnswers(storedUserAnswers);


        // Calculate the score
        let userScore = 0;
        questions.forEach((question) => {
            const userAnswer = storedUserAnswers[question.id];
            if (userAnswer && userAnswer === question.correctAnswer) {
                userScore += 1;
            }
        });
        setScore(userScore);
    }, []);
    return (
        <div>
            <div>
                <h2>Results</h2>
                <p>Your final score is: {score} out of {questions.length}</p>
                <ul>
                    {questions.map((question) => (
                        <li key={question.id}>
                            <strong>Question:</strong> {question.text}<br />
                            <strong>Your Answer:</strong> {userAnswers[question.id] ?? "No Answer"}<br />
                            <strong>Correct Answer:</strong> {question.correctAnswer}<br />
                            {userAnswers[question.id] === question.correctAnswer ? (
                                <span style={{ color: 'green' }}> (Correct)</span>
                            ) : (
                                <span style={{ color: 'red' }}> (Wrong)</span>
                            )}<br /><br />
                        </li>
                    ))}
                </ul>
            </div>
            <button onClick={handleClearAnswers} className="btn btn-danger">
                Clear Answers and Start Over
            </button>
        </div>
    );
}

export default function Result({ score }) {

    return (
        <div>
            <div className="homeContainer">

                <div className="backgroundImage py-5">
                    <div className="container">
                        <h1 className="text-light text-center display-2 py-5">Result</h1>
                    </div>
                </div>
                <hr className="horizontalLines"></hr>
                <div className='container text-light'>
                    <RenderResults />
                </div>
            </div>
        </div>
    )
}