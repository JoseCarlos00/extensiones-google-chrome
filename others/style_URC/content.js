window.addEventListener('keydown', ({ key }) => {
	if (key === 'ArrowRight') {
		const activePageItemOld = document.querySelector('#paginator ul li a.active');
		const activePageItem = document.querySelector('#paginator ul li.active');

		if (activePageItemOld) {
			const nextPageItem = activePageItemOld.parentElement.nextElementSibling;
			nextPageItem?.querySelector('a')?.click();
		} else if (activePageItem) {
			const nextPageItem = activePageItem.nextElementSibling;
			nextPageItem?.querySelector('a')?.click();
		}
	} else if (key === 'ArrowLeft') {
		const activePageItemOld = document.querySelector('#paginator ul li a.active');
		const activePageItem = document.querySelector('#paginator ul li.active');

		if (activePageItemOld) {
			const prevPageItem = activePageItemOld.parentElement.previousElementSibling;
			prevPageItem?.querySelector('a')?.click();
		} else if (activePageItem) {
			const prevPageItem = activePageItem.previousElementSibling;
			prevPageItem?.querySelector('a')?.click();
		}
	}
});
