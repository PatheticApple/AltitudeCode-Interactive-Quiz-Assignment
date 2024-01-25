import React, { useState, useEffect } from 'react';
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

export default function Question({ updateScore }) {
    
    const { id } = useParams(); // Get parameter from URL
    const navigate = useNavigate(); // Navigate questions (used to be useHistory)
    const [currentQuestion, setCurrentQuestion] = useState(null); // UseState for current question
    const [selectedOption, setSelectedOption] = useState(''); // UseState for Selected Option
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null); // UseState for if the SelectedOption is correct (Boolean)
    const [timer, setTimer] = useState(10); // Timer in seconds (optional challenge)
    const [progress, setProgress] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [NoOfQuestionSubmitted, setNoOfQuestionSubmitted] = useState(0);
    
    useEffect(() => {
        const questionId = parseInt(id, 10);  // Constant variable to get id from question
        const foundQuestion = questions.find((q) => q.id === questionId); // Find the question with the corresponding id
        console.log('Found Question:', foundQuestion);
        if (foundQuestion) { // If question found:
            setCurrentQuestion(foundQuestion); // set the useState variable to that 
            // Start timer when question loads (optional challenge)
            const interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);

            // Clear the timer when the component unmounts
            return () => clearInterval(interval);
        }
        else {
            // Redirect to results if the question id is not found
            navigate('/result');
        }
    }, [id, navigate]);

    useEffect(() => {
        // Redirect to the result page when the timer reaches zero
        if (timer === 0) {
            navigate('/result');
        }
    }, [timer, navigate]);

    useEffect(() => {
        // Update progress when the user submits an answer
        if (submitted) {
            const totalQuestions = questions.length;
            let innerNoOfQuestionSubmitter = NoOfQuestionSubmitted + 1
            setNoOfQuestionSubmitted(innerNoOfQuestionSubmitter);
            const currentQuestionId = currentQuestion ? currentQuestion.id : 0;
            const calculatedProgress = (NoOfQuestionSubmitted / totalQuestions) * 100;
            setProgress(calculatedProgress);
        }
    }, [currentQuestion, submitted]);

    useEffect(() => {
        const questionId = parseInt(id, 10);
        // Retrieve the selected option from localStorage
        const userAnswers = JSON.parse(localStorage.getItem('userAnswers')) || {};
        const selectedOptionForCurrentQuestion = userAnswers[questionId];
        setSelectedOption(selectedOptionForCurrentQuestion || '');
    }, [currentQuestion]);

    const handleOptionSelect = (option) => { // Function to get selected option
        setSelectedOption(option);

        // Store the selected option in localStorage
        const userAnswers = JSON.parse(localStorage.getItem('userAnswers')) || {};
        userAnswers[currentQuestion.id] = option;
        localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
    };

    const handleSubmit = () => { // Function to get the submit the selected option 
        // Check if the selected option is correct
        const correct = selectedOption === currentQuestion.correctAnswer;
        setIsAnswerCorrect(correct);
        if (isAnswerCorrect) {
            updateScore();
        }
        setSubmitted(true);

        // Redirect to the next question or results page
        const nextQuestionId = currentQuestion.id + 1;
        const nextPath = nextQuestionId <= questions.length
            ? `/question/${nextQuestionId}`
            : '/result';

        // Redirect after a delay for better user experience
        // setTimeout(() => {
        navigate(nextPath);
        // }, 1000);
    };

    const handleNavigation = (direction) => {
        const nextQuestionId =
            direction === 'next' ? currentQuestion.id + 1 : currentQuestion.id - 1;

        if (nextQuestionId > 0 && nextQuestionId <= questions.length) {
            navigate(`/question/${nextQuestionId}`);
        }
        
        setSubmitted(false);
    };


    const handleClearAnswers = () => {
        // Clear user answers from localStorage
        localStorage.removeItem('userAnswers');
        // Reset the selected option state to an empty string
        setSelectedOption('');
        // Redirect to the first question
        navigate('/question/1');
    };


    return (
        <div>
            {currentQuestion && (
                <div>
                    <h2>Question {currentQuestion.id}</h2>
                    <p>{currentQuestion.question}</p>
                    {/* <ul>
                        {currentQuestion.options.map((option) => (
                            <li
                                key={option}
                                onClick={() => handleOptionSelect(option)}
                                style={{ cursor: 'pointer' }}
                            >
                                {option}
                            </li>
                        ))}
                    </ul> */}
                    <div>
                        {currentQuestion.options.map((option, index) => (
                            <div key={index} className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id={`choice${index + 1}`}
                                    value={option}
                                    checked={selectedOption === option}
                                    onChange={() => handleOptionSelect(option)}
                                // disabled={submitted}
                                />
                                <label className="form-check-label" htmlFor={`choice${index + 1}`}>
                                    {option}
                                </label>


                                {/* <label className={`form-check-label ${selectedOption === option ? 'selected' : ''}`} htmlFor={`choice${index + 1}`}>
                                    {option}
                                </label> */}
                            </div>
                        ))}
                    </div>


                    <button onClick={handleSubmit} disabled={!selectedOption}>
                        Submit
                    </button>
                    {timer !== null && <p>Time remaining: {timer} seconds</p>}
                    {/* {isAnswerCorrect !== null && (
                        <p>{isAnswerCorrect ? 'Correct!' : 'Incorrect.'}</p>
                    )} */}
                    <progress value={progress} max="100" />
                    <button onClick={() => handleNavigation('prev')} disabled={currentQuestion.id === 1}>
                        Previous Question
                    </button>
                    <button onClick={() => handleNavigation('next')} disabled={currentQuestion.id === questions.length}>
                        Next Question
                    </button>
                    <button onClick={handleClearAnswers} className="btn btn-danger">
                        Clear Answers and Start Over
                    </button>
                </div>
            )}

        </div>
    )
}