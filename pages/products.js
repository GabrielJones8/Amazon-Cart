(function () {
	const money = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD"
	});

	function updateCartHeader(cartItems) {
		const cartCount = document.querySelector("#cart-count");
		const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

		if (cartCount) {
			cartCount.textContent = totalCount;
		}
	}

	function saveCart(cartItems) {
		window.cartStorage.saveCart(cartItems);
		updateCartHeader(cartItems);
	}

	function renderProductAction(product, cartItems, action) {
		const existingProduct = cartItems.find((item) => item.id === product.id);
		action.replaceChildren();

		if (!existingProduct) {
			const addButton = document.createElement("button");
			addButton.type = "button";
			addButton.className = "add-to-cart";
			addButton.textContent = "Add to cart";
			addButton.addEventListener("click", function () {
				cartItems.push({ ...product, quantity: 1 });
				saveCart(cartItems);
				renderProductAction(product, cartItems, action);
			});
			action.append(addButton);
			return;
		}

		const controls = document.createElement("div");
		const decreaseButton = document.createElement("button");
		const quantity = document.createElement("span");
		const increaseButton = document.createElement("button");

		controls.className = "quantity-control";
		decreaseButton.type = "button";
		decreaseButton.textContent = "−";
		decreaseButton.setAttribute("aria-label", `Remove one ${product.name}`);
		decreaseButton.addEventListener("click", function () {
			existingProduct.quantity -= 1;
			if (existingProduct.quantity === 0) {
				cartItems.splice(cartItems.indexOf(existingProduct), 1);
			}
			saveCart(cartItems);
			renderProductAction(product, cartItems, action);
		});

		quantity.className = "quantity-value";
		quantity.textContent = existingProduct.quantity;
		quantity.setAttribute("aria-live", "polite");

		increaseButton.type = "button";
		increaseButton.textContent = "+";
		increaseButton.setAttribute("aria-label", `Add one ${product.name}`);
		increaseButton.addEventListener("click", function () {
			existingProduct.quantity += 1;
			saveCart(cartItems);
			renderProductAction(product, cartItems, action);
		});

		controls.append(decreaseButton, quantity, increaseButton);
		action.append(controls);
	}

	function createProductCard(product, cartItems) {
		const card = document.createElement("article");
		const name = document.createElement("h3");
		const price = document.createElement("p");
		const action = document.createElement("div");

		card.className = "product-card";
		name.textContent = product.name;
		price.className = "product-price";
		price.textContent = money.format(product.price);
		action.className = "product-action";
		renderProductAction(product, cartItems, action);

		card.append(name, price, action);
		return card;
	}

	document.addEventListener("DOMContentLoaded", function () {
		const productList = document.querySelector("#product-list");
		const cartItems = window.cartStorage.loadCart();

		if (!productList || !Array.isArray(window.products)) {
			return;
		}

		window.products.forEach((product) => {
			productList.append(createProductCard(product, cartItems));
		});
		updateCartHeader(cartItems);
	});
})();
