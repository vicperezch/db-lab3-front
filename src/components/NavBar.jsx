import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-book me-2"></i>Academy
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item mx-1">
              <Link 
                className="nav-link px-3 py-2 rounded" 
                to="/students"
                activeClassName="active bg-primary"
              >
                <i className="bi bi-people-fill me-1"></i> Students
              </Link>
            </li>
            <li className="nav-item mx-1">
              <Link 
                className="nav-link px-3 py-2 rounded" 
                to="/courses"
                activeClassName="active bg-primary"
              >
                <i className="bi bi-journal-bookmark-fill me-1"></i> Courses
              </Link>
            </li>
            <li className="nav-item mx-1">
              <Link 
                className="nav-link px-3 py-2 rounded" 
                to="/enrollments"
                activeClassName="active bg-primary"
              >
                <i className="bi bi-clipboard-check-fill me-1"></i> Enrollments
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;