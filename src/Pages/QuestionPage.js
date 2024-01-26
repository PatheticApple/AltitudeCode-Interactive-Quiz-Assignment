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
    const [timer, setTimer] = useState(100); // Timer in seconds (optional challenge)
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
        // Get the previous answer from localStorage
        const userAnswers = JSON.parse(localStorage.getItem('userAnswers')) || {};

        // If the user had previously answered this question, subtract 1 from the progress
        if (userAnswers[currentQuestion.id] && submitted) {
            setProgress((prevProgress) => prevProgress - (1 / questions.length) * 100);
        }

        // Update the user's answer and localStorage
        userAnswers[currentQuestion.id] = option;
        localStorage.setItem('userAnswers', JSON.stringify(userAnswers));

        // Set the selected option
        setSelectedOption(option);

        // If the answer was submitted, update the progress
        if (submitted) {
            setProgress((prevProgress) => prevProgress + (1 / questions.length) * 100);
        } else {
            // If the answer was not submitted, automatically submit it
            handleSubmit();
        }

        // Automatically move on to the next question
        const nextQuestionId = currentQuestion.id + 1;
        const nextPath = nextQuestionId <= questions.length
            ? `/question/${nextQuestionId}`
            : '/result';


        navigate(nextPath);

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

            <div className="homeContainer">

                <div className="backgroundImage py-5">
                    <div className="container">
                        <h1 className="text-light text-center display-2 py-5">Welcome to my interactive quiz</h1>
                    </div>
                </div>

                <hr className="horizontalLines"></hr>

                <div className='container text-light'>
                    {currentQuestion && (
                        <div>
                            <h2 className='display-4'>Question {currentQuestion.id} of {questions.length}</h2>
                            <p>{currentQuestion.question}</p>
                            <div className='row'>
                                {currentQuestion.options.map((option, index) => (
                                    <div key={index} className="form-check my-2 col-12 col-md-6">
                                        <button
                                            key={index}
                                            type="button"
                                            className={`btn btn-outline-primary w-100 btn-lg ${selectedOption === option ? 'active' : ''}`}
                                            onClick={() => handleOptionSelect(option)}
                                        // disabled={submitted}
                                        >
                                            {option}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="progress my-3">
                                <div className="progress-bar progress-bar-striped" role="progressbar" style={{ width: `${progress}%` }} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">{progress}%</div>
                            </div>


                            <div className='row'>
                                <div className='col-12 col-xl-8 text-start'>
                                    {timer !== null && <p>Time remaining: {timer} seconds</p>}
                                </div>

                                <div className='col-12 col-xl-4 text-center'>
                                    <div className='row'>
                                        <div className='col-12 col-sm-6 my-2'>
                                            <button className="btn btn-warning w-100 btn-lg" onClick={() => handleNavigation('prev')} disabled={currentQuestion.id === 1}>
                                            Prev
                                        </button>
                                        </div>

                                        <div className='col-12 col-sm-6 my-2'>
                                        <button className="btn btn-warning w-100 btn-lg" onClick={() => handleNavigation('next')} disabled={currentQuestion.id === questions.length}>
                                            Next
                                        </button>
                                        </div>
                                    </div>
                                </div>

                            </div>


                            <button onClick={handleClearAnswers} className="btn btn-danger">
                                Clear Answers and Start Over
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}