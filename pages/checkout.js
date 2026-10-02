(function () {
	const estimatedShipping = 5.99;
	const money = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD"
	});

	function createElement(tagName, className, text) {
		const element = document.createElement(tagName);
		if (className) {
			element.className = className;
		}
		if (text !== undefined) {
			element.textContent = text;
		}
		return element;
	}

	function renderCheckout(cartItems) {
		const checkoutView = document.querySelector("#checkout-view");
		const cartCount = document.querySelector("#cart-count");		
		if (!checkoutView) {
			return;
		}

		const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
		if (cartCount) {
			cartCount.textContent = totalQuantity;
		}

		checkoutView.replaceChildren();
		checkoutView.append(createElement("h2", "checkout-title", "Your cart"));

		const layout = createElement("div", "checkout-layout");
		const itemsSection = createElement("div", "cart-items");

		if (cartItems.length === 0) {
			itemsSection.append(createElement("p", "empty-cart", "Your cart is empty."));
			const productsLink = createElement("a", "continue-shopping", "Continue shopping");
			productsLink.href = "index.html";
			itemsSection.append(productsLink);
		} else {
			cartItems.forEach((item) => {
				const row = createElement("article", "cart-item");
				const details = createElement("div", "cart-item-details");
				const name = createElement("h3", "cart-item-name", item.name);
				const unitPrice = createElement("p", "cart-unit-price", `${money.format(item.price)} each`);
				const controls = createElement("div", "checkout-quantity-control");
				const decreaseButton = createElement("button", "quantity-button", "−");
				const quantity = createElement("span", "quantity-value", item.quantity);
				const increaseButton = createElement("button", "quantity-button", "+");
				const removeButton = createElement("button", "remove-item", "Remove");
				const subtotal = createElement("p", "cart-item-subtotal", money.format(item.price * item.quantity));

				decreaseButton.type = "button";
				decreaseButton.disabled = item.quantity <= 1;
				decreaseButton.setAttribute("aria-label", `Decrease ${item.name} quantity`);
				decreaseButton.addEventListener("click", function () {
					changeQuantity(item.id, -1, cartItems);
				});

				quantity.setAttribute("aria-label", `Quantity: ${item.quantity}`);

				increaseButton.type = "button";
				increaseButton.setAttribute("aria-label", `Increase ${item.name} quantity`);
				increaseButton.addEventListener("click", function () {
					changeQuantity(item.id, 1, cartItems);
				});

				removeButton.type = "button";
				removeButton.addEventListener("click", function () {
					const itemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);
					if (itemIndex !== -1) {
						cartItems.splice(itemIndex, 1);
						saveAndRender(cartItems);
					}
				});

				controls.append(decreaseButton, quantity, increaseButton);
				details.append(name, unitPrice, controls, removeButton);
				row.append(details, subtotal);
				itemsSection.append(row);
			});
		}

		const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
		const shipping = cartItems.length > 0 ? estimatedShipping : 0;
		const summary = createElement("aside", "order-summary");
		summary.append(createElement("h2", "summary-title", "Order summary"));
		const summaryRows = createElement("dl", "summary-rows");
		summaryRows.append(
			createSummaryRow("Items subtotal", money.format(subtotal)),
			createSummaryRow("Estimated shipping", money.format(shipping)),
			createSummaryRow("Total", money.format(subtotal + shipping), "summary-total")
		);
		summary.append(summaryRows);
		layout.append(itemsSection, summary);
		checkoutView.append(layout);
	}

	function createSummaryRow(label, value, className) {
		const row = createElement("div", className || "summary-row");
		row.append(createElement("dt", "", label), createElement("dd", "", value));
		return row;
	}

	function changeQuantity(productId, amount, cartItems) {
		const item = cartItems.find((cartItem) => cartItem.id === productId);
		if (!item) {
			return;
		}

		item.quantity += amount;
		if (item.quantity <= 0) {
			cartItems.splice(cartItems.indexOf(item), 1);
		}
		saveAndRender(cartItems);
	}

	function saveAndRender(cartItems) {
		window.cartStorage.saveCart(cartItems);
		renderCheckout(cartItems);
	}

	document.addEventListener("DOMContentLoaded", function () {
		renderCheckout(window.cartStorage.loadCart());
	});
})();
