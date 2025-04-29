<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customers = Customer::where('status', '!=', 'inactive')->get();
        return response()->json($customers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'domisili' => 'required|string|min:0',
            'gender' => 'required|string|max:100',
        ]);

        // Simpan ke database
        $customer = Customer::create($validated);

        return response()->json([
            'message' => 'Customer created successfully.',
            'data' => $customer
        ], 201);
    }

    public function getIdCustomer($id)
    {
        $customer = Customer::findorFail($id);
        if ($customer) {
            return response()->json($customer, 200);
        } else {
            return response()->json(['message' => 'Customer not found'], 404);
        }
    }

    public function update(Request $request, string $id)
    {
        $customer = Customer::findorFail($id);
        $customer->update($request->all());
        return response()->json([
            'message' => 'Customer updated successfully.',
            'data' => $customer
        ], 200);
    }


     public function updateStatus($id, Request $request)
    {
        $customer = Customer::findorFail($id);

        if ($customer) {
            // Update status produk menjadi 'deleted'
            $customer->status = $request->input('status');
            $customer->save();

            return response()->json(['message' => 'Customer status updated successfully.']);
        } else {
            return response()->json(['message' => 'Customer not found.'], 404);
        }
    }
}
