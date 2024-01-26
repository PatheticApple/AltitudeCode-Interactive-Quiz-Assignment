import { Link } from "react-router-dom";
import { useState } from "react";



export default function Nav() {
    // Get page value the user is on
    const [selectedPage, setSelectedPage] = useState();

    // Set page value when user changes page
    const settingSelectedPage = (value) => {
        localStorage.setItem("selectedPage", value);
        const selectedPage2 = localStorage.getItem("selectedPage");
        setSelectedPage(selectedPage2);

    };


    function HomeButton() {
        return (
            <li style={{ "backgroundColor": '#8E000A' }}>
                    <Link onClick={() => {
                        settingSelectedPage('Home');

                    }}
                        to="/">Home</Link>
                </li>
        )
    }

    function QuestionButton() {
        return (
            <li style={{ "backgroundColor": '#8E000A' }}>
                    <Link onClick={() => {
                        settingSelectedPage('Home');

                    }}
                        to="/Question/1">Question ANSWER HERE!</Link>
                </li>
        )
    }

    function ResultButton() {
        return (
            <li style={{ "backgroundColor": '#8E000A' }}>
                    <Link onClick={() => {
                        settingSelectedPage('Home');

                    }}
                        to="/Result">Result</Link>
                </li>
        )
    }
    // <a className="nav-item nav-link text-light mx-3 navButtons" href="/">Browse Events</a>
    function TestButton() {
        return (
            <a className="nav-item nav-link text-light mx-3 navButtons"><Link to="/">HELLO?</Link></a>
        )
    }


    // Function to render buttons on Nav
    


    return (
        <div className="navbar-nav ml-auto">
                <TestButton/>
        </div>
    );
}