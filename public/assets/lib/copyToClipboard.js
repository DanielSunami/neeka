document.addEventListener('DOMContentLoaded', function () {
	function copyToClipboard(text) {
		var textArea = document.createElement("textarea");
		textArea.value = text;

		// Avoid scrolling to bottom
		textArea.style.top = "0";
		textArea.style.left = "0";
		textArea.style.position = "fixed";
		textArea.style.opacity = "0";

		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
		textArea.setSelectionRange(0, 99999);

		document.execCommand("copy");
		document.body.removeChild(textArea);
		alert("Copied!");
	}

	[].map.call(document.querySelectorAll("button.copy-to-clipboard"), function(button){
		button.onclick = function() {
			copyToClipboard(button.getAttribute('data-content'));
		}
	});
});