package io.github.nicolasmp92.beanflow.usuarios;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

/**
 * Resuelve el usuario de la sesión a partir del principal (su correo). Toda
 * operación que deja firma en el libro lo usa: el cliente nunca informa quién
 * es, se deduce del token.
 */
@Component
public class UsuarioActual {

    private final UsuarioRepository usuarios;

    public UsuarioActual(UsuarioRepository usuarios) {
        this.usuarios = usuarios;
    }

    public Usuario desde(String correo) {
        if (correo == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return usuarios.findByCorreo(correo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }

    public Long idDe(String correo) {
        return desde(correo).getId();
    }
}
