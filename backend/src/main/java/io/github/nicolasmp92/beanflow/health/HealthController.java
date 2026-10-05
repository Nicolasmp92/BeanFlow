package io.github.nicolasmp92.beanflow.health;

import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Estado mínimo del sistema: proceso arriba y BD alcanzable. */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final EntityManager em;

    public HealthController(EntityManager em) {
        this.em = em;
    }

    @GetMapping
    public Map<String, Object> estado() {
        return Map.of(
                "status", "up",
                "db", dbAlcanzable() ? "up" : "down",
                "timestamp", Instant.now().toString());
    }

    private boolean dbAlcanzable() {
        try {
            em.createNativeQuery("SELECT 1").getSingleResult();
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
