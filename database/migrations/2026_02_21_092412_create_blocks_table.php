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
        Schema::create('blocks', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->unsignedBigInteger('builder_id')->nullable();
            $table->text('geometry')->nullable(); // JSON геометка ЖК
            $table->text('renderer')->nullable(); // JSON рендеры ЖК
            $table->text('progress')->nullable(); // JSON ход строительства
            $table->text('plan')->nullable(); // JSON ген. план
            $table->timestamps();
            
            $table->foreign('builder_id')->references('id')->on('builders')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blocks');
    }
};
