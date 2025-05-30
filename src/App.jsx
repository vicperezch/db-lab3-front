import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import StudentsView from './pages/StudentsView';
import CoursesView from './pages/CoursesView';
import EnrollmentsView from './pages/EnrollmentsView';

const App = () => {
  return (
    <Router>
      <NavBar />
      <div>
        <Routes>
          <Route path="/" element={<StudentsView />}/>
          <Route path="/students" element={<StudentsView />} />
          <Route path="/courses" element={<CoursesView />} />
          <Route path="/enrollments" element={<EnrollmentsView />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
