export function initializeAppFactory(): Promise<null> {
  return new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      const loading = document.getElementById('first_view_loading');
      const container = document.getElementById('main_view_container');

      if (loading) {
        loading.remove();
      }

      if (container) {
        container.style.opacity = '1';
      }

      resolve(true);
    }, 600);
  });
}
