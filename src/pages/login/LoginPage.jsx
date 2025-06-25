import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import siteCheckLogo from "../assets/images/site-cjeck-logo.svg";
import "./LoginPage.scss";

function LoginPage() {
  const { setUser, setLoggedIn } = useContext(UserContext);
  const [activeRole, setActiveRole] = useState("employee");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/login", {
        username: event.target.username.value,
        password: event.target.password.value,
        role: activeRole,
      });

      localStorage.setItem("token", response.data.token);

      if (response.data.token) {
        const userResponse = await axios.get("http://localhost:8080/user", {
          headers: {
            Authorization: `Bearer ${response.data.token}`,
          },
        });

        if (userData.role !== activeRole) {
          setError(
            `Access denied: your account is not authorized as a ${activeRole}. Please select the correct role with the toggle button.`
          );
          localStorage.removeItem("token");
          return;
        }

        setUser(userResponse.data.user); // saves decoded user data in state
        setLoggedIn(true);
        setError("");

        if (activeRole === "employee") {
          navigate("/employee/dashboard");
        } else {
          navigate("/employer/dashboard");
        }
      }
    } catch (err) {
      setError("Login failed.");
    }
  };

  return (
    <div className="login__page">
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
      <div className="login__footer">
        <p>© 2024 SiteCheck - Powered by StructCode Techologies</p>
      </div>
    </div>
  );
}

export default LoginPage;
