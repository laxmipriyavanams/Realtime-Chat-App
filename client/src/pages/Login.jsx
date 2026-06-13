import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleLogin = async () => {
  try {
    const res = await fetch(
      "http://localhost:3001/login",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data =
      await res.json();

    alert(data.message);

    if (res.ok) {
  localStorage.setItem(
    "isLoggedIn",
    "true"
  );

  localStorage.setItem(
    "user",
    JSON.stringify(data.user)
  );

  navigate("/chat");
}
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="container">
      <h1>Login</h1>

      <input
  type="email"
  placeholder="Enter Email"
  value={email}
  onChange={(e) =>
    setEmail(e.target.value)
  }
/>
      <input
  type="password"
  placeholder="Enter Password"
  value={password}
  onChange={(e) =>
    setPassword(e.target.value)
  }
/>

      <button onClick={handleLogin}>
  Login
</button>

      <p>
        Don’t have an account? <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
}

export default Login;