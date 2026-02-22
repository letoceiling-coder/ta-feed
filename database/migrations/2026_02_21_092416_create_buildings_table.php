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
        Schema::create('buildings', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable(); // название корпуса
            $table->unsignedBigInteger('block_id')->nullable();
            $table->string('queue')->nullable(); // очередь
            $table->string('address')->nullable();
            $table->date('deadline')->nullable(); // срок сдачи
            $table->unsignedBigInteger('building_type_id')->nullable();
            $table->text('geometry')->nullable(); // JSON геометка корпуса
            $table->timestamps();
            
            $table->foreign('block_id')->references('id')->on('blocks')->onDelete('cascade');
            $table->foreign('building_type_id')->references('id')->on('building_types')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('buildings');
    }
};
