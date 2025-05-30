import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const EnrollmentsView = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [id, setId] = useState(null);
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [enrollmentDate, setEnrollmentDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchEnrollments = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/enrollments");
      const data = await res.json();
      setEnrollments(data);
    } catch (err) {
      toast.error("Error fetching enrollments");
      console.error(err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/students");
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      toast.error("Error fetching students");
      console.error(err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/courses");
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      toast.error("Error fetching courses");
      console.error(err);
    }
  };

  const deleteEnrollment = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/enrollments/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEnrollments(enrollments.filter((e) => e.id !== id));
        toast.success("Enrollment deleted successfully");
      } else {
        toast.error("Failed to delete enrollment");
      }
    } catch (err) {
      toast.error("An error occurred while deleting the enrollment");
      console.error(err);
    }
  };

  const handleAddEnrollment = () => {
    setId(null);
    setStudentId("");
    setCourseId("");
    setEnrollmentDate(new Date().toISOString().split('T')[0]);
    setShowModal(true);
  };

  const handleEditEnrollment = (enrollment) => {
    setId(enrollment.id);
    setStudentId(enrollment.studentId || "");
    setCourseId(enrollment.courseId || "");
    setEnrollmentDate(enrollment.enrollmentDate ? enrollment.enrollmentDate.split('T')[0] : new Date().toISOString().split('T')[0]);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setId(null);
    setStudentId("");
    setCourseId("");
    setEnrollmentDate(new Date().toISOString().split('T')[0]);
  };

  const handleSaveEnrollment = async () => {
    if (!studentId || !courseId || !enrollmentDate) {
      toast.error("All fields are required");
      return;
    }

    const method = id === null ? "POST" : "PUT";
    const url = id === null
      ? "http://localhost:8080/api/enrollments"
      : `http://localhost:8080/api/enrollments/${id}`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: parseInt(studentId),
          courseId: parseInt(courseId),
          enrollmentDate: new Date(enrollmentDate).toISOString(),
        }),
      });

      if (res.ok) {
        const savedEnrollment = await res.json();
        if (method === "POST") {
          // Para creación, agregamos el nuevo enrollment al estado con los datos completos
          const student = students.find(s => s.id === parseInt(studentId));
          const course = courses.find(c => c.id === parseInt(courseId));
          setEnrollments(prev => [
            ...prev,
            {
              ...savedEnrollment,
              firstName: student?.firstName,
              lastName: student?.lastName,
              courseName: course?.name
            }
          ]);
          toast.success("Enrollment added successfully");
        } else {
          // Para actualización, actualizamos el estado local con los datos completos
          const student = students.find(s => s.id === parseInt(studentId));
          const course = courses.find(c => c.id === parseInt(courseId));
          setEnrollments(prevEnrollments => 
            prevEnrollments.map(e => 
              e.id === savedEnrollment.id 
                ? { 
                    ...savedEnrollment,
                    firstName: student?.firstName,
                    lastName: student?.lastName,
                    courseName: course?.name
                  } 
                : e
            )
          );
          toast.success("Enrollment updated successfully");
        }
        handleCloseModal();
      } else {
        toast.error("Failed to save enrollment");
      }
    } catch (err) {
      toast.error("An error occurred while saving the enrollment");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEnrollments();
    fetchStudents();
    fetchCourses();
  }, []);

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown';
  };

  const getStudentEmail = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.email : '';
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'Unknown';
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center">
        <h2>Enrollments</h2>
        <button className="btn btn-primary" onClick={handleAddEnrollment}>Add</button>
      </div>

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Student</th>
            <th>Course</th>
            <th>Enrollment Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((e) => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.firstName ? `${e.firstName} ${e.lastName}` : getStudentName(e.studentId)}</td>
              <td>{e.courseName || getCourseName(e.courseId)}</td>
              <td>{new Date(e.enrollmentDate).toLocaleDateString()}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditEnrollment(e)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => deleteEnrollment(e.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {enrollments.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">No enrollments available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{id === null ? "Add Enrollment" : "Edit Enrollment"}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Student</label>
                  <select 
                    className="form-select" 
                    value={studentId} 
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                  >
                    <option value="">Select a student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.firstName} {student.lastName} | {student.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Course</label>
                  <select 
                    className="form-select" 
                    value={courseId} 
                    onChange={(e) => setCourseId(e.target.value)}
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Enrollment Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={enrollmentDate} 
                    onChange={(e) => setEnrollmentDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleSaveEnrollment} 
                  disabled={!studentId || !courseId || !enrollmentDate}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentsView;