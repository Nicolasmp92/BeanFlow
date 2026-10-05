package io.github.nicolasmp92.beanflow.usuarios;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/** CRUD de usuarios para el panel /admin. Requiere sesión autenticada. */
@RestController
@RequestMapping("/api/admin/usuarios")
public class AdminUsuariosController {

    private final UsuarioRepository usuarios;
    private final PasswordEncoder encoder;

    public AdminUsuariosController(UsuarioRepository usuarios, PasswordEncoder encoder) {
        this.usuarios = usuarios;
        this.encoder = encoder;
    }

    /** Vista pública del usuario: nunca expone claveHash. */
    public record UsuarioResponse(Long id, String correo, String nombre, String rol, boolean activo) {

        static UsuarioResponse de(Usuario usuario) {
            return new UsuarioResponse(
                    usuario.getId(), usuario.getCorreo(), usuario.getNombre(),
                    usuario.getRol(), usuario.isActivo());
        }
    }

    public record UsuarioRequest(
            @NotBlank @Email String correo,
            @NotBlank String nombre,
            String clave,
            @NotBlank @Pattern(regexp = "admin|garzon|cocina|caja") String rol) {
    }

    @GetMapping
    public List<UsuarioResponse> listar() {
        return usuarios.findAll().stream().map(UsuarioResponse::de).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse crear(@Valid @RequestBody UsuarioRequest peticion) {
        if (usuarios.existsByCorreo(peticion.correo())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un usuario con ese correo");
        }
        if (peticion.clave() == null || peticion.clave().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La clave es obligatoria al crear");
        }
        Usuario usuario = new Usuario(
                peticion.correo(), peticion.nombre(), encoder.encode(peticion.clave()), peticion.rol());
        return UsuarioResponse.de(usuarios.save(usuario));
    }

    @PutMapping("/{id}")
    public UsuarioResponse actualizar(@PathVariable Long id, @Valid @RequestBody UsuarioRequest peticion) {
        Usuario usuario = usuarios.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!usuario.getCorreo().equals(peticion.correo())
                && usuarios.existsByCorreo(peticion.correo())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un usuario con ese correo");
        }
        usuario.setCorreo(peticion.correo());
        usuario.setNombre(peticion.nombre());
        usuario.setRol(peticion.rol());
        if (peticion.clave() != null && !peticion.clave().isBlank()) {
            usuario.setClaveHash(encoder.encode(peticion.clave()));
        }
        return UsuarioResponse.de(usuarios.save(usuario));
    }

    @PatchMapping("/{id}/estado")
    public UsuarioResponse alternarEstado(
            @PathVariable Long id, @AuthenticationPrincipal String correoActual) {
        Usuario usuario = usuarios.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (usuario.getCorreo().equals(correoActual)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "No puedes desactivar tu propia cuenta");
        }
        usuario.setActivo(!usuario.isActivo());
        return UsuarioResponse.de(usuarios.save(usuario));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id, @AuthenticationPrincipal String correoActual) {
        Usuario usuario = usuarios.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (usuario.getCorreo().equals(correoActual)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "No puedes eliminar tu propia cuenta");
        }
        usuarios.deleteById(id);
    }
}
