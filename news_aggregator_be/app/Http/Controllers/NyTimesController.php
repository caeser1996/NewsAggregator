<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;

class NyTimesController extends Controller
{
    protected $client;

    public function __construct()
    {
        // https://api.nytimes.com/svc/search/v2/articlesearch.json?q=election&api-key=ARBYRUSYmImUOp54gpB4RGcJQMfAtND4
        $this->client = new Client([
            'base_uri' => 'https://api.nytimes.com',
            'timeout'  => 5.0,
            
        ]);
    }
    public function search(Request $request)
    {
        // Get the user's search query from the request
        $query = $request->input('query');
        $page = $request->get('page');

        $response = $this->client->request('GET', 'svc/search/v2/articlesearch.json', [
            'query' => [
                'q' => $query,
                'page' => $page,
                'api-key' => env('NYTIMES_API_KEY'),
            ],
        ]);


        return $response->getBody()->getContents();
    }
}
