<?php

namespace App\Http\Controllers\Api;

use App\Models\Order;
use App\Models\Product;
use App\Models\Customer;
use App\Models\OrderDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::with('customer')->get();
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'total' => 'required|numeric',
            'payment' => 'required|numeric',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
        ]);

        // Simpan transaksi
        $transaction = Order::create([
            'order_date' => now()->setTimezone('Asia/Jakarta'),
            'customer_id' => $validated['customer_id'],
            'total_amount' => $validated['total'],
            'customer_pay' => $validated['payment'],
            'customer_change' => $validated['payment'] - $validated['total'],
        ]);

        // Simpan detail transaksi
        foreach ($validated['items'] as $item) {
            OrderDetail::create([
                'order_id' => $transaction->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
            ]);
        }

        return response()->json([
            'message' => 'Transaction created successfully',
            'data' => $transaction
        ], 201);
    }

    public function edit($id)
    {
        // Eager‐load relasi customer _sebelum_ find($id)
        $order = Order::with('customer')->find($id);

        if (! $order) {
            return response()->json([
                'message' => 'Order tidak ditemukan.'
            ], 404);
        }

        // Ambil semua detail untuk order itu
        $orderDetails = OrderDetail::where('order_id', $id)
            ->with('product')
            ->get();

        return response()->json([
            'message'        => 'Berhasil mengambil data.',
            'data'           => $order,
            'order_details'  => $orderDetails
        ], 200);
    }

    public function update(Request $request, $id)
    {
        // Validasi data
        $validatedData = $request->validate([
            'customer_id' => 'required',
            'total' => 'required|numeric',
            'payment' => 'required|numeric',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        // Cari order
        $order = Order::findOrFail($id);

        // Update data utama orders
        $order->customer_id = $validatedData['customer_id'];
        $order->total_amount = $validatedData['total'];
        $order->customer_pay = $validatedData['payment'];
        $order->customer_change = $validatedData['payment'] - $validatedData['total'];
        $order->save();

        // DELETE dari tabel order_detail berdasarkan order_id
        DB::table('order_details')->where('order_id', $order->id)->delete();

        // Simpan ulang order_detail baru
        foreach ($validatedData['items'] as $item) {
            $order->orderDetails()->create([
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ]);
        }

        return response()->json(['message' => 'Order berhasil diperbarui.']);
    }

    public function show($id)
    {
        // Eager‐load relasi customer _sebelum_ find($id)
        $order = Order::with('customer')->find($id);

        if (! $order) {
            return response()->json([
                'message' => 'Order tidak ditemukan.'
            ], 404);
        }

        // Ambil semua detail untuk order itu
        $orderDetails = OrderDetail::where('order_id', $id)
            ->with('product')
            ->get();

        return response()->json([
            'message'        => 'Berhasil mengambil data.',
            'data'           => $order,
            'order_details'  => $orderDetails
        ], 200);
    }


    public function destroy($id)
    {
        Log::info("Delete order with ID: $id"); // Log ID order yang ingin dihapus

        $order = Order::find($id);

        if (! $order) {
            return response()->json([
                'message' => 'Order tidak ditemukan.'
            ], 404);
        }

        // Menghapus order_details yang terkait
        OrderDetail::where('order_id', $id)->delete();

        // Hapus order
        $order->delete();

        return response()->json([
            'message' => 'Order dan detailnya berhasil dihapus.'
        ], 200);
    }
}
