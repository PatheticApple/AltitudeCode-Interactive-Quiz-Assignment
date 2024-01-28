import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


function RenderResults() {
    // const { id } = useParams();
    const { category } = useParams();
    const navigate = useNavigate();

    const [loadedQuestions, setLoadedQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [score, setScore] = useState(0);



    useEffect(() => {
        // Dynamically import the JSON file based on the category
        import(`./${category}.json`)
            .then((module) => setLoadedQuestions(module.default))
            .catch((error) => {
                console.error(`Error loading questions for category ${category}:`, error);
                navigate('/error'); // Redirect to an error page
            });
    }, [category, navigate]);

    useEffect(() => {
        // Retrieve user answers and questions from localStorage
        const storedUserAnswers = JSON.parse(localStorage.getItem('userAnswers')) || {};
        setUserAnswers(storedUserAnswers);

        // Calculate the score
        let userScore = 0;
        loadedQuestions.forEach((question) => {
            const userAnswer = storedUserAnswers[question.id];
            if (userAnswer && userAnswer === question.correctAnswer) {
                userScore += 1;
            }
        });
        setScore(userScore);
    }, [loadedQuestions]);

    const handleClearAnswers = () => {
        // Clear user answers from localStorage
        localStorage.removeItem('userAnswers');
        // Redirect to the first question
        localStorage.removeItem('answeredQuestionIds');
        navigate(`/question/1/${category}`);
    };
    return (
        <div>
            <div>
                <h1>Your final score is: {score} out of {loadedQuestions.length}</h1>
                <hr></hr>
                <ol>
                    <div className='row'>
                        {loadedQuestions.map((question) => (
                            <div className='col-12 col-md-6 col-xl-4'>
                                <li key={question.id}>

                                    <strong>Question:</strong> {question.question}<br />
                                    
                                    <strong>Correct Answer:</strong> {question.correctAnswer}<br />
                                    <strong>Your Answer:</strong> {userAnswers[question.id] ?? "No Answer"} -
                                    {userAnswers[question.id] === question.correctAnswer ? (
                                        <span style={{ color: 'green' }}> (Correct)</span>
                                    ) : (
                                        <span style={{ color: 'red' }}> (Wrong)</span>
                                    )}
                                    <hr></hr><br />

                                </li>
                            </div>
                        ))}
                    </div>

                </ol>
            </div>
            <div className='row'>
                <div className='text-center my-2'>
                    <button onClick={handleClearAnswers} className="btn btn-danger btn-lg">
                        Clear Answers and Start Over
                    </button>
                </div>

            </div>
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