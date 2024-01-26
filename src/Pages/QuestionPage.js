import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import techQuestions from './tech.json'
import mathQuestions from './math.json'

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
        const foundQuestion = techQuestions.find((q) => q.id === questionId); // Find the question with the corresponding id
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
        if (submitted) {
          const totalQuestions = techQuestions.length;
          const answeredQuestionIds = JSON.parse(localStorage.getItem('answeredQuestionIds')) || [];
      
          if (!answeredQuestionIds.includes(currentQuestion.id)) {
            const updatedProgress = Math.ceil(((NoOfQuestionSubmitted) / totalQuestions) * 100);
            setProgress(updatedProgress);
            console.log("UPDATE PROGRESS BAR")
          }
        }
      }, [currentQuestion, submitted, NoOfQuestionSubmitted, techQuestions.length]);

    useEffect(() => {
        const questionId = parseInt(id, 10);
        // Retrieve the selected option from localStorage
        const userAnswers = JSON.parse(localStorage.getItem('userAnswers')) || {};
        const selectedOptionForCurrentQuestion = userAnswers[questionId];
        setSelectedOption(selectedOptionForCurrentQuestion || '');
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
        console.log((answeredQuestionIds.length / techQuestions.length) * 100);
        setSelectedOption(option);
      
        // If the answer was submitted, wait for a short delay and then navigate
        if (submitted) {
         
            const nextQuestionId = currentQuestion.id + 1;
            const nextPath = nextQuestionId <= techQuestions.length ? `/question/${nextQuestionId}` : '/result';
            navigate(nextPath);
          
        } else {
          // If not submitted, automatically submit after a delay
         
            handleSubmit();
        
        }
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
        const nextPath = nextQuestionId <= techQuestions.length
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

        if (nextQuestionId > 0 && nextQuestionId <= techQuestions.length) {
            navigate(`/question/${nextQuestionId}`);
        }

        setSubmitted(false);
    };


    const handleClearAnswers = () => {
        // Clear user answers from localStorage
        localStorage.removeItem('userAnswers');
        // Reset the selected option state to an empty string
        localStorage.removeItem('answeredQuestionIds');

        setNoOfQuestionSubmitted(0);
        setSelectedOption('');
        // Redirect to the first question
        navigate('/question/1');
        console.log("No of Questions Submitted: " + NoOfQuestionSubmitted);
        setProgress(0);
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
                            <h2 className='display-4'>Question {currentQuestion.id} of {techQuestions.length}</h2>
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
                                            <button className="btn btn-warning w-100 btn-lg" onClick={() => handleNavigation('next')} disabled={currentQuestion.id === techQuestions.length}>
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className='row'>
                                <div className='text-center my-2'>
                                    <button onClick={handleClearAnswers} className="btn btn-danger btn-lg">
                                        Clear Answers and Start Over
                                    </button>
                                </div>

                            </div>

                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}