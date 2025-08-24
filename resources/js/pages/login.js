// resources/js/pages/login.js

export function registerLogin() {
    const emailInput = document.querySelector("#email"); // input de correo
    const rememberEmail = document.querySelector("#rememberEmail"); // checkbox "Recordar email"

    if (!emailInput || !rememberEmail) return; // si no existen, salir

    // Si hay correo guardado, precargar y marcar checkbox
    const saved = localStorage.getItem("login_email");
    if (saved) {
        emailInput.value = saved;
        rememberEmail.checked = true;
    }

    // Guardar/borrar al cambiar el checkbox
    rememberEmail.addEventListener("change", () => {
        if (rememberEmail.checked) {
            localStorage.setItem("login_email", emailInput.value || "");
        } else {
            localStorage.removeItem("login_email");
        }
    });

    // Si se edita el correo y está marcado, mantener actualizado
    emailInput.addEventListener("input", () => {
        if (rememberEmail.checked) {
            localStorage.setItem("login_email", emailInput.value || "");
        }
    });
}
