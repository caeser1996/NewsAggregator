<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;

class NewsApiController extends Controller
{
    protected $client;

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => 'https://newsapi.org/v2/',
            'timeout'  => 5.0,
            'headers' => [
                'X-Api-Key' => 'beb8683d95fb41cc9b5e622232d1d377',
            ],
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->get('q');
        $sources = $request->get('sources');
        $categories = $request->get('categories');
        $from = $request->get('from');
        $to = $request->get('to');
        $sortBy = $request->get('sortBy');

        $response = $this->client->request('GET', 'everything', [
            'query' => [
                'q' => $query,
                'sources' => $sources,
                'categories' => $categories,
                'from' => $from,
                'to' => $to,
                'sortBy' => $sortBy,
            ],
        ]);

        return $response->getBody()->getContents();
    }
}
