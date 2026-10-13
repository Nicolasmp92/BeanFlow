package io.github.nicolasmp92.beanflow.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class JwtServiceTest {

    private final JwtService jwt = new JwtService("secreto-de-prueba", 12);

    @Test
    void generaYValidaToken() {
        String token = jwt.generar("admin@beanflow.dev", "admin");
        assertEquals("admin@beanflow.dev", jwt.validarSub(token).orElseThrow());
    }

    @Test
    void rechazaTokenManipulado() {
        String token = jwt.generar("admin@beanflow.dev", "admin");
        String manipulado = token.substring(0, token.length() - 2) + "XX";
        assertTrue(jwt.validarSub(manipulado).isEmpty());
    }

    @Test
    void rechazaTokenExpirado() {
        JwtService expirado = new JwtService("secreto-de-prueba", 0);
        String token = expirado.generar("admin@beanflow.dev", "admin");
        assertTrue(expirado.validarSub(token).isEmpty());
    }

    @Test
    void rechazaEntradasMalformadas() {
        assertTrue(jwt.validarSub("").isEmpty());
        assertTrue(jwt.validarSub("a.b").isEmpty());
        assertTrue(jwt.validarSub("a.b.c.d").isEmpty());
    }
}
