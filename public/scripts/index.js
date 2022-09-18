// http://localhost:1337/api/orders?populate[meals][populate][0]=size,base,sauce,extras,garniture

// data.js
let jwt = "";

function extraItem(extra) {
    return `<li> ${extra.attributes.name} </li>`;
}

function mealHtml(meal) {
    console.log('the meal', meal);
return `
base: ${meal.attributes.base.data.attributes.name}<br/>
size: ${meal.attributes.size.data.attributes.name}<br/>
garniture: ${meal.attributes.garniture.data.attributes.name}<br/>
sauce: ${meal.attributes.sauce.data.attributes.name}<br/>
doube sauce: ${meal.attributes.doubleSauce ? "Yes" : "No"}<br/>
extras: 
<ul>
    ${meal.attributes.extras.data.map(e => extraItem(e)).join("")}
</ul>

`;
}

function calculateMealPrice(meal) {
    let price = meal.attributes.size.data.attributes.price;
    price += meal.attributes.garniture.data.attributes.price;
    if (meal.attributes.doubleSauce === true) {
        price += 0.8
    }
    price += meal.attributes.extras.data.length * 0.7;
    return price;
}

function calculateOrderPrice(order) {
   let price = 0;
   order.attributes.meals.data.forEach(m => price += calculateMealPrice(m));
   return price;
}

function orderContainer(order) {
    const el = document.createElement('div');
    if (order.attributes.completed) {
        return el;
    }
    console.log('the order', order);
    el.innerHTML = `
    Order - ${new Date(order.attributes.orderTime).toLocaleString()}
    <br/>
    ${order.attributes.meals.data.map(m => mealHtml(m)).join("<br/>")}
    Total price: ${calculateOrderPrice(order)}$
    `;
    el.className = "order-container";
    return el;
}

async function getOrders () {
    const response = await fetch ("/api/orders?populate[meals][populate][0]=size,base,sauce,extras,garniture", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    });
    const result = await response.json();
    const orders = result.data;
    console.log(orders);

    const cont = document.getElementById("container");
    orders.forEach(o => cont.append(orderContainer(o)));
}

async function loadPage() {
    const username = prompt("username");
    const password = prompt("password");
    const result = await fetch("/api/auth/local", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: JSON.stringify({ identifier: username, password: password})
    });
    const body = await result.json();
    console.log('the JWT token:', body.jwt);
    jwt = body.jwt;
    console.log('the result of the fetch', body);

    await getOrders();
}
loadPage();