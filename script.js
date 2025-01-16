const products = document.querySelectorAll('.product')
const cart = document.getElementById('cart')
const checkoutButton = document.getElementById('checkout-button')
let cartItems = 0

// Drag and Drop
products.forEach(product => {
	product.addEventListener('dragstart', dragStart)
	product.addEventListener('dragend', dragEnd)
})

cart.addEventListener('dragover', dragOver)
cart.addEventListener('drop', drop)

function dragStart(event) {
	event.dataTransfer.setData('text/plain', event.target.dataset.name)
	setTimeout(() => event.target.classList.add('hidden'), 0)
}

function dragEnd(event) {
	event.target.classList.remove('hidden')
}

function dragOver(event) {
	event.preventDefault()
}

function drop(event) {
	event.preventDefault()
	const productName = event.dataTransfer.getData('text/plain')
	const draggedProduct = document.querySelector(`[data-name="${productName}"]`)

	if (cartItems < 3) {
		cart.appendChild(draggedProduct)
		cartItems++
		checkCart()
	}
}

function checkCart() {
	if (cartItems === 3) {
		checkoutButton.classList.remove('hidden')
		checkoutButton.classList.add('visible')
		checkoutButton.addEventListener('click', () => {
			window.location.href = 'https://lavka.yandex.ru'
		})
	}
}
