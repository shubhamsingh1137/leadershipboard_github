<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GroupController;
use Illuminate\Support\Facades\Route;

// Login
Route::post('/login', [AuthController::class, 'login']);

// Admin Only
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post('/admin/create-employee', [AuthController::class, 'createEmployee']);
    Route::get('/admin/employees', [AuthController::class, 'getAllEmployees']);
    Route::post('/admin/update-employee/{id}', [AuthController::class, 'updateEmployee']);
    Route::delete('/admin/delete-employee/{id}', [AuthController::class, 'deleteEmployee']);

    // CSV Import
    Route::post('/admin/import-employees', [AuthController::class, 'importEmployees']);

    // Group Management Routes
    Route::post('/admin/create-group', [GroupController::class, 'createGroup']);
    Route::get('/admin/groups', [GroupController::class, 'getAllGroups']);


    // NAYE ROUTES:
    Route::put('/admin/update-group/{id}', [GroupController::class, 'updateGroup']);
    Route::delete('/admin/delete-group/{id}', [GroupController::class, 'deleteGroup']);

    // Status toggle
    Route::patch('/admin/group-status/{id}', [GroupController::class, 'updateStatus']);
    // CSV 
    Route::post('/admin/import-groups-csv', [GroupController::class, 'importGroupsCsv']);
    //anlytics 
    Route::get('/admin/analytics', [GroupController::class, 'getAnalytics']);
});
