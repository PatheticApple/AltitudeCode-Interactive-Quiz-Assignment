import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
    const { id, category } = useParams();
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
    const [timer, setTimer] = useState(100);
    const [progress, setProgress] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [NoOfQuestionSubmitted, setNoOfQuestionSubmitted] = useState(0);
    const [innerLoadedQuestions, setInnerLoadedQuestions] = useState([]);
    const [showHint, setShowHint] = useState(false);
    const [answeredQuestionIds, setAnsweredQuestionIds] = useState([]);

    const timerRef = useRef(100);


    // Use Effect for Timer
    useInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
    }, timerRef.current ? 1000 : null);

    // Use effect for question loading
    useEffect(() => {
        const loadQuestionsAndSetState = async () => {
            const loadedQuestions = await loadQuestions();
            setInnerLoadedQuestions(loadedQuestions);

            const questionId = parseInt(id, 10);
            const foundQuestion = loadedQuestions.find((q) => q.id === questionId);

            if (foundQuestion) {
                setCurrentQuestion(foundQuestion);
                timerRef.current = 100;
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


    // Use effect if timer gets to 0
    useEffect(() => {
        if (timer === 0) {
            navigate(`/result/${category}`);
        }
    }, [timer, navigate]);


    // Use effect if user submit an answer
    useEffect(() => {
        if (submitted) {
            const totalQuestions = innerLoadedQuestions.length;
            const answeredIds = JSON.parse(localStorage.getItem('answeredQuestionIds')) || [];
            setAnsweredQuestionIds(answeredIds);

            if (!answeredIds.includes(currentQuestion.id)) {
                const updatedProgress = Math.ceil(((NoOfQuestionSubmitted) / totalQuestions) * 100);
                setProgress(updatedProgress);
            }
        }
    }, [currentQuestion, submitted, NoOfQuestionSubmitted, innerLoadedQuestions.length]);


    // Use effect if user want to go back to previous answer
    useEffect(() => {
        const questionId = parseInt(id, 10);
        const userAnswers = JSON.parse(localStorage.getItem('userAnswers')) || {};
        const selectedOptionForCurrentQuestion = userAnswers[questionId];
        setSelectedOption(selectedOptionForCurrentQuestion || '');

        // Reset selected option when a new question is loaded
        if (!answeredQuestionIds.includes(questionId)) {
            setSelectedOption('');
        }
    }, [currentQuestion, id, answeredQuestionIds]);


    // Use effect to show hints
    useEffect(() => {
        setShowHint(false); // Reset showHint when the current question changes
    }, [currentQuestion]);

    const handleOptionSelect = (option) => {
        const userAnswers = JSON.parse(localStorage.getItem('userAnswers')) || {};

        userAnswers[currentQuestion.id] = option;
        localStorage.setItem('userAnswers', JSON.stringify(userAnswers));

        if (!answeredQuestionIds.includes(currentQuestion.id)) {
            const updatedIds = [...answeredQuestionIds, currentQuestion.id];
            localStorage.setItem('answeredQuestionIds', JSON.stringify(updatedIds));
            setNoOfQuestionSubmitted(NoOfQuestionSubmitted + 1);
        }

        setSelectedOption(option);

        if (submitted) {
            const nextQuestionId = currentQuestion.id + 1;
            const nextPath = nextQuestionId <= innerLoadedQuestions.length ? `/question/${nextQuestionId}/${category}` : `/result/${category}`;
            navigate(nextPath);
        } else {
            handleSubmit();
        }
    };


    // Toggle hint function
    const handleToggleHint = () => {
        setShowHint((prevShowHint) => !prevShowHint);
    };


    // Submit function
    const handleSubmit = () => {
        const correct = selectedOption === currentQuestion.correctAnswer;
        setIsAnswerCorrect(correct);
        if (isAnswerCorrect) {
            updateScore();
        }
        setSubmitted(true);

        const nextQuestionId = currentQuestion.id + 1;
        const nextPath = nextQuestionId <= innerLoadedQuestions.length ? `/question/${nextQuestionId}/${category}` : `/result/${category}`;

        navigate(nextPath);
    };


    // Navigation function
    const handleNavigation = (direction) => {
        const nextQuestionId = direction === 'next' ? currentQuestion.id + 1 : currentQuestion.id - 1;

        if (nextQuestionId > 0 && nextQuestionId <= innerLoadedQuestions.length) {
            navigate(`/question/${nextQuestionId}/${category}`);
        }
        setSubmitted(false);
    };


    // Clearing answer function (start over)
    const handleClearAnswers = () => {
        if (startOverConfirmation()) {
            localStorage.removeItem('userAnswers');
            localStorage.removeItem('answeredQuestionIds');
            setNoOfQuestionSubmitted(0);
            setSelectedOption('');
            navigate(`/question/1/${category}`);
            setProgress(0);
        }
    };


    // Showing message functions
    const showConfirmation = () => {
        return window.confirm('Are you sure you want to return home? Your progress will be lost.');
    };

    const startOverConfirmation = () => {
        return window.confirm('Are you sure you want to start over? Your current progress will be lost.');
    };


    // Retruning home functions
    const handleReturnHome = () => {
        if (showConfirmation()) {
            localStorage.removeItem('userAnswers');
            localStorage.removeItem('answeredQuestionIds');
            setNoOfQuestionSubmitted(0);
            setSelectedOption('');
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
    );
}
