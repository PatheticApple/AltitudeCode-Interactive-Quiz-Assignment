import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import techQuestions from './tech.json'
import mathQuestions from './math.json'


function useInterval(callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}


export default function Question({ updateScore }) {
    const { id, category } = useParams(); // Get parameter from URL
    const navigate = useNavigate(); // Navigate questions (used to be useHistory)
    const [currentQuestion, setCurrentQuestion] = useState(null); // UseState for current question
    const [selectedOption, setSelectedOption] = useState(''); // UseState for Selected Option
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null); // UseState for if the SelectedOption is correct (Boolean)
    const [timer, setTimer] = useState(100); // Timer in seconds (optional challenge)
    const [progress, setProgress] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [NoOfQuestionSubmitted, setNoOfQuestionSubmitted] = useState(0);
    const [innerLoadedQuestions, setInnerLoadedQuestions] = useState([]);
    const [showHint, setShowHint] = useState(false);

    const timerRef = useRef(100); // Initialize with the initial timer value

    useInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
    }, timerRef.current ? 1000 : null);


    console.log("Category is: " + category);
    useEffect(() => {
        const loadQuestionsAndSetState = async () => {
            const loadedQuestions = await loadQuestions();
            setInnerLoadedQuestions(loadedQuestions);

            const questionId = parseInt(id, 10);
            const foundQuestion = loadedQuestions.find((q) => q.id === questionId);

            if (foundQuestion) {
                setCurrentQuestion(foundQuestion);
                timerRef.current = 100; // Reset timer value when loading a new question
            } else {
                navigate(`/result/${category}`);
            }
        };

        const loadQuestions = async () => {
            try {
                const questions = await import(`./${category}.json`);
                return questions.default || [];
            } catch (error) {
                console.error('Error loading questions:', error);
                return [];
            }
        };

        loadQuestionsAndSetState();
    }, [id, category, navigate, showHint]);

    useEffect(() => {
        // Redirect to the result page when the timer reaches zero
        if (timer === 0) {
            navigate(`/result/${category}`);
        }
    }, [timer, navigate]);

    useEffect(() => {
        if (submitted) {
            const totalQuestions = innerLoadedQuestions.length;
            const answeredQuestionIds = JSON.parse(localStorage.getItem('answeredQuestionIds')) || [];

            if (!answeredQuestionIds.includes(currentQuestion.id)) {
                const updatedProgress = Math.ceil(((NoOfQuestionSubmitted) / totalQuestions) * 100);
                setProgress(updatedProgress);
                console.log("UPDATE PROGRESS BAR")
            }
        }
    }, [currentQuestion, submitted, NoOfQuestionSubmitted, innerLoadedQuestions.length]);

    useEffect(() => {
        const questionId = parseInt(id, 10);
        // Retrieve the selected option from localStorage
        const userAnswers = JSON.parse(localStorage.getItem('userAnswers')) || {};
        const selectedOptionForCurrentQuestion = userAnswers[questionId];
        setSelectedOption(selectedOptionForCurrentQuestion || '');
    }, [currentQuestion]);


    useEffect(() => {
        setShowHint(false); // Reset showHint when the current question changes
    }, [currentQuestion]);


    const handleOptionSelect = (option) => {
        const userAnswers = JSON.parse(localStorage.getItem('userAnswers')) || {};
        const answeredQuestionIds = JSON.parse(localStorage.getItem('answeredQuestionIds')) || [];

        // Update the user's answer and localStorage
        userAnswers[currentQuestion.id] = option;
        localStorage.setItem('userAnswers', JSON.stringify(userAnswers));

        // Update the list of answered question IDs and localStorage
        if (!answeredQuestionIds.includes(currentQuestion.id)) {
            answeredQuestionIds.push(currentQuestion.id);
            localStorage.setItem('answeredQuestionIds', JSON.stringify(answeredQuestionIds));
            setNoOfQuestionSubmitted(NoOfQuestionSubmitted + 1);
            console.log("No of Questions Submitted: " + NoOfQuestionSubmitted);
        }

        // Update the progress
        // setProgress((answeredQuestionIds.length / questions.length) * 100);
        console.log(answeredQuestionIds.length);
        console.log((answeredQuestionIds.length / innerLoadedQuestions.length) * 100);
        setSelectedOption(option);

        // If the answer was submitted, wait for a short delay and then navigate
        if (submitted) {

            const nextQuestionId = currentQuestion.id + 1;
            const nextPath = nextQuestionId <= innerLoadedQuestions.length ? `/question/${nextQuestionId}/${category}` : `/result/${category}`;
            navigate(nextPath);

        } else {
            // If not submitted, automatically submit after a delay

            handleSubmit();

        }
    };


    const handleToggleHint = () => {
        setShowHint((prevShowHint) => !prevShowHint);
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
        const nextPath = nextQuestionId <= innerLoadedQuestions.length
            ? `/question/${nextQuestionId}/${category}`
            : `/result/${category}`;

        // Redirect after a delay for better user experience
        // setTimeout(() => {
        navigate(nextPath);
        // }, 1000);
    };

    const handleNavigation = (direction) => {
        const nextQuestionId =
            direction === 'next' ? currentQuestion.id + 1 : currentQuestion.id - 1;

        if (nextQuestionId > 0 && nextQuestionId <= innerLoadedQuestions.length) {
            navigate(`/question/${nextQuestionId}/${category}`);
        }
        setSubmitted(false);
    };


    const handleClearAnswers = () => {
        // Clear user answers from localStorage
        if (startOverConfirmation()) {
            localStorage.removeItem('userAnswers');
            // Reset the selected option state to an empty string
            localStorage.removeItem('answeredQuestionIds');

            setNoOfQuestionSubmitted(0);
            setSelectedOption('');
            // Redirect to the first question
            navigate(`/question/1/${category}`);
            console.log("No of Questions Submitted: " + NoOfQuestionSubmitted);
            setProgress(0);
        }

    };

    const showConfirmation = () => {
        return window.confirm('Are you sure you want to return home? Your progress will be lost.');
    };

    const startOverConfirmation = () => {
        return window.confirm('Are you sure you want to start over? Your current progress will be lost.');
    };


    const handleReturnHome = () => {
        if (showConfirmation()) {
            // Clear user answers from localStorage
            localStorage.removeItem('userAnswers');
            // Reset the selected option state to an empty string
            localStorage.removeItem('answeredQuestionIds');
            setNoOfQuestionSubmitted(0);
            setSelectedOption('');
            // Redirect to the home page
            navigate('/');
        }
    };

    return (
        <div>

            <div className="homeContainer">

                <div className="backgroundImage py-5">
                    <div className="container">
                        <h1 className="text-light text-center display-2 py-5"> {category.charAt(0).toUpperCase() + category.slice(1)} Quiz </h1>
                    </div>
                </div>

                <hr className="horizontalLines"></hr>

                <div className='container text-light'>
                    {currentQuestion && (
                        <div>
                            <h2 className='display-4'>Question {currentQuestion.id} of {innerLoadedQuestions.length}</h2>
                            <h3 className='my-3'>{currentQuestion.question}</h3>
                            <div className='row'>
                                {currentQuestion.options.map((option, index) => (
                                    <div key={index} className="form-check my-2 col-12 col-md-6">
                                        <button
                                            key={index}
                                            type="button"
                                            className={`btn btn-outline-primary w-100 btn-lg p-4 ${selectedOption === option ? 'active' : ''}`}
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
                                    {showHint && (
                                        <div className="mt-3">
                                            <strong>Hint:</strong> {currentQuestion.hint}
                                        </div>
                                    )}
                                </div>
                                <div className='my-2 col-12 col-xl-4 my-2'>
                                    <button onClick={handleToggleHint} className="btn btn-primary btn-lg w-100">
                                        {showHint ? 'Hide Hint' : 'Show Hint'}
                                    </button>
                                </div>


                            </div>

                            <div className='row'>

                                <div className='col-12 col-xl-4 text-center'>
                                    <div className='row'>
                                        <div className='col-12 col-sm-6 my-2'>
                                            <button className="btn btn-warning w-100 btn-lg" onClick={() => handleNavigation('prev')} disabled={currentQuestion.id === 1}>
                                                Prev
                                            </button>
                                        </div>

                                        <div className='col-12 col-sm-6 my-2'>
                                            <button className="btn btn-warning w-100 btn-lg" onClick={() => handleNavigation('next')} disabled={currentQuestion.id === innerLoadedQuestions.length}>
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 col-xl-8 text-center'>
                                    <div className='row'>
                                        <div className='my-2 col-12 col-sm-6 my-2'>
                                            <button className="btn btn-info btn-lg w-100" onClick={handleReturnHome}>
                                                Return Home
                                            </button>
                                        </div>
                                        <div className='my-2 col-12 col-sm-6 my-2'>
                                            <button onClick={handleClearAnswers} className="btn btn-danger btn-lg w-100">
                                                Start Over
                                            </button>
                                        </div>
                                    </div>


                                </div>



                            </div>

                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}