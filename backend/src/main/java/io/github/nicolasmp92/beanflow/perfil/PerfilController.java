package io.github.nicolasmp92.beanflow.perfil;

import io.github.nicolasmp92.beanflow.auth.AuthController.SesionResponse;
import io.github.nicolasmp92.beanflow.auth.JwtService;
import io.github.nicolasmp92.beanflow.usuarios.Usuario;
import io.github.nicolasmp92.beanflow.usuarios.UsuarioRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * Autogestión de la cuenta del usuario autenticado: datos de perfil y clave.
 * No confundir con `/api/admin/usuarios` — aquí no se toca rol ni estado.
 */
@RestController
@RequestMapping("/api/perfil")
public class PerfilController {

    private final UsuarioRepository usuarios;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final String cookieNombre;
    private final boolean cookieSecure;
    private final long cookieSegundos;

    public PerfilController(
            UsuarioRepository usuarios,
            PasswordEncoder encoder,
            JwtService jwt,
            @Value("${beanflow.jwt.cookie-nombre}") String cookieNombre,
            @Value("${beanflow.jwt.cookie-secure}") boolean cookieSecure,
            @Value("${beanflow.jwt.expiracion-horas}") long expiracionHoras) {
        this.usuarios = usuarios;
        this.encoder = encoder;
        this.jwt = jwt;
        this.cookieNombre = cookieNombre;
        this.cookieSecure = cookieSecure;
        this.cookieSegundos = expiracionHoras * 3600;
    }

    public record PerfilRequest(
            @NotBlank String nombre,
            @NotBlank @Email String correo) {
    }

    public record ClaveRequest(
            @NotBlank String claveActual,
            @NotBlank @Size(min = 8) String claveNueva) {
    }

    /**
     * Actualiza nombre/correo. El correo es el `sub` del JWT: si cambia hay
     * que re-emitir cookie y token, si no la sesión quedaría apuntando a un
     * correo inexistente.
     */
    @PutMapping
    public ResponseEntity<SesionResponse> actualizar(
            @Valid @RequestBody PerfilRequest peticion,
            @AuthenticationPrincipal String correoActual) {
        Usuario usuario = usuarios.findByCorreo(correoActual)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        if (!usuario.getCorreo().equals(peticion.correo())
                && usuarios.existsByCorreo(peticion.correo())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Ya existe un usuario con ese correo");
        }
        usuario.setNombre(peticion.nombre());
        usuario.setCorreo(peticion.correo());
        usuarios.save(usuario);

        String token = jwt.generar(usuario.getCorreo(), usuario.getRol());
        ResponseCookie cookie = ResponseCookie.from(cookieNombre, token)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Strict")
                .path("/")
                .maxAge(cookieSegundos)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new SesionResponse(
                        usuario.getCorreo(), usuario.getNombre(), usuario.getRol(), token));
    }

    /** Cambio de clave: exige la clave actual para no capturar sesiones abiertas. */
    @PutMapping("/clave")
    public ResponseEntity<Void> cambiarClave(
            @Valid @RequestBody ClaveRequest peticion,
            @AuthenticationPrincipal String correoActual) {
        Usuario usuario = usuarios.findByCorreo(correoActual)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        if (!encoder.matches(peticion.claveActual(), usuario.getClaveHash())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "La clave actual no coincide");
        }
        usuario.setClaveHash(encoder.encode(peticion.claveNueva()));
        usuarios.save(usuario);
        return ResponseEntity.noContent().build();
    }
}
