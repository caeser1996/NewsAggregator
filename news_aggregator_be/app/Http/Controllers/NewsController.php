<?php

namespace App\Http\Controllers;

use App\Http\Controllers\GuardianApiController;
use App\Http\Controllers\NewsApiController;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function search(Request $request)
    {
        $provider = $request->get('provider');
    
        if ($provider == 'newsapi') {
            $controller = new NewsApiController();
        } else if ($provider == 'guardian') {
            $controller = new GuardianApiController();
        } else {
            return response()->json(['message' => 'Invalid API provider']);
        }
    
        $response = $controller->search($request);
    
        $data = json_decode($response);
    
    
        return response()->json([
            'articles' => $data,
        ]);
    }
    
}
