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
                'api-key' => 'dc4c08f9-1639-4fa0-812b-efcc7ddf7df0',
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
                'source' => $source,
            ],
        ]);
    
        return $response->getBody()->getContents();
    }
    
}
