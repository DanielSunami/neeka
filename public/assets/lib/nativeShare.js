document.addEventListener('DOMContentLoaded', function () {

	if (navigator.share) {
		[].map.call(document.querySelectorAll('button.native-share'), function(button) {
			button.parentElement.classList.remove('display-none');

			button.onclick = function() {
				navigator.share({
					title: button.getAttribute('data-title'),
					url: button.getAttribute('data-url')
				})
			}
		});
	}
});
