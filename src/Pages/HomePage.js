import { Link } from "react-router-dom";


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



export default function Home() {
    return (
        <div className="homeContainer">

            <div className="backgroundImage py-5">
                <div className="container">
                    <h1 className="text-light text-center display-2 py-5">Welcome to my interactive quiz</h1>
                </div>
            </div>

            <hr className="horizontalLines"></hr>

            <div className="row">
                <div className="col-12 col-xl-4 col-md-6">
                    <Link to="/question/1" className="noTextDecoration"><div className="m-5 p-5 text-center text-light quizCards">
                        <h1>Normal Quiz</h1>
                        <h2 className="display-6 py-5">{questions.length} Questions</h2>
                        <h3 className="py-2">Time</h3>
                    </div></Link>
                </div>
                <div className="col-12 col-xl-4 col-md-6">
                    <Link to="/question/1" className="noTextDecoration"><div className="m-5 p-5 text-center text-light quizCards">
                        <h1>Normal Quiz</h1>
                        <h2 className="display-6 py-5">{questions.length} Questions</h2>
                        <h3 className="py-2">Time</h3>
                    </div></Link>
                </div>
                <div className="col-12 col-xl-4 col-md-6">
                    <Link to="/question/1" className="noTextDecoration"><div className="m-5 p-5 text-center text-light quizCards">
                        <h1>Normal Quiz</h1>
                        <h2 className="display-6 py-5">{questions.length} Questions</h2>
                        <h3 className="py-2">Time</h3>
                    </div></Link>
                </div>
            </div>
        </div>
    )
}