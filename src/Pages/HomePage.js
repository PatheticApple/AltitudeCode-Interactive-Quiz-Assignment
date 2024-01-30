import { Link } from "react-router-dom";

import techQuestions from './tech.json'
import mathQuestions from './math.json'
import countryQuestions from './country.json'




export default function Home() {
    return (
        <div className="homeContainer">

            <div className="backgroundImage py-5">
                <div className="container">
                    <h1 className="text-light text-center display-2 py-5"><strong>Welcome to my interactive quiz</strong></h1>
                </div>
            </div>

            <hr className="horizontalLines"></hr>

            <div className="row">
                <div className="col-12 col-xl-4 col-md-6">
                    <Link to="/question/1/tech" className="noTextDecoration"><div className="m-5 p-5 text-center text-light quizCards">
                        <h1>Tech Quiz</h1>
                        <h2 className="display-6 py-5">{techQuestions.length} Questions</h2>
                        <h3 className="py-2">Time</h3>
                    </div></Link>
                </div>
                <div className="col-12 col-xl-4 col-md-6">
                    <Link to="/question/1/math" className="noTextDecoration"><div className="m-5 p-5 text-center text-light quizCards">
                        <h1>Math Quiz</h1>
                        <h2 className="display-6 py-5">{mathQuestions.length} Questions</h2>
                        {/* <h3 className="py-2">Time</h3> */}
                    </div></Link>
                </div>
                <div className="col-12 col-xl-4 col-md-6">
                    <Link to="/question/1/country" className="noTextDecoration"><div className="m-5 p-5 text-center text-light quizCards">
                        <h1>Country Quiz</h1>
                        <h2 className="display-6 py-5">{countryQuestions.length} Questions</h2>
                        <h3 className="py-2">Time</h3>
                    </div></Link>
                </div>
            </div>
        </div>
    )
}