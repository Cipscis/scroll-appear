import '@cipscis/scroll-appear';

window.setTimeout(() => {
	const $element = document.createElement('div');
	$element.classList.add('js-scroll-appear');
	$element.classList.add('example');
	$element.setAttribute('data-scroll-appear-queue', 'example-queue');

	const $grids = document.querySelectorAll('.example__grid');
	if ($grids.length) {
		$grids[$grids.length-1].appendChild($element);
	}
}, 2000);
