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
        Schema::create('building_mortgage', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('building_id');
            $table->unsignedBigInteger('mortgage_id');
            $table->timestamps();
            
            $table->foreign('building_id')->references('id')->on('buildings')->onDelete('cascade');
            $table->foreign('mortgage_id')->references('id')->on('mortgages')->onDelete('cascade');
            $table->unique(['building_id', 'mortgage_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('building_mortgage');
    }
};
