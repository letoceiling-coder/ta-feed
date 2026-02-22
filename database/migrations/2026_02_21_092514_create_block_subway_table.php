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
        Schema::create('block_subway', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('block_id');
            $table->unsignedBigInteger('subway_id');
            $table->integer('distance_time')->nullable(); // расстояние в минутах
            $table->integer('distance_type')->nullable(); // 1 - пешком, 2 - транспортом
            $table->timestamps();
            
            $table->foreign('block_id')->references('id')->on('blocks')->onDelete('cascade');
            $table->foreign('subway_id')->references('id')->on('subways')->onDelete('cascade');
            $table->unique(['block_id', 'subway_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('block_subway');
    }
};
