(function () {
	const cartStorageKey = "orbit-ball-cart";

	function loadCart() {
		try {
			const storedCart = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
			return Array.isArray(storedCart) ? storedCart : [];
		} catch {
			return [];
		}
	}

	function saveCart(cartItems) {
		try {
			localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
			return true;
		} catch {
			return false;
		}
	}

	window.cartStorage = { loadCart, saveCart };
})();
