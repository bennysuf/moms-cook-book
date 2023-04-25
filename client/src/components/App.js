import React, { useEffect, useState, createContext } from "react";
import { Route, useHistory } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import NewRecipe from "./NewRecipe";
import RecipePage from "./RecipePage";
import "@picocss/pico/css/pico.min.css";

export const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [recipe, setRecipe] = useState([]);
  const [view, setView] = useState("");

  const history = useHistory();

  useEffect(() => {
    fetch("/user").then((r) => {
      if (r.ok) {
        r.json().then((user) => {
          setUser(user);
          setRecipe(user.recipes);
        });
      } else {
        history.push("/login");
      }
    });
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, recipe, setRecipe, view, setView }}
    >
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      {/* not in ternary so if signed in, cant access login */}
      {!user ? (
        <> </>
      ) : (
        <>
          <Route path="/home" component={Home} />
          <Route path="/recipes" component={RecipePage} />
          <Route path="/add-new" component={NewRecipe} />
        </>
      )}
    </UserContext.Provider>
  );
}

export default App;
//! export error is from react-script old version

// TODO: validate category (custom validation)

// TODO categories rendering
