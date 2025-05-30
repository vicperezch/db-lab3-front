import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const StudentsView = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [id, setId] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [level, setLevel] = useState("BACHELOR");
  const [gender, setGender] = useState("UNSPECIFIED");

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

  const deleteStudent = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/students/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setStudents(students.filter((s) => s.id !== id));
        toast.success("Student deleted successfully");
      } else {
        toast.error("Failed to delete student");
      }
    } catch (err) {
      toast.error("An error occurred while deleting the student");
      console.error(err);
    }
  };

  const handleAddStudent = () => {
    setId(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setLevel("BACHELOR");
    setGender("UNSPECIFIED");
    setShowModal(true);
  };

  const handleEditStudent = (student) => {
    setId(student.id);
    setFirstName(student.firstName);
    setLastName(student.lastName);
    setEmail(student.email);
    setLevel(student.level);
    setGender(student.gender);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setId(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setLevel("BACHELOR");
    setGender("UNSPECIFIED");
  };

  const handleSaveStudent = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast.error("All fields are required");
      return;
    }

    const method = id === null ? "POST" : "PUT";
    const url = id === null
      ? "http://localhost:8080/api/students"
      : `http://localhost:8080/api/students/${id}`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          level,
          gender,
        }),
      });

      if (res.ok) {
        const savedStudent = await res.json();
        if (method === "POST") {
          setStudents([...students, savedStudent]);
          toast.success("Student added successfully");
        } else {
          setStudents(students.map((s) => s.id === savedStudent.id ? savedStudent : s));
          toast.success("Student updated successfully");
        }
        handleCloseModal();
      } else {
        toast.error("Failed to save student");
      }
    } catch (err) {
      toast.error("An error occurred while saving the student");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center">
        <h2>Students</h2>
        <button className="btn btn-primary" onClick={handleAddStudent}>Add</button>
      </div>

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Level</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.firstName}</td>
              <td>{s.lastName}</td>
              <td>{s.email}</td>
              <td>{s.level}</td>
              <td>{s.gender}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditStudent(s)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => deleteStudent(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">No students available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{id === null ? "Add Student" : "Edit Student"}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">First Name</label>
                  <input type="text" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Last Name</label>
                  <input type="text" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Level</label>
                  <select className="form-select" value={level} onChange={(e) => setLevel(e.target.value)}>
                    <option value="BACHELOR">BACHELOR</option>
                    <option value="MASTER">MASTER</option>
                    <option value="DOCTORATE">DOCTORATE</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Gender</label>
                  <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                    <option value="OTHER">OTHER</option>
                    <option value="UNSPECIFIED">UNSPECIFIED</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleSaveStudent} disabled={!firstName.trim() || !lastName.trim() || !email.trim()}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsView;
