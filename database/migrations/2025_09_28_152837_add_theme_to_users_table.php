<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        schema::table('users', function (Blueprint $table) {
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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('add_theme_to_users_table');
    }
};
