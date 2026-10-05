package io.github.nicolasmp92.beanflow.auth;

import io.github.nicolasmp92.beanflow.usuarios.Usuario;
import io.github.nicolasmp92.beanflow.usuarios.UsuarioRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final int MAX_INTENTOS = 5;
    private static final long VENTANA_SEGUNDOS = 60;

    private final UsuarioRepository usuarios;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final String cookieNombre;
    private final boolean cookieSecure;

    /** Intentos por IP para frenar fuerza bruta en login. */
    private final Map<String, ConcurrentLinkedDeque<Long>> intentos = new ConcurrentHashMap<>();

    public AuthController(
            UsuarioRepository usuarios,
            PasswordEncoder encoder,
            JwtService jwt,
            @Value("${beanflow.jwt.cookie-nombre}") String cookieNombre,
            @Value("${beanflow.jwt.cookie-secure}") boolean cookieSecure) {
        this.usuarios = usuarios;
        this.encoder = encoder;
        this.jwt = jwt;
        this.cookieNombre = cookieNombre;
        this.cookieSecure = cookieSecure;
    }

    public record LoginRequest(
            @NotBlank @Email String correo,
            @NotBlank String clave) {
    }

    /** El campo `token` lo usan clientes Bearer (Flutter); la web usa la cookie. */
    public record SesionResponse(String correo, String nombre, String rol, String token) {
    }

    @PostMapping("/login")
    public ResponseEntity<SesionResponse> login(
            @Valid @RequestBody LoginRequest peticion, HttpServletRequest request) {
        limitar(request.getRemoteAddr());

        Usuario usuario = usuarios.findByCorreo(peticion.correo())
                .filter(Usuario::isActivo)
                .filter(u -> encoder.matches(peticion.clave(), u.getClaveHash()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Credenciales inválidas"));

        String token = jwt.generar(usuario.getCorreo(), usuario.getRol());
        ResponseCookie cookie = ResponseCookie.from(cookieNombre, token)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Strict")
                .path("/")
                .maxAge(12 * 3600)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new SesionResponse(usuario.getCorreo(), usuario.getNombre(), usuario.getRol(), token));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        ResponseCookie cookie = ResponseCookie.from(cookieNombre, "")
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Strict")
                .path("/")
                .maxAge(0)
                .build();
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }

    @GetMapping("/me")
    public SesionResponse me(@AuthenticationPrincipal String correo) {
        Usuario usuario = usuarios.findByCorreo(correo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        return new SesionResponse(usuario.getCorreo(), usuario.getNombre(), usuario.getRol(), null);
    }

    private void limitar(String ip) {
        long ahora = Instant.now().getEpochSecond();
        var cola = intentos.computeIfAbsent(ip, k -> new ConcurrentLinkedDeque<>());
        while (!cola.isEmpty() && ahora - cola.peekFirst() > VENTANA_SEGUNDOS) {
            cola.pollFirst();
        }
        if (cola.size() >= MAX_INTENTOS) {
            throw new ResponseStatusException(
                    HttpStatus.TOO_MANY_REQUESTS, "Demasiados intentos; espera un minuto");
        }
        cola.addLast(ahora);
    }
}
