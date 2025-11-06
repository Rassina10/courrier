<?php

use App\Models\Organisation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SeederController;
use App\Http\Controllers\CourrierController;
use App\Http\Controllers\UserAuthController;
use App\Http\Controllers\StructureController;
use App\Http\Controllers\OrganisationController;

Route::get('/users',[[UserAuthController::class,'users']]);


Route::post('/register',[UserAuthController::class,'register']);
Route::post('/login',[UserAuthController::class,'login']);
Route::post('/logout',[UserAuthController::class,'logout']);

Route::post('/create/organisation',[OrganisationController::class,'store']);
Route::get('/organisation/list',[OrganisationController::class,'index']);
Route::post('/create/structure',[StructureController::class,'store']);

Route::get('/role', [RoleController::class,'index']);
Route::post('/role/create',[RoleController::class, 'store']);
Route::post('/role/update',[RoleController::class,'update']);
Route::get('/role/edit',[RoleController::class,'update']);
Route::post('/role/delete',[RoleController::class,'destroy']);

Route::post('roles/{id}/permissions', [RoleController::class, 'assignPermissions']);

Route::get('/courrier/list',[CourrierController::class,'index']);
Route::post('/courrier/create',[CourrierController::class,'store']);
Route::post('/courrier/show',[CourrierController::class,'show']);
Route::get('/courrier/edit',[CourrierController::class,'update']);
Route::post('/courrier/delete',[CourrierController::class,'destroy']);

