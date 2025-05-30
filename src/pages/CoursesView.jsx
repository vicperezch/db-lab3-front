import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const CoursesView = () => {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState("IN_PERSON");

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

  const deleteCourse = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/courses/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCourses(courses.filter((course) => course.id !== id));
        toast.success("Course deleted successfully");
      } else {
        toast.error("Failed to delete course");
      }
    } catch (err) {
      toast.error("Error deleting course");
      console.error(err);
    }
  };

  const handleAddCourse = () => {
    setId(null);
    setName("");
    setDescription("");
    setMode("IN_PERSON");
    setShowModal(true);
  };

  const handleEditCourse = (course) => {
    setId(course.id);
    setName(course.name);
    setDescription(course.description);
    setMode(course.mode);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setId(null);
    setName("");
    setDescription("");
    setMode("IN_PERSON");
  };

  const handleSaveCourse = async () => {
    if (!name.trim() || !description.trim()) {
      toast.error("Name and description are required");
      return;
    }

    const method = id === null ? "POST" : "PUT";
    const url = id === null
      ? "http://localhost:8080/api/courses"
      : `http://localhost:8080/api/courses/${id}`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          mode,
        }),
      });
      if (res.ok) {
        const savedCourse = await res.json();
        if (method === "POST") {
          setCourses([...courses, savedCourse]);
          toast.success("Course added successfully");
        } else {
          setCourses(courses.map((c) => (c.id === savedCourse.id ? savedCourse : c)));
          toast.success("Course updated successfully");
        }
        handleCloseModal();
      } else {
        toast.error("Failed to save course");
      }
    } catch (err) {
      toast.error("Error saving course");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center">
        <h2>Courses</h2>
        <button className="btn btn-primary" onClick={handleAddCourse}>
          Add
        </button>
      </div>

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Mode</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.id}</td>
              <td>{course.name}</td>
              <td>{course.description}</td>
              <td>{course.mode}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEditCourse(course)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteCourse(course.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {courses.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">No courses available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{id === null ? "Add Course" : "Edit Course"}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="courseName" className="form-label">Name</label>
                  <input
                    type="text"
                    id="courseName"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="courseDescription" className="form-label">Description</label>
                  <input
                    type="text"
                    id="courseDescription"
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="courseMode" className="form-label">Mode</label>
                  <select
                    id="courseMode"
                    className="form-select"
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                  >
                    <option value="IN_PERSON">IN_PERSON</option>
                    <option value="ONLINE">ONLINE</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveCourse}
                  disabled={!name.trim() || !description.trim()}
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

export default CoursesView;