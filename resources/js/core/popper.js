// resources\js\core\popper.js
// Importa Popper y expone createPopper para que otros módulos lo usen.
import { createPopper } from '@popperjs/core';      // <- función principal de Popper
window.createPopper = createPopper;                 // <- expón en window (lo reutilizamos en tooltip.js)
