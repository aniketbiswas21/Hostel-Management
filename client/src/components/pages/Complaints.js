import React from "react";
import axios from "axios";

const Complaints = () => {
  const [complaintMode, setComplaintMode] = React.useState(false);
  const [complaintDescription, setComplaintDescription] = React.useState("");
  const [complaints, setComplaints] = React.useState([]);

  const fetchComplaints = () => {
    axios.get("/api/users/complaints").then((res) => {
      console.log(res.data);

      setComplaints(res.data.data);
    });
  };
  const user = JSON.parse(localStorage.getItem("user"));

  React.useEffect(() => {
    fetchComplaints();
  }, [complaintMode]);

  const addComplaint = async () => {
    const response = await axios.post("/api/users/addComplaint", {
      description: complaintDescription,
      user: user._id,
    });

    if (response.status !== 200) {
      alert("Error");
    }

    setComplaintMode(false);
    setComplaintDescription("");
  };

  const resolveComplaint = async (id) => {
    const response = await axios.put("/api/users/resolve" + "/" + id, {
      id,
    });

    if (response.status !== 200) {
      alert("Error");
    }

    fetchComplaints();
  };

  return (
    <div className="mid container">
      <h1>Complaints</h1>
      {complaintMode ? (
        <div className="row" style={{ marginTop: "2rem" }}>
          <div className="col">
            <label htmlFor="description">Complaint Description</label>
            <textarea
              type="text"
              id="description"
              value={complaintDescription}
              onChange={(e) => setComplaintDescription(e.target.value)}
              style={{ height: "400px" }}
              className="form-control"
              placeholder="Add a detailed description"
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={addComplaint}
              style={{ marginTop: "2rem" }}
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <>
          {user.role === "Student" && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setComplaintMode(true)}
            >
              Add a Complaint
            </button>
          )}
          <div
            style={{ marginTop: "50px", overflow: "scroll", maxHeight: 800 }}
          >
            <table className="table table-striped table-hover">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Description</th>
                  <th scope="col">Resolved</th>
                  {user.role === "Staff" ||
                    (user.role === "Warden" && <th scope="col">Resolve</th>)}
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{complaint.description}</td>
                    <td>{complaint.resolved ? "Yes" : "No"}</td>
                    {(user.role === "Staff" || user.role === "Warden") &&
                      (!complaint.resolved ? (
                        <button
                          className="btn btn-primary"
                          style={{ margin: "0.5rem" }}
                          onClick={() => {
                            resolveComplaint(complaint._id);
                          }}
                        >
                          Resolve
                        </button>
                      ) : (
                        <button
                          className="btn btn-secondary"
                          style={{ margin: "0.5rem" }}
                          disabled
                        >
                          Resolved
                        </button>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Complaints;
