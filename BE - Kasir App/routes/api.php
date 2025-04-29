<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CustomerController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::get('/products', [ProductController::class, 'index']);
Route::post('/products/store', [ProductController::class, 'store']);
Route::get('/products/{id}', [ProductController::class, 'getIdProduct']);
Route::put('/products/update/{id}', [ProductController::class, 'update']);
Route::put('/products/update-status/{id}', [ProductController::class, 'updateStatus']);


Route::get('/customers', [CustomerController::class, 'index']);
Route::post('/customers/store', [CustomerController::class, 'store']);
Route::get('/customers/{id}', [CustomerController::class, 'getIdCustomer']);
Route::put('/customers/update/{id}', [CustomerController::class, 'update']);
Route::put('/customers/update-status/{id}', [CustomerController::class, 'updateStatus']);

Route::get('/orders', [OrderController::class, 'index']);
Route::post('/orders/store', [OrderController::class, 'store']);
Route::get('/orders/show/{id}', [OrderController::class, 'show']);
Route::delete('/orders/delete/{id}', [OrderController::class, 'destroy']);
Route::get('/orders/edit/{id}', [OrderController::class, 'edit']);
Route::put('/orders/update/{id}', [OrderController::class, 'update']);