import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleSignup = async () => {
  try {
    const res = await fetch(
      "https://realtime-chat-app-production-e26c.up.railway.app/signup",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      }
    );

    const data =
      await res.json();

    alert(data.message);

    if (res.ok) {
      navigate("/chat");
    }
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="container">
      <h1>Signup</h1>

      <input
  type="text"
  placeholder="Enter Name"
  value={username}
  onChange={(e) =>
    setUsername(e.target.value)
  }
/>
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
      <button onClick={handleSignup}>
  Signup
</button>

      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default Signup;