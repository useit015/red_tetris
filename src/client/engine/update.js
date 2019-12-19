
const dropInterval = 300
let [dropCounter, start] = [0, Date.now()]

export default x => {
	const end = Date.now()
	const delta = end - start
	start = end
	dropCounter += delta
	if (dropCounter > dropInterval) {
		dropCounter = 0
		return x + 1
	}
	return x
}
