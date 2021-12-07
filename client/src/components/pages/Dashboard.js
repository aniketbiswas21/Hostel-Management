import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentUser } from "../../actions/authActions";
import Axios from "axios";

// const clean = require("../../img/cleaning.jpg");
const student = require("../../img/student.jpg");
const staff = require("../../img/staff.jpeg");
const staff2 = require("../../img/staff.png");
const bedRoom = require("../../img/bedroom.jpeg");

const user = JSON.parse(localStorage.getItem("user"));
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      loading: true,
    };
  }
  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }

    if (!user) {
      window.location.href = "/dashboard";
    }

    if (user?.role === "Student") {
      Axios.get(`/api/student/${user.email}`)
        .then(() => {
          this.setState({ loading: false });
        })
        .catch((err) => {
          console.log(err.message);
          this.setState({
            disabled: true,
            loading: false,
          });
        });
    } else if (user?.role === "Staff") {
      Axios.get(`/api/staff/${user.email}`)
        .then(() => {
          this.setState({ loading: false });
        })
        .catch((err) => {
          console.log(err.message);
          this.setState({
            disabled: true,
            loading: false,
          });
        });
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    const { user } = this.props.auth;
    return (
      <>
        {console.log(this.state.disabled)}
        {this.state.loading ? (
          <div className="mid container">
            <h1>Loading...</h1>
          </div>
        ) : this.state.disabled === true ? (
          <div className="mid container">
            You don't have the permission to access the dashboard as of now.
            Contact your hostel warden for the same.
          </div>
        ) : (
          <div className="mid container">
            <div className="text-center" style={{ fontSize: "25px" }}>
              Welcome {user.name}!
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                marginTop: "2rem",
              }}
            >
              {user.role === "Staff" ||
                (user.role === "Warden" && (
                  <div
                    className="card hoverable"
                    style={{
                      width: "18rem",
                      hover: "",
                      height: "22rem",
                      marginBottom: "2rem",
                    }}
                  >
                    <img
                      src={student}
                      className="card-img-top"
                      alt="Cleaning"
                    />
                    <div className="card-body" style={{ height: "10rem" }}>
                      <h5 className="card-title">Student</h5>
                      <a href="/student" className="card-text">
                        Add new Student and allot Room or Check Info
                      </a>
                    </div>
                  </div>
                ))}

              <div
                className="card"
                style={{ width: "18rem", hover: "", height: "22rem" }}
              >
                <img src={bedRoom} className="card-img-top" alt="Cleaning" />
                <div className="card-body">
                  <h5 className="card-title">Room Repair/Cleaning Status</h5>
                  <a href="/block">Add Room Repair/Cleaning or Check Info</a>
                </div>
              </div>
              {(user.role === "Warden" || user.role === "Staff") && (
                <div
                  className="card"
                  style={{
                    width: "18rem",
                    hover: "",
                    height: "22rem",
                    marginBottom: "2rem",
                  }}
                >
                  <img src={staff2} className="card-img-top" alt="Cleaning" />
                  <div className="card-body">
                    <h5 className="card-title">Staff Info</h5>
                    <a href="/staff">Add more Staff or Check their info</a>
                  </div>
                </div>
              )}

              <div
                className="card"
                style={{
                  width: "18rem",
                  hover: "",
                  height: "22rem",
                  marginBottom: "2rem",
                }}
              >
                <img src={staff} className="card-img-top" alt="Cleaning" />
                <div className="card-body">
                  <h5 className="card-title">Complaints</h5>
                  <a href="/complaints">
                    Add your complaints or Check their info
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

Dashboard.propTypes = {
  // getCurrentUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { getCurrentUser })(Dashboard);
