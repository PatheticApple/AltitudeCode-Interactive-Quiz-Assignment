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
    // Function to render buttons on Nav
    


    return (
        <nav>
            <ul>
                <HomeButton />
                <QuestionButton />
                <ResultButton />
            </ul>
        </nav>
    );
}