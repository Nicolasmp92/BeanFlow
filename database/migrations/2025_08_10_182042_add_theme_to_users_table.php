<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Para no tener que recurir a local storage y otras fiunciones, guardaremos la preferencia de tema de cada usuari en tabla
     */
    public function up(): void {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('theme', ['light','dark','system'])->default('system')->after('remember_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //revertimos el UP
            $table->dropColumn('theme');
        });
    }
};
