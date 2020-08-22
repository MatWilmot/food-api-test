$(document).ready(function () {
  const appID = "ab590b46";
  const appKey = "dabc414751363fff3aa8909d8747b8ba";
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

  const searchNutrients = (id) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "POST",
        url: `https://api.edamam.com/api/food-database/v2/nutrients?app_id=${appID}&app_key=${appKey}`,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
          ingredients: [
            {
              quantity: 100,
              measureURI:
                "http://www.edamam.com/ontologies/edamam.owl#Measure_gram",
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
    .then((food) => searchNutrients(food))
    .then((nutrients) => console.log(nutrients));
});