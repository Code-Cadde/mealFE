let mealList = document.getElementById("mealList");
let mealInfo = document.getElementById("mealInfo");

let myFavorite = document.getElementById("myFavorite");

myFavorite.addEventListener("click", showFavoriteList);

function searchMeal() {
  let searchInput = document.getElementById("searchInput").value;

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayMealList(data.meals);
    });
}

function displayMealList(meals) {
  mealList.innerHTML = "";

  meals.forEach((meal) => {
    let li = document.createElement("li");
    li.innerText = meal.strMeal;
    li.addEventListener("click", () => {
      console.log("click", meal.strMeal);
      printMealInfo(meal);
    });
    mealList.appendChild(li);
  });

  function printMealInfo(meal) {
    mealInfo.innerHTML = "";

    let mealInfoDiv = document.createElement("div");

    let mealInfoHeadline = document.createElement("h2");
    mealInfoHeadline.innerText = meal.strMeal;

    let mealText = document.createElement("p");
    mealText.innerText = meal.strInstructions;

    let mealImg = document.createElement("img");
    mealImg.style.width = "500px";
    mealImg.src = meal.strMealThumb;

    let addFavoriteButton = document.createElement("button");
    addFavoriteButton.innerText = "Add favorite";
    addFavoriteButton.addEventListener("click", () => {
      addToFavorite(meal);
    });

    mealInfoDiv.append(mealInfoHeadline, mealText, mealImg, addFavoriteButton);

    mealInfo.appendChild(mealInfoDiv);
  }

  function addToFavorite(meal) {
    fetch("http://localhost:8080/meal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(meal),
    });
  }
}

function showFavoriteList() {
  fetch("http://localhost:8080/meals")
    .then((res) => res.json())
    .then((data) => {
      displayFavoriteMeals(data);
    });
}

function displayFavoriteMeals(meals) {
  let favoriteListHeadliner = document.createElement("h2");
  favoriteListHeadliner.innerText = "Dina favoriter: ";

  let favoriteDiv = document.getElementById("favoriteDiv");

  let favoriteList = document.getElementById("favoriteList");

  favoriteList.innerHTML = "";
  mealInfo.innerHTML = "";
  favoriteDiv.innerHTML = "";

  meals.forEach((meal) => {
    let listItem = document.createElement("li");

    let deleteButton = document.createElement("button");
    deleteButton.innerText = "[X]";

    listItem.innerText = meal.strMeal;
    favoriteDiv.appendChild(favoriteListHeadliner);
    listItem.appendChild(deleteButton);
    favoriteList.appendChild(listItem);

    deleteButton.addEventListener("click", () => {
      let mealId = meal.id;

      fetch(`http://localhost:8080/meal/${mealId}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(
            "Måltiden med ID " + mealId + " har raderats från databasen."
          );
          listItem.innerHTML = "";
        });
    });
  });
}
