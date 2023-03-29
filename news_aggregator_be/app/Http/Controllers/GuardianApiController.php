<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;

class GuardianApiController extends Controller
{
    protected $client;

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => 'https://content.guardianapis.com/',
            'timeout'  => 5.0,
            'headers' => [
                'api-key' => env('GUARDIAN_API_KEY'),
            ],
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->get('q');
        $section = $request->get('section');
        $from = $request->get('from-date');
        $to = $request->get('to-date');
        $sort = $request->get('sort-by');
        $pageSize = $request->get('pageSize');
        $page = $request->get('page');
        $order = $request->get('order-by');
        $source = $request->get('source');
    
        $response = $this->client->request('GET', 'search', [
            'query' => [
                'q' => $query,
                'section' => $section,
                'from-date' => $from,
                'to-date' => $to,
                'sort-by' => $sort,
                'order-by' => $order,
                'page' => $page,
                'page-size' => $pageSize,
            ],
        ]);
    
        return $response->getBody()->getContents();
    }
    
}
