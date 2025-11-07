window.addEventListener('keydown', ({ key }) => {
	if (key === 'ArrowRight') {
		const activePageItem = document.querySelector('#paginator ul li a.active');

		if (activePageItem) {
			const nextPageItem = activePageItem.parentElement.nextElementSibling;
			nextPageItem?.querySelector('a')?.click();
		}
	} else if (key === 'ArrowLeft') {
		const activePageItem = document.querySelector('#paginator ul li a.active');

		if (activePageItem) {
			const prevPageItem = activePageItem.parentElement.previousElementSibling;
			prevPageItem?.querySelector('a')?.click();
		}
	}
});
