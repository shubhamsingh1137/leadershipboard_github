<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('group_user', function (Blueprint $table) {
            // Naye columns jo individual employee ki task track karenge
            $table->string('task')->nullable()->after('user_id');
            $table->string('task_status')->default('pending')->after('task');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('group_user', function (Blueprint $table) {
            // Rollback ke waqt in columns ko delete karne ke liye
            $table->dropColumn(['task', 'task_status']);
        });
    }
};