# Update Cart modifications

## front-end/api/cart/index.js

  - added new route /cart/update to app
```
  app.post("/cart/update", fun -  - ction (req, res, next)
```
## front-end/public/js/client.js

  - added new function  updateToCart
```
  updateToCart(id, quantity, next)
 ```
## front-end/public/basket.html

- added new function  updateCart
  ```
  function updateCart() {
		console.log("Updating Cart");
		var cartsize = document.getElementById("cart-list").rows.length;
		console.log("cart-list size: " + cartsize);

		var idx = 0;
		next = function(){
			if (idx< cartsize) {
				var id = document.getElementById("cart-list").rows[idx].cells[2].id;
				var quantity = document.getElementById("cart-list").rows[idx].cells[2].getElementsByTagName('input')[0].value;
				idx++;
				updateToCart(id, quantity, next);
			}
			else {
				location.reload();
			}
		}
		next();
	}
  ```
  
  for each item row in cart table call updateToCart (client.js - updateToCart(id, quantity, next))
  
- connected update button click to function updateCart()

  line:102   `<a class="btn btn-default" onclick="updateCart();"><i`
  
- ammended $(document).ready(function ()
  
  line:382   `<td id="' + element.itemId + '">\`
  
  line:383       `<input type="number" min="1" value="' + element.quantity + '" class="form-control">\`
  
  this adds catalogue itemId to quantity input box to be retrieved when iterating cart items for updateCart() routine
  
  also changed to min="1" from min="0" as 0 is obviously impossible and will cause problems later on
