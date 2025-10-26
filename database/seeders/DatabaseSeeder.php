<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create customer user
        User::create([
            'name' => 'Customer User',
            'email' => 'customer@example.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
        ]);

        // Create categories
        $categories = [
            ['name' => 'Technical Support', 'slug' => 'technical-support', 'description' => 'Technical issues and troubleshooting'],
            ['name' => 'Billing', 'slug' => 'billing', 'description' => 'Billing and payment related queries'],
            ['name' => 'General Inquiry', 'slug' => 'general-inquiry', 'description' => 'General questions and information'],
            ['name' => 'Feature Request', 'slug' => 'feature-request', 'description' => 'Requests for new features'],
            ['name' => 'Bug Report', 'slug' => 'bug-report', 'description' => 'Report bugs and issues'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
