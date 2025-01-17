const products = document.querySelectorAll('.product img')
const cart = document.getElementById('cart')
const checkoutButton = document.getElementById('checkout-button')
let cartItems = 0
let draggedElement = null // Для хранения текущего перетаскиваемого элемента
let touchClone = null // Клон элемента для тачскрина

// Позиции для изображений в корзине
const positions = ['left', 'center', 'right']

// Drag and Drop (для мыши)
products.forEach(product => {
	// События для мыши
	product.addEventListener('dragstart', dragStart)
	product.addEventListener('dragend', dragEnd)

	// События для тачскрина
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

	// Создаем временный клон элемента, чтобы двигать его с пальцем
	touchClone = draggedElement.cloneNode(true)
	touchClone.style.position = 'absolute'
	touchClone.style.pointerEvents = 'none' // Отключаем взаимодействие с клоном
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

	// Проверяем, находится ли палец над корзиной
	const element = document.elementFromPoint(touch.clientX, touch.clientY)
	if (element && element.id === 'cart') {
		cart.classList.add('hovered') // Добавляем эффект наведения
	} else {
		cart.classList.remove('hovered')
	}
}

function touchEnd(event) {
	cart.classList.remove('hovered')
	if (touchClone) {
		// Проверяем, был ли элемент сброшен в корзину
		const touch = event.changedTouches[0]
		const element = document.elementFromPoint(touch.clientX, touch.clientY)
		if (element && element.id === 'cart') {
			handleDrop(draggedElement)
		}

		// Удаляем временный клон
		document.body.removeChild(touchClone)
		touchClone = null
	}

	if (draggedElement) {
		draggedElement.classList.remove('dragging')
		draggedElement = null
	}
}

// Обновляем позицию временного клона
function updateTouchClonePosition(touch) {
	touchClone.style.left = `${touch.clientX - touchClone.offsetWidth / 2}px`
	touchClone.style.top = `${touch.clientY - touchClone.offsetHeight / 2}px`
}

// Обработка сброса элемента
function handleDrop(draggedProduct) {
	if (cartItems < 3 && draggedProduct) {
		const productClone = draggedProduct.cloneNode(true)
		productClone.removeAttribute('draggable')

		// Установить позицию в корзине
		productClone.style.position = 'absolute'

		if (positions[cartItems] === 'left') {
			productClone.style.left = '-59px'
		} else if (positions[cartItems] === 'center') {
			productClone.style.width = '56%'
			productClone.style.height = '85%'
			productClone.style.transform = `rotate(10deg)`
		} else if (positions[cartItems] === 'right') {
			productClone.style.left = '50px'
			productClone.style.width = '42%'
			productClone.style.height = '54%'
			productClone.style.transform = `rotate(-23deg)`
		}

		productClone.style.bottom = '0px'

		// Добавить клон в корзину
		cart.appendChild(productClone)

		// Скрыть оригинал на полке
		draggedProduct.style.visibility = 'hidden'

		// Увеличить количество элементов в корзине
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
