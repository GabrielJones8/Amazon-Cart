const ball = 75; 
const socks = 15;
const stickers = 5;
const shirt = 50;
const taxRate = 0.07825;

let total = ball + socks + stickers + shirt;
let tax = total * taxRate;
let finalTotal = total + tax;

console.log("Subtotal: $" + total);
console.log("Tax: $" + tax.toFixed(2));
console.log("Final Total: $" + finalTotal.toFixed(2));