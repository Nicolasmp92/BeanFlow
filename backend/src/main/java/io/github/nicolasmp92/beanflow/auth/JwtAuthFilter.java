package io.github.nicolasmp92.beanflow.auth;

import io.github.nicolasmp92.beanflow.usuarios.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Acepta el JWT por cookie httpOnly (web) o por header
 * `Authorization: Bearer` (clientes móviles, ej. Flutter).
 * Rechaza implícitamente usuarios desactivados: no se autentican.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final String PREFIJO_BEARER = "Bearer ";

    private final JwtService jwt;
    private final UsuarioRepository usuarios;
    private final String cookieNombre;

    public JwtAuthFilter(
            JwtService jwt,
            UsuarioRepository usuarios,
            @Value("${beanflow.jwt.cookie-nombre}") String cookieNombre) {
        this.jwt = jwt;
        this.usuarios = usuarios;
        this.cookieNombre = cookieNombre;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String token = leerToken(request);
        if (token != null) {
            jwt.validarSub(token)
                    .flatMap(usuarios::findByCorreo)
                    .filter(usuario -> usuario.isActivo())
                    .ifPresent(usuario -> {
                        var auth = new UsernamePasswordAuthenticationToken(
                                usuario.getCorreo(),
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().toUpperCase())));
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    });
        }
        chain.doFilter(request, response);
    }

    private String leerToken(HttpServletRequest request) {
        String cabecera = request.getHeader("Authorization");
        if (cabecera != null && cabecera.startsWith(PREFIJO_BEARER)) {
            return cabecera.substring(PREFIJO_BEARER.length());
        }
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;
        for (Cookie cookie : cookies) {
            if (cookieNombre.equals(cookie.getName())) return cookie.getValue();
        }
        return null;
    }
}
