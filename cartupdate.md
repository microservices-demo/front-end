# Update Cart modifications

## front-end/api/cart/index.js

  - added new route /cart/update to app
```
    app.post("/cart/update", function (req, res, next) {
    console.log("Attempting to update cart item: " + JSON.stringify(req.body));
    
    if (req.body.id == null) {
      next(new Error("Must pass id of item to update"), 400);
      return;
    }
    if (req.body.quantity == null) {
      next(new Error("Must pass quantity to update"), 400);
      return;
    }
    var custId = helpers.getCustomerId(req, app.get("env"));

    async.waterfall([
        function (callback) {
          request(endpoints.catalogueUrl + "/catalogue/" + req.body.id.toString(), function (error, response, body) {
            console.log(body);
            callback(error, JSON.parse(body));
          });
        },
        function (item, callback) {
          var options = {
            uri: endpoints.cartsUrl + "/" + custId + "/items",
            method: 'PATCH',
            json: true,
            body: {itemId: item.id, quantity: parseInt(req.body.quantity), unitPrice: item.price}
          };
          console.log("PATCH to carts: " + options.uri + " body: " + JSON.stringify(options.body));
          request(options, function (error, response, body) {
            if (error) {
              callback(error)
                return;
            }
            callback(null, response.statusCode);
          });
        }
    ], function (err, statusCode) {
      if (err) {
        return next(err);
      }
      if (statusCode != 202) {
        return next(new Error("Unable to add to cart. Status code: " + statusCode))
      }
      helpers.respondStatus(res, statusCode);
    });
  });
```
## front-end/public/js/client.js

  - added new function  updateToCart
```
  function updateToCart(id, quantity, next) {

	console.log("Sending request to update cart: item: " + id + " quantity: " + quantity);
    $.ajax({
        url: "cart/update",
        type: "POST",
        data: JSON.stringify({"id": id, "quantity": quantity}),
        success: function (data, textStatus, jqXHR) {
            console.log('Item updated: ' + id + ', ' + textStatus);
            next();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Could not update item: ' + id + ', due to: ' + textStatus + ' | ' + errorThrown);
            next();
        }
    });
}
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
