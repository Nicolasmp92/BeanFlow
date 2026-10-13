package io.github.nicolasmp92.beanflow.config;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Contrato de error uniforme (RFC 7807). Con `problemdetails.enabled` Spring
 * ya serializa ResponseStatusException y los 404/405 como ProblemDetail; este
 * advice añade el detalle por campo de los errores de validación en la
 * propiedad `errores` — el front puede señalar el input exacto.
 *
 * `@Order(HIGHEST_PRECEDENCE)` es necesario: el ProblemDetailsExceptionHandler
 * de Boot maneja `Exception` genérico y, con la misma precedencia, se consulta
 * antes y enmascara los handlers específicos de la app.
 */
@Order(Ordered.HIGHEST_PRECEDENCE)
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail validacion(MethodArgumentNotValidException e) {
        ProblemDetail detalle = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST, "Los datos enviados no son válidos");
        detalle.setTitle("Datos inválidos");

        Map<String, String> errores = new LinkedHashMap<>();
        for (FieldError campo : e.getBindingResult().getFieldErrors()) {
            errores.putIfAbsent(campo.getField(), campo.getDefaultMessage());
        }
        detalle.setProperty("errores", errores);
        return detalle;
    }
}
