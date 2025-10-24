// Alpine store global para UI
export function registerUiStore() {
    document.addEventListener('alpine:init', () => {
        window.Alpine.store('ui', {
            sidebarOpen: false,
            openSidebar() { this.sidebarOpen = true; },
            closeSidebar() { this.sidebarOpen = false; },
            toggleSidebar() { this.sidebarOpen = !this.sidebarOpen; },
        });
    });
}
