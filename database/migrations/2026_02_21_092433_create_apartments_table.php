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
        Schema::create('apartments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('building_id')->nullable();
            $table->decimal('area_given', 10, 2)->nullable(); // приведённая площадь
            $table->decimal('area_total', 10, 2)->nullable(); // общая площадь
            $table->decimal('area_rooms_total', 10, 2)->nullable(); // жилая площадь
            $table->unsignedBigInteger('finishing_id')->nullable();
            $table->integer('floor')->nullable(); // этаж
            $table->integer('floors')->nullable(); // этажей в секции
            $table->string('number')->nullable(); // номер квартиры
            $table->text('plan')->nullable(); // планировка (URL или JSON)
            $table->decimal('price', 15, 2)->nullable(); // цена при 100% оплате
            $table->decimal('price_base', 15, 2)->nullable(); // базовая цена
            $table->unsignedBigInteger('room_id')->nullable();
            $table->timestamps();
            
            $table->foreign('building_id')->references('id')->on('buildings')->onDelete('cascade');
            $table->foreign('finishing_id')->references('id')->on('finishings')->onDelete('set null');
            $table->foreign('room_id')->references('id')->on('rooms')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('apartments');
    }
};
