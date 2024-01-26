import './App.css';
import React, { useState } from 'react';

import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'


import BoostrapLink from './Components/Bootstrap';
import Header from './Components/Header';
import Footer from './Components/Footer';

import Home from './Pages/HomePage';
import Question from './Pages/QuestionPage';
import Result from './Pages/ResultPage';


function App() {
  const [score, setScore] = useState(0);
  const updateScore = () => {
    setScore((prevScore) => prevScore + 1);
  };
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to TEST TEST TEST.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/Question/:id' element={<Question updateScore={updateScore}/>}></Route>
        <Route path='/Result' element={<Result score={score}/>}></Route>
      </Routes>
      <Footer />
      {/* <BoostrapLink /> */}
    </BrowserRouter>
  );
}

export default App;
