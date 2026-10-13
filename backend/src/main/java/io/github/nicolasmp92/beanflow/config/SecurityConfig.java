package io.github.nicolasmp92.beanflow.config;

import io.github.nicolasmp92.beanflow.auth.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain filtro(HttpSecurity http, JwtAuthFilter jwtFilter) throws Exception {
        return http
                // API con cookie SameSite=Strict; CSRF no aplica al no usar sesiones.
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.disable())
                .sessionManagement(sesion -> sesion.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex.authenticationEntryPoint(
                        new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                .authorizeHttpRequests(auth -> auth
                        // El despacho a /error debe ser público para que un 404 no se traduzca a 401.
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/health").permitAll()
                        // Probes de infraestructura (liveness/readiness).
                        .requestMatchers("/actuator/health").permitAll()
                        // Swagger/OpenAPI público en dev: restringir o quitar en producción.
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html")
                        .permitAll()
                        // Mantención de carta, bodega, mesas y usuarios.
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        // Tablero de la barra: cocina y admin.
                        .requestMatchers("/api/cocina/**").hasAnyRole("COCINA", "ADMIN")
                        // El cobro cierra caja: no lo hace quien solo toma pedidos.
                        .requestMatchers(HttpMethod.POST, "/api/comandas/*/cobrar")
                        .hasAnyRole("CAJA", "ADMIN")
                        // Abrir cuentas y tomar pedidos.
                        .requestMatchers("/api/comandas/**").hasAnyRole("GARZON", "CAJA", "ADMIN")
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().denyAll())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
