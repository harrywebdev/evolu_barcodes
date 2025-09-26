// PWA Service Worker Registration
export function registerServiceWorker() {
	if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
		console.log('registering service worker')
		window.addEventListener('load', () => {
      console.log('loading service worker')
			navigator.serviceWorker
				.register('/sw.js')
				.then((registration) => {
					console.log('SW registered: ', registration);
				})
				.catch((registrationError) => {
					console.log('SW registration failed: ', registrationError);
				});
		});
	}
}
