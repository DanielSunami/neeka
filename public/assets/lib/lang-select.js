(function() {
	const select = document.querySelector('select');
	const options = Array.from(select.options);
	const input = document.querySelector('input');
	
	function findMatches (search, options) {
		return options.filter(function(option) {
			const regex = new RegExp(search, 'gi');
			return option.text.match(regex);
		});
	}
	
	function filterOptions () {
		options.forEach(function(option) { 
			option.remove();
			option.selected = false;
		});

		const matchArray = findMatches(this.value, options);
		select.append(...matchArray);
	}
	
	input.addEventListener('change', filterOptions);
	input.addEventListener('keyup', filterOptions);
})();