import Nav from "./Nav";
import logo from '../logo.png'
import { Link } from 'react-router-dom';
// the header
export default function Header() {

  const handleClearAnswers = () => {
    // Clear user answers from localStorage
    localStorage.removeItem('userAnswers');
    // Reset the selected option state to an empty string
    localStorage.removeItem('answeredQuestionIds');
  };

  const handleReturnHome = () => {
    const confirmReturnHome = window.confirm("Are you sure you want to cancel the quiz and return home?");
    
    if (confirmReturnHome) {
      // Perform any additional actions if needed
      // For example, redirect to the home page
      handleClearAnswers();
    }
  };

  return (
    <header>
      {/* Nav components goes below */}
      {/* <Nav /> */}
      <nav className="navbar navbar-expand-lg navbar-light backgroundDarkNoGradient navFontSize text-light bottomLine">
        <div className="container">
          {/* <div className=" col-lg-2 image-container"> */}
            <a className="navbar-brand">
              <Link to="/" onClick={handleReturnHome}><img id="companyLogo" src={logo}
                className="rounded float-left img-fluid" alt="Company Logo"></img>
              </Link></a>
          {/* </div> */}

          {/* <button className="navbar-toggler bg-secondary" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarButtons" aria-controls="navbarButtons" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

          <div className="collapse navbar-collapse justify-content-end col-12 col-lg-4" id="navbarButtons">
            <div className="navbar-nav ml-auto">
              
              <div className="col-12 col-lg-6">
                <a className="nav-item nav-link text-light mx-3  text-center m-3"><Link to="/question/1" className="navButtons p-3">Question</Link></a>
              </div>

              <div className="col-12 col-lg-6">
                <a className="nav-item nav-link text-light mx-3  text-center m-3"><Link to="/result" className="navButtons p-3">Result</Link></a>
              </div>

            </div>
          </div> */}
        </div>
      </nav>
    </header>


  );
}