package io.github.nicolasmp92.beanflow.auth;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * JWT HS256 mínimo sin dependencias externas: HMAC-SHA256 sobre
 * header.payload, claims en JSON. Suficiente para un único emisor/consumidor.
 */
@Service
public class JwtService {

    private static final String CABECERA = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";

    private final byte[] secreto;
    private final long duracionSegundos;

    public JwtService(
            @Value("${beanflow.jwt.secret}") String secreto,
            @Value("${beanflow.jwt.expiracion-horas}") long expiracionHoras) {
        this.secreto = secreto.getBytes(StandardCharsets.UTF_8);
        this.duracionSegundos = expiracionHoras * 3600;
    }

    public String generar(String correo, String rol) {
        long iat = Instant.now().getEpochSecond();
        String payload = "{\"sub\":\"" + escapar(correo) + "\",\"rol\":\"" + escapar(rol)
                + "\",\"iat\":" + iat + ",\"exp\":" + (iat + duracionSegundos) + "}";
        String sinFirma = b64(CABECERA.getBytes(StandardCharsets.UTF_8)) + "." + b64(payload.getBytes(StandardCharsets.UTF_8));
        return sinFirma + "." + b64(firmar(sinFirma));
    }

    /** Devuelve el claim "sub" (correo) si el token es válido y no expiró. */
    public Optional<String> validarSub(String token) {
        String[] partes = token.split("\\.");
        if (partes.length != 3) return Optional.empty();

        byte[] esperada = firmar(partes[0] + "." + partes[1]);
        if (!constanteEquals(esperada, decodificar(partes[2]))) return Optional.empty();

        String payload = new String(decodificar(partes[1]), StandardCharsets.UTF_8);
        Long exp = extraerNumero(payload, "exp");
        String sub = extraerTexto(payload, "sub");
        if (exp == null || sub == null || Instant.now().getEpochSecond() >= exp) {
            return Optional.empty();
        }
        return Optional.of(sub);
    }

    private byte[] firmar(String datos) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secreto, "HmacSHA256"));
            return mac.doFinal(datos.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            throw new IllegalStateException("No se pudo firmar el token", e);
        }
    }

    private static boolean constanteEquals(byte[] a, byte[] b) {
        if (a.length != b.length) return false;
        int diff = 0;
        for (int i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
        return diff == 0;
    }

    private static String b64(byte[] datos) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(datos);
    }

    private static byte[] decodificar(String texto) {
        try {
            return Base64.getUrlDecoder().decode(texto);
        } catch (IllegalArgumentException e) {
            return new byte[0];
        }
    }

    private static String escapar(String texto) {
        return texto.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private static String extraerTexto(String json, String clave) {
        String patron = "\"" + clave + "\":\"";
        int inicio = json.indexOf(patron);
        if (inicio < 0) return null;
        int desde = inicio + patron.length();
        int hasta = json.indexOf('"', desde);
        return hasta < 0 ? null : json.substring(desde, hasta);
    }

    private static Long extraerNumero(String json, String clave) {
        String patron = "\"" + clave + "\":";
        int inicio = json.indexOf(patron);
        if (inicio < 0) return null;
        int desde = inicio + patron.length();
        int hasta = desde;
        while (hasta < json.length() && Character.isDigit(json.charAt(hasta))) hasta++;
        return hasta == desde ? null : Long.parseLong(json.substring(desde, hasta));
    }
}
