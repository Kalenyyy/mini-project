<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::create([
            //colum table db => value
            'id' => "1",
            'name' => "Product 1",
            'category' => "ATK",
            'price' => 4000,
        ]);
        Product::create([
            //colum table db => value
            'id' => "2",
            'name' => "Product 2",
            'category' => "Elektronik",
            'price' => 5000,
        ]);
    }
}
