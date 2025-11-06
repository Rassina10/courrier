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
        Schema::create('courriers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organisation_id')->constrained();
            $table->foreignId('user_id')->constrained(); 
            $table->integer('numero_registre')->unique();
            $table->string('reference')->unique();
            $table->string('objet');
            $table->string('nature');
            $table->boolean('numerise');
            $table->date('date_reception');
            $table->string('statut');
            $table->string('niveau');
            $table->String('type');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courriers');
    }
};
