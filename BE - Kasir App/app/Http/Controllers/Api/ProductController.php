<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::where('status', '!=', 'inactive')->get();
        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string|max:100',
        ]);

        // Simpan ke database
        $product = Product::create($validated);

        return response()->json([
            'message' => 'Product created successfully.',
            'data' => $product
        ], 201);
    }

    public function getIdProduct($id)
    {
        $product = Product::findorFail($id);
        if ($product) {
            return response()->json($product, 200);
        } else {
            return response()->json(['message' => 'Product not found'], 404);
        }
    }

    public function update(Request $request, string $id)
    {
        $product = Product::findorFail($id);
        $product->update($request->all());
        return response()->json([
            'message' => 'Product updated successfully.',
            'data' => $product
        ], 200);
    }

    // ProductController.php
    public function updateStatus($id, Request $request)
    {
        $product = Product::findorFail($id);

        if ($product) {
            // Update status produk menjadi 'deleted'
            $product->status = $request->input('status');
            $product->save();

            return response()->json(['message' => 'Product status updated successfully.']);
        } else {
            return response()->json(['message' => 'Product not found.'], 404);
        }
    }
}
