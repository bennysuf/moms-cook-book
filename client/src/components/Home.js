import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import { UserContext } from "./App";

export default function Home() {
  const [recipe, setRecipe] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("Category Dropdown");

  const { recipes, userCategories } = useContext(UserContext);

  function handleSub(e) {
    e.preventDefault();
    setRecipe(recipes.filter((r) => r.category.category === currentCategory));
  }

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <NavBar />
        <form className="input" onSubmit={handleSub}>
          <details role="list">
            <summary role="button" aria-haspopup="listbox">
              {currentCategory}
            </summary>
            <ul role="listbox">
              {userCategories.map((cat) => (
                <li
                  key={cat}
                  onClick={() => setCurrentCategory(cat)}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </details>
          <button type="submit">Search</button>
        </form>
        {recipe[0] === undefined ? (
          <h1>No recipes</h1>
        ) : (
          recipe.map((rec) => {
            const { id, title, directions, ingredients } = rec;
            return (
              <>
              <article className="card" key={id}>
                <h2>Title: {title}</h2>
                <p>Directions: {directions}</p>
                <em>Ingredients: {ingredients}</em>
                <br />
                <Link to={`/recipes/${id}`}>Edit</Link>
              </article>
                <br/>
              </>
            );
          })
        )}
      </div>
    </>
  );
}
