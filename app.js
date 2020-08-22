$(document).ready(function () {
  const appID = "ab590b46";
  const appKey = "dabc414751363fff3aa8909d8747b8ba";

  $("#submit").on("click", (e) => {
    e.preventDefault();
    let food = $("#food").val();
    // quantity is a STRING, parseInt makes it a number
    let quantity = parseInt($("#amount").val());
    let unit = $("#unit").val();

    console.log({
      food: food,
      qty: quantity,
      unit: unit,
    });

    searchFood(food)
      .then((food) => searchNutrients(food, quantity, unit))
      .then((nutrients) => console.log(nutrients));
  });

  // takes a string and returns the food_id
  const searchFood = (item) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        url: `https://api.edamam.com/api/food-database/v2/parser?app_id=${appID}&app_key=${appKey}&ingr=${item}`,
      })
        .then((res) => {
          resolve(res.parsed[0].food.foodId);
        })
        .catch((err) => reject(err));
    });
  };

  // Takes the food_id returned from 'searchFood()' and uses it to get detailed nutritional info
  const searchNutrients = (id, qty, unit) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "POST",
        url: `https://api.edamam.com/api/food-database/v2/nutrients?app_id=${appID}&app_key=${appKey}`,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
          ingredients: [
            {
              quantity: qty,
              measureURI: `http://www.edamam.com/ontologies/edamam.owl#Measure_${unit}`,
              foodId: id,
            },
          ],
        }),
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => reject(err));
    });
  };

  searchFood("scrambled eggs")
    .then((food) => searchNutrients(food, 100, "gram"))
    .then((nutrients) => console.log(nutrients));
});
