import { useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { UserContext } from "./App";
import NavBar from "./NavBar";

export default function RecipeEdit() {
  const { recipeId } = useParams();

  const history = useHistory();

  const {
    recipes,
    setRecipes,
    setView,
    categories,
    userCategories,
    setUserCategories,
    uniqueCategories,
  } = useContext(UserContext);

  const filtered = recipes.filter((rec) => rec.id === parseInt(recipeId));
  const { title, directions, ingredients, category } = filtered[0];

  const [newTitle, setNewTitle] = useState(title);
  const [newDirections, setNewDirections] = useState(directions);
  const [newIngredients, setNewIngredients] = useState(ingredients);
  const [newCategory, setNewCategory] = useState(category.category);
  const [errors, setErrors] = useState([]);

  function handleSub(e) {
    e.preventDefault();
    setErrors([]);
    const newItem = {
      id: parseInt(recipeId),
      title: newTitle,
      directions: newDirections,
      ingredients: newIngredients,
      category: newCategory,
    };

    fetch(`/recipes/${recipeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    }).then((r) => {
      if (r.ok) {
        r.json().then((item) => {
          const returns = recipes.map((rec) => {
            return rec.id !== item.id ? rec : item;
          });
          setRecipes(returns);
          if (newCategory !== category.category) {
            // checks if category was changed
            const categoryCheck = recipes.filter(
              (rec) => rec.category.category === category.category
            );
            if (categoryCheck.length === 1) {
              // checks if recipe is last in category
              uniqueCategories([
                ...userCategories.filter((cat) => cat !== category.category),
                newCategory,
              ]);
            } else {
              setUserCategories([...userCategories, newCategory]);
            }
          }
          setView(item);
          history.push("/home");
        });
      } else {
        r.json().then((err) => {
          const arr = [];
          if (err.error) {
            arr.push(`${err.error}`);
          } else {
            for (const key in err.errors) {
              arr.push(`${key}: ${err.errors[key]}`);
            }
          }
          setErrors(arr);
        });
      }
    });
  }

  function onDelete(item) {
    fetch(`/recipes/${recipeId}`, {
      method: "DELETE",
    })
      .then((r) => r.json())
      .then(() => {
        const deleted = recipes.filter((rec) => rec.id !== parseInt(recipeId));
        if (
          deleted.filter(
            (rec) => rec.category.category === item.category.category
          ).length === 0
        ) {
          // if deleted recipe is the only recipe in a category removes that category
          setUserCategories(
            userCategories.filter((cat) => cat !== item.category.category)
          );
        }
        if (recipes.length === 1) {
          // if deleted recipe is the last recipe
          setUserCategories(["No recipes"]);
        }
        setRecipes(deleted);
        history.push("/home");
      })
      .catch((err) => console.log("Error", err));
  }

  return (
    <div>
      <NavBar />
      <form onSubmit={handleSub}>
        <br />
        <div className="input">
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <br />
          <input
            type="text"
            placeholder="Directions"
            value={newDirections}
            onChange={(e) => setNewDirections(e.target.value)}
          />
          <br />
          <input
            type="text"
            placeholder="Ingredients"
            value={newIngredients}
            onChange={(e) => setNewIngredients(e.target.value)}
          />
          <br />
          <details role="list">
            <summary role="button" aria-haspopup="listbox">
              {newCategory}
            </summary>
            <ul role="listbox">
              {categories.map((cat) => (
                <li key={cat.id} onClick={() => setNewCategory(cat.category)}>
                  {cat.category}
                </li>
              ))}
            </ul>
          </details>
        </div>
        <br />
        <button className="button" type="submit">
          Submit
        </button>
        <br />
      </form>
      <button
        className="button"
        type="button"
        onClick={() => onDelete(filtered[0])}
      >
        Delete recipe
      </button>
      <div className="input">
        {errors.map((err) => (
          <h3>{err}</h3>
        ))}
      </div>
    </div>
  );
}
