<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NewsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/user-profile', [AuthController::class, 'userProfile']);
    Route::get('/news/search', [NewsController::class, 'search']);
});
Route::group([
    'middleware' => 'api',
    'prefix' => 'news'
], function ($router) {
    Route::get('/search', [NewsController::class, 'search']);
    Route::get('/sources', [NewsController::class, 'getSources']);
    Route::get('/categories',  [NewsController::class, 'getCategories']);
    Route::get('/authors',  [NewsController::class, 'getAuthors']);
});
