import "./App.css";

function App() {
  function navigate(url: string) {
    window.location.href = url;
  }

  async function auth() {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/auth/authorize",
        {
          method: "POST",
        }
      );

      const data = await response.json();
      navigate(data.url);
    } catch (error) {
      console.error("Auth error:", error);
    }
  }

  async function getGreetings() {
    try {
      const response = await fetch("http://localhost:3000/api/v1/hello", {
        method: "GET",
        credentials: "include",
      }).then((res) => res.json());

      if (response.error) {
        alert(response.error);
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Alert: " + error);
    }
  }

  return (
    <div className="main-container">
      <h1>OAuth2</h1>
      <div className="button-container">
        <button type="button" onClick={() => auth()}>
          Sign in with Google
        </button>
        <button type="button" onClick={() => getGreetings()}>
          Greetings from server
        </button>
      </div>
    </div>
  );
}

export default App;
