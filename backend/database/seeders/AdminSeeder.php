<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // updateOrCreate use karne se duplicate entry ka error nahi aayega
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'], // Email se check karega
            [
                'name' => 'Admin',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'employee_id' => 'ADM001', // Yeh add karna zaroori hai
                'phone' => '0000000000',    // Phone bhi add kar diya
            ]
        );
    }
}