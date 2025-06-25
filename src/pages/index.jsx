import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import siteCheckLogo from "../assets/images/site-cjeck-logo.svg";

function Index() {
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [activeRole, setActiveRole] = useState("employee");

  const navigate = useNavigate();

  /*
   * Login with username and password, creates JWT token saved in localStorage to persist login
   */
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/login", {
        username: event.target.username.value,
        password: event.target.password.value,
        role: activeRole,
      });

      localStorage.setItem("token", response.data.token); // save token in localStorage

      console.log("token", response.data.token);

      if (response.data.token) {
        // get user data using token
        const userResponse = await axios.get("http://localhost:8080/user", {
          headers: {
            Authorization: `Bearer ${response.data.token}`,
          },
        });

        setLoggedIn(true);
        setUser(userResponse.data.user); // save decoded user data in state
        setError("");
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      setError("error logging in");
    }
  };

  /*
   * Logout of application, clears localStorage JWT token and set state to logged out
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setUser({});
    navigate("/");
  };

  return (
    <div className="index">
      {!loggedIn && (
        <div className="login__page-container">
          <div className="login__logo-container">
            <img src={siteCheckLogo} alt="sitecheck logo" className="logo" />
          </div>
          <div className="login__title-container">
            <h3 className="login__title">Welcome to SiteCheck</h3>
            <h4 className="login__sub-title">
              Manage your construction projects efficiently
            </h4>
          </div>
          <div className="role-toggle">
            <button
              className={`role-toggle__btn ${
                activeRole === "employee" ? "active" : ""
              }`}
              onClick={() => setActiveRole("employee")}
            >
              Employee
            </button>
            <button
              className={`role-toggle__btn ${
                activeRole === "employer" ? "active" : ""
              }`}
              onClick={() => setActiveRole("employer")}
            >
              Employer
            </button>
          </div>
          <div className="form__container">
            <div className="form__title-container">
              <h3 className="form__title">
                {activeRole === "employee"
                  ? "Employee Login"
                  : "Employer Login"}
              </h3>
              <h3 className="form__sub-title">
                {activeRole === "employee"
                  ? "Access your job assignments and timesheet"
                  : "Manage employee assignments and hours"}
              </h3>
            </div>
            <form className="form" onSubmit={handleLogin}>
              <label htmlFor="name" className="form__label">
                Email{" "}
              </label>
              <input
                className="form__input"
                type="text"
                name="username"
                placeholder=" Enter your email"
                autoComplete="username"
              />
              <label htmlFor="password" className="form__label">
                Password
              </label>
              <input
                className="form__input"
                type="password"
                name="password"
                placeholder=" Enter your password"
                autoComplete="current-password"
              />
              <button className="form__btn" type="submit">
                Sign In
              </button>
              {error && <p>{error}</p>}
            </form>
          </div>
          <h3 className="message">
            Don't have an account? Contact your administrator
          </h3>
        </div>
      )}
    </div>
  );
}

export default Index;
