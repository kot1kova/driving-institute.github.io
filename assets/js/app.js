gsap.registerPlugin(ScrollTrigger)

const sections = document.querySelectorAll('section')
sections.forEach(section => {
	gsap.from(section, {
		opacity: 0,
		y: 100,
		duration: 0.7,
		scrollTrigger: {
			trigger: section,
			start: 'top 88%',
			end: 'bottom bottom',
			toggleActions: 'play none none none',
			// markers: true,
		},
	})
})

gsap
	.timeline({
		scrollTrigger: {
			trigger: '.taxi',
			start: 'top 80%',
			// end: "bottom bottom",
			end: 'bottom 60%',
			toggleActions: 'play none none none',
			// markers: true,
		},
	})
	.from('.taxi__content', {
		opacity: 0,
		y: 70,
		duration: 0.5,
		ease: 'power2.out',
	})
	.from(
		'#car',
		{
			opacity: 0,
			x: -100,
			duration: 1,
			ease: 'power2.out',
		},
		'+=0.2'
	)

gsap
	.timeline({
		scrollTrigger: {
			trigger: '.certificate',
			start: 'top 80%',
			// end: "bottom bottom",
			end: 'bottom 60%',
			toggleActions: 'play none none none',
			// markers: true,
		},
	})
	.from('.certificate__info', {
		opacity: 0,
		y: 70,
		duration: 0.5,
		ease: 'power2.out',
	})

	.from(
		'#car_two',
		{
			opacity: 0,
			// y: 100,
			scale: 0.5,
			duration: 1.5,
			ease: 'power2.out',
		},
		'+=0.2'
	)
	.from('#car_light', {
		opacity: 0,
		// y: 100,
		// scale: 0.5,
		duration: 3,
		// ease: 'power2.out',
	},'+=0.4')

class HandwrittenSlogan {
	constructor(element, slogans) {
		this.element = element
		this.slogans = slogans
		this.currentIndex = 0
		this.isWriting = false
		this.cursor = null
		this.init()
	}

	init() {
		this.createCursor()
		this.startCycle()
	}

	createCursor() {
		this.cursor = document.createElement('span')
		this.cursor.className = 'writing-cursor'
		this.cursor.innerHTML = '|'
	}

	async startCycle() {
		while (true) {
			const currentSlogan = this.slogans[this.currentIndex]

			// Write the slogan
			await this.writeText(currentSlogan)

			// Pause to show completed text
			await this.delay(2000)

			// Erase the slogan
			await this.eraseText()

			// Brief pause before next slogan
			await this.delay(500)

			// Move to next slogan
			this.currentIndex = (this.currentIndex + 1) % this.slogans.length
		}
	}

	measureTextWidth(text) {
		// Create a temporary element to measure text width
		const tempElement = document.createElement('span')
		tempElement.style.visibility = 'hidden'
		tempElement.style.position = 'absolute'
		tempElement.style.whiteSpace = 'nowrap'
		tempElement.style.fontSize = window.getComputedStyle(this.element).fontSize
		tempElement.style.fontFamily = window.getComputedStyle(
			this.element
		).fontFamily
		tempElement.style.fontWeight = window.getComputedStyle(
			this.element
		).fontWeight
		tempElement.textContent = text
		document.body.appendChild(tempElement)

		const width = tempElement.offsetWidth
		document.body.removeChild(tempElement)
		return width
	}

	getCurrentLineText() {
		const chars = Array.from(this.element.querySelectorAll('.char'))
		const lastLineBreak = chars.lastIndexOf(
			chars.find(char => char.textContent === '\n')
		)
		const currentLineChars =
			lastLineBreak >= 0 ? chars.slice(lastLineBreak + 1) : chars
		return currentLineChars.map(char => char.textContent).join('')
	}

	addLineBreak() {
		const breakSpan = document.createElement('br')
		this.element.insertBefore(breakSpan, this.cursor)
	}

	async writeText(text) {
		this.isWriting = true
		this.element.innerHTML = ''
		this.cursor.classList.add('active')
		this.element.appendChild(this.cursor)

		const words = text.split(' ')
		const containerWidth = this.element.offsetWidth || 580 // fallback to 580px

		for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
			const currentWord = words[wordIndex]

			// Get current line content
			const currentLineText = this.getCurrentLineText()

			// Check if adding this word (with space if needed) would exceed container width
			const testText =
				currentLineText + (currentLineText ? ' ' : '') + currentWord
			const testWidth = this.measureTextWidth(testText)

			// If word doesn't fit and we have content on current line, add line break
			if (testWidth > containerWidth && currentLineText.trim() !== '') {
				this.addLineBreak()
				await this.delay(200) // Small pause for line break
			} else if (wordIndex > 0) {
				// Add space before word (except for first word or after line break)
				const spaceSpan = document.createElement('span')
				spaceSpan.className = 'char'
				spaceSpan.textContent = '\u00A0' // Non-breaking space

				this.element.insertBefore(spaceSpan, this.cursor)
				spaceSpan.classList.add('writing')

				await this.delay(100)
			}

			// Write the word character by character
			for (let charIndex = 0; charIndex < currentWord.length; charIndex++) {
				const char = currentWord[charIndex]
				const charSpan = document.createElement('span')
				charSpan.className = 'char'
				charSpan.textContent = char

				// Insert before cursor
				this.element.insertBefore(charSpan, this.cursor)

				// Trigger writing animation
				charSpan.classList.add('writing')

				// Variable delay for more natural writing
				const delay = Math.random() * 100 + 50
				await this.delay(delay)
			}
		}

		this.cursor.classList.remove('active')
		this.isWriting = false
	}

	async eraseText() {
		const chars = this.element.querySelectorAll('.char')
		this.cursor.classList.add('active')

		// Erase from right to left
		for (let i = chars.length - 1; i >= 0; i--) {
			chars[i].classList.add('erasing')

			// Variable delay for natural erasing
			const delay = Math.random() * 50 + 30
			await this.delay(delay)
		}

		// Clear all content
		this.element.innerHTML = ''
		this.cursor.classList.remove('active')
	}

	delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms))
	}
}
// Initialize the handwritten slogans
function initHandwrittenSlogans() {
	const slogans = [
		'Одне тренування - і паніка більше не варіант',
		'90 хвилин - і екстрим під твоїм контролем',
		'Одне заняття - і твої рефлекси швидше',
	]

	const sloganElement = document.getElementById('slogan')
	if (sloganElement) {
		new HandwrittenSlogan(sloganElement, slogans)
	}
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initHandwrittenSlogans)
} else {
	initHandwrittenSlogans()
}
