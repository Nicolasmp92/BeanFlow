/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.vue",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#3b82f6", // Azul
                    dark: "#2563eb", // Azul oscuro
                },
                secondary: {
                    DEFAULT: "#f59e0b", // Naranjo
                    dark: "#d97706",
                },
                accent: {
                    DEFAULT: "#10b981", // Verde
                    dark: "#059669",
                },
            },
        },
    },
    plugins: [],
};
