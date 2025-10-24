<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Helper: verifica si un índice existe en la tabla (por nombre exacto).
     */
    private function indexExists(string $table, string $indexName): bool
    {
        $database = DB::getDatabaseName();

        return DB::table('information_schema.statistics')
            ->where('table_schema', $database)
            ->where('table_name', $table)
            ->where('index_name', $indexName)
            ->exists();
    }

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // 🔹 Campos “legacy” que usas en tu app
            if (!Schema::hasColumn('users', 'rol')) {
                $table->string('rol', 50)->nullable()->after('password'); // corto para indexar sin problemas
            }
            if (!Schema::hasColumn('users', 'cliente')) {
                $table->string('cliente', 250)->nullable()->after('rol');
            }
            if (!Schema::hasColumn('users', 'cliente_id')) {
                $table->unsignedBigInteger('cliente_id')->nullable()->after('cliente');
            }

            if (!Schema::hasColumn('users', 'status')) {
                $table->string('status', 20)->default('activo')->after('cliente_id'); // default coherente
            }

            // 🔹 Preferencias de tema (Flux)
            if (!Schema::hasColumn('users', 'theme')) {
                $table->enum('theme', ['light', 'dark', 'system'])
                      ->default('system')
                      ->after('remember_token');
            }
            if (!Schema::hasColumn('users', 'theme_accent')) {
                $table->string('theme_accent', 32)
                      ->default('orange')
                      ->after('theme');
            }
            if (!Schema::hasColumn('users', 'theme_neutral')) {
                $table->string('theme_neutral', 32)
                      ->default('gray') // alineado con seeder/modelo
                      ->after('theme_accent');
            }
        });

        // 🔹 Índices útiles (crear SOLO si no existen)
        if (!$this->indexExists('users', 'users_rol_idx')) {
            Schema::table('users', function (Blueprint $table) {
                $table->index('rol', 'users_rol_idx');
            });
        }

        if (!$this->indexExists('users', 'users_status_idx')) {
            Schema::table('users', function (Blueprint $table) {
                $table->index('status', 'users_status_idx');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Quitar índices SOLO si existen
        if ($this->indexExists('users', 'users_rol_idx')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropIndex('users_rol_idx');
            });
        }

        if ($this->indexExists('users', 'users_status_idx')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropIndex('users_status_idx');
            });
        }

        // Quitar columnas SOLO si existen
        Schema::table('users', function (Blueprint $table) {
            $cols = ['rol', 'cliente', 'cliente_id', 'status', 'theme', 'theme_accent', 'theme_neutral'];
            foreach ($cols as $col) {
                if (Schema::hasColumn('users', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
