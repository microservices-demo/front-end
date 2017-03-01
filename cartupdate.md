# Update Cart modifications

## front-end/api/cart/index.js

  added new route /cart/update to app

  app.post("/cart/update", function (req, res, next)

## front-end/public/js/client.js

  added new function

  updateToCart(id, quantity, next)
  
## front-end/public/basket.html

  added new function
  
  updateCart()
  
  - for each item row in cart table call updateToCart (client.js - updateToCart(id, quantity, next))
  
  line:102   `<a class="btn btn-default" onclick="updateCart();"><i`
  
  - connected update button click to function updateCart()
  
  ammended $(document).ready(function ()
  
  line:382   `<td id="' + element.itemId + '">\`
  line:383       `<input type="number" min="1" value="' + element.quantity + '" class="form-control">\`
  
  - this adds catalogue itemId to quantity input box to be retrieved when iterating cart items for updateCart() routine
  - also changed to min="1" from min="0" as 0 is obviously impossible and will cause problems later on
