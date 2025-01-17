const products = document.querySelectorAll('.product img')
const cartArea = document.querySelector('.cart-area')
const cart = document.getElementById('cart-wrp')
const checkoutButton = document.getElementById('checkout-button')
const positions = ['left', 'center', 'right']

let cartItems = 0
let draggedElement = null
let touchClone = null

// Drag and Drop (для мыши)
products.forEach(product => {
	product.addEventListener('dragstart', dragStart)
	product.addEventListener('dragend', dragEnd)

	product.addEventListener('touchstart', touchStart)
	product.addEventListener('touchmove', touchMove)
	product.addEventListener('touchend', touchEnd)
})

cart.addEventListener('dragover', dragOver)
cart.addEventListener('drop', drop)

// Drag-and-drop для мыши
function dragStart(event) {
	event.dataTransfer.setData('text/plain', event.target.dataset.name)
	event.target.classList.add('dragging')
	draggedElement = event.target
}

function dragEnd(event) {
	event.target.classList.remove('dragging')
	draggedElement = null
}

function dragOver(event) {
	event.preventDefault()
}

function drop(event) {
	event.preventDefault()
	handleDrop(draggedElement)
}

// Touch Events
function touchStart(event) {
	draggedElement = event.target

	touchClone = draggedElement.cloneNode(true)
	touchClone.style.position = 'absolute'
	touchClone.style.pointerEvents = 'none'
	touchClone.style.opacity = '0.7'
	touchClone.style.zIndex = '1000'
	document.body.appendChild(touchClone)

	event.target.classList.add('dragging')
	updateTouchClonePosition(event.touches[0])
}

function touchMove(event) {
	event.preventDefault()
	const touch = event.touches[0]
	updateTouchClonePosition(touch)

	const element = document.elementFromPoint(touch.clientX, touch.clientY)

	if (element && element.id === 'cart') {
		cartArea.classList.add('hovered')
	} else {
		cartArea.classList.remove('hovered')
	}
}

function touchEnd(event) {
	cart.classList.remove('hovered')

	if (touchClone) {
		const touch = event.changedTouches[0]
		const element = document.elementFromPoint(touch.clientX, touch.clientY)

		if (element && element.id === 'cart' && cartItems < 3) {
			handleDrop(draggedElement)
		}

		document.body.removeChild(touchClone)
		touchClone = null
	}

	if (draggedElement) {
		draggedElement.classList.remove('dragging')
		draggedElement = null
	}
}

function updateTouchClonePosition(touch) {
	touchClone.style.left = `${touch.clientX - touchClone.offsetWidth / 2}px`
	touchClone.style.top = `${touch.clientY - touchClone.offsetHeight / 2}px`
}

function handleDrop(draggedProduct) {
	if (cartItems < 3 && draggedProduct) {
		const productClone = draggedProduct.cloneNode(true)
		productClone.removeAttribute('draggable')

		productClone.style.position = 'absolute'

		if (
			productClone.getAttribute('data-name') === 'product1' ||
			productClone.getAttribute('data-name') === 'product2' ||
			productClone.getAttribute('data-name') === 'product8'
		) {
			productClone.style.height = '80%'
		}

		if (
			positions[cartItems] === 'right' &&
			productClone.getAttribute('data-name') === 'product7'
		) {
			productClone.style.left = '50px'
		}

		productClone.style.bottom = '0px'

		productClone.style.zIndex = `${1 + cartItems}`

		cart.appendChild(productClone)

		draggedProduct.style.visibility = 'hidden'

		cartArea.classList.remove('hovered')

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
