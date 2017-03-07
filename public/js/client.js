function login() {
    var username = $('#username-modal').val();
    var password = $('#password-modal').val();
    $.ajax({
        url: "login",
        type: "GET",
        async: false,
        success: function (data, textStatus, jqXHR) {
            $("#login-message").html('<div class="alert alert-success">Login successful.</div>');
            console.log('posted: ' + textStatus);
            console.log("logged_in cookie: " + $.cookie('logged_in'));
            setTimeout(function(){
                location.reload();
            }, 1500);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#login-message").html('<div class="alert alert-danger">Invalid login credentials.</div>');
            console.log('error: ' + JSON.stringify(jqXHR));
            console.log('error: ' + textStatus);
            console.log('error: ' + errorThrown);
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
        }
    });
    return false;
}

function register() {
    var username = $('#register-username-modal').val();
    var email = $('#register-email-modal').val();
    var password = $('#register-password-modal').val();
    var firstName = $('#register-first-modal').val();
    var lastName = $('#register-last-modal').val();
    var postvals = JSON.stringify({
		"username": username,
		"password": password,
		"email": email,
		"firstName": firstName,
		"lastName": lastName
	});
	console.log(postvals);
    $.ajax({
        url: "register",
        type: "POST",
        async: false,
	data: postvals,
        success: function (data, textStatus, jqXHR) {
            $("#registration-message").html('<div class="alert alert-success">Registration and login successful.</div>');
            console.log('posted: ' + textStatus);
            console.log("logged_in cookie: " + $.cookie('logged_in'));
            setTimeout(function(){
                location.reload();
            }, 1500);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#registration-message").html('<div class="alert alert-danger">There was a problem with your registration: ' + errorThrown + '</div>');
            console.log('error: ' + JSON.stringify(jqXHR));
            console.log('error: ' + textStatus);
            console.log('error: ' + errorThrown);
        },
    });
    return false;
}

function logout() {
    $.removeCookie('logged_in');
    location.reload();
}

function setNewPageSize(value) {
    location.search = $.query.set("page", 1).set("size", value);
}

function setNewPage(value) {
    location.search = $.query.set("page", value);
}

function setNewTags(value) {
    location.search = $.query.set("tags", value);
}

function resetTags() {
    location.search = $.query.remove("tags");
}

function order() {
    if (!$.cookie('logged_in')) {
        $("#user-message").html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> You must be logged in to place an order.</div>');
        return false;
    }

    var success = false;
    $.ajax({
        url: "orders",
        type: "POST",
        async: false,
        success: function (data, textStatus, jqXHR) {
            if (jqXHR.status == 201) {
                console.log("Order placed.");
                $("#user-message").html('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> Order placed.</div>');
                deleteCart();
                success = true;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            response_payload = JSON.parse(jqXHR.responseText)
            console.log('error: ' + jqXHR.responseText);
            if (jqXHR.status == 406) {
                $("#user-message").html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> Error placing order. ' + response_payload.message + '</div>');
            }
        }
    });
    return success;
}

function deleteCart() {
    $.ajax({
        url: "cart",
        type: "DELETE",
        async: true,
        success: function (data, textStatus, jqXHR) {
            console.log("Cart deleted.");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error: ' + JSON.stringify(jqXHR));
            console.log('error: ' + textStatus);
            console.log('error: ' + errorThrown);
        }
    });
}

function addToCart(id) {
    console.log("Sending request to add to cart: " + id);
    $.ajax({
        url: "cart",
        type: "POST",
        data: JSON.stringify({"id": id}),
        success: function (data, textStatus, jqXHR) {
            console.log('Item added: ' + id + ', ' + textStatus);
            location.reload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Could not add item: ' + id + ', due to: ' + textStatus + ' | ' + errorThrown);
        }
    });
}

// function update To Cart(itemId, quantity, callback)
// cart/update request sent to frontend server (index.js - app.post("/cart/update" function...)
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

function username(id, callback) {
    console.log("Requesting user account information " + id);
    $.ajax({
        url: "customers/" + id,
        type: "GET",
        success: function (data, textStatus, jqXHR) {
            json = JSON.parse(data);
            if (json.status_code !== 500) {
                callback(json.firstName + " " + json.lastName);
            } else {
                console.error('Could not get user information: ' + id + ', due to: ' + json.status_text + ' | ' + json.error);
                return callback(undefined);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Could not get user information: ' + id + ', due to: ' + textStatus + ' | ' + errorThrown);
        }
    });
}

function address() {
    var data = {
        "number": $("#form-number").val(),
        "street": $("#form-street").val(),
        "city": $("#form-city").val(),
        "postcode": $("#form-post-code").val(),
        "country": $("#form-country").val()
    };
    $.ajax({
        url: "addresses",
        type: "POST",
        async: false,
        data: JSON.stringify(data),
        success: function (data, textStatus, jqXHR) {
            location.reload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#user-message").html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> Error saving the address. ' + errorThrown + '</div>');
            console.log('error: ' + JSON.stringify(jqXHR));
            console.log('error: ' + textStatus);
            console.log('error: ' + errorThrown);
        },
    });
    return false;
}

function card() {
    var data = {
        "longNum": $("#form-card-number").val(),
        "expires": $("#form-expires").val(),
        "ccv": $("#form-ccv").val()
    };
    $.ajax({
        url: "cards",
        type: "POST",
        async: false,
        data: JSON.stringify(data),
        success: function (data, textStatus, jqXHR) {
            location.reload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#user-message").html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> Error saving the creditcard. ' + errorThrown + '</div>');
            console.log('error: ' + JSON.stringify(jqXHR));
            console.log('error: ' + textStatus);
            console.log('error: ' + errorThrown);
        },
    });
    return false;
}
