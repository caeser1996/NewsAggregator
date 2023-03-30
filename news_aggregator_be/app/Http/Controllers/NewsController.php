<?php

namespace App\Http\Controllers;

use App\Http\Controllers\GuardianApiController;
use App\Http\Controllers\NewsApiController;
use Illuminate\Http\Request;
use GuzzleHttp\Client;


class NewsController extends Controller
{
    public function search(Request $request)
    {
        $provider = $request->get('provider');

        if ($provider == 'newsapi') {
            $controller = new NewsApiController();
        } else if ($provider == 'guardian') {
            $controller = new GuardianApiController();
        } else if ($provider == 'nytimes') {
            $controller = new NyTimesController();
        } else {
            return response()->json(['message' => 'Invalid API provider']);
        }

        $response = $controller->search($request);

        $data = json_decode($response);


        return response()->json([
            'articles' => $data,
        ]);
    }
    public function getSources(Request $request)
    {
        $provider = $request->get('provider');

        if ($provider == 'newsapi') {
            $url = 'https://newsapi.org/v2/sources';
            $params = [
                'apiKey' => env('NEWS_API_KEY'),
                'language' => 'en',
            ];
            $mapping = function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                ];
            };
        } else if ($provider == 'guardian') {
            $url = 'https://content.guardianapis.com/sections';
            $params = [
                'api-key' => env('GUARDIAN_API_KEY'),
            ];
            $mapping = function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->webTitle,
                ];
            };
        } else {
            return response()->json(['message' => 'Invalid API provider']);
        }

        $client = new Client(['base_uri' => $url]);
        $response = $client->request('GET', '', ['query' => $params]);
        $data = json_decode($response->getBody()->getContents());

        $items = array_map($mapping, $data->sources ?? $data->response->results);

        return response()->json(['sources' => $items]);
    }

    public function getCategories(Request $request)
    {
        $provider = $request->get('provider');

        if ($provider == 'guardian') {
            $url = 'https://content.guardianapis.com/sections';
            $params = [
                'api-key' => env('GUARDIAN_API_KEY'),
            ];
            $mapping = function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->webTitle,
                ];
            };
            $client = new Client(['base_uri' => $url]);
            $response = $client->request('GET', '', ['query' => $params]);
            $data = json_decode($response->getBody()->getContents());
            $items = array_map($mapping, $data->response->results);
        }


        if ($provider == 'newsapi') {
            $mapping = function ($item) {
                return [
                    'id' => $item,
                    'name' => $item,
                ];
            };
            $data = [
                'business',
                'entertainment',
                'general',
                'health',
                'science',
                'sports',
                'technology',
            ];
            $items = array_map($mapping, $data);
        }




        $items = array_unique($items, SORT_REGULAR);


        return response()->json(['categories' => $items]);
    }

    public function getAuthors(Request $request)
    {
        $provider = $request->get('provider');

        if ($provider == 'newsapi') {
            return response()->json(['message' => 'The NewsAPI does not provide an endpoint for authors']);
        } else if ($provider == 'guardian') {
            $url = 'https://content.guardianapis.com/search';
            $params = [
                'api-key' => env('GUARDIAN_API_KEY'),
                'page-size' => 200,
                'show-fields' => 'byline',
            ];
            $mapping = function ($item) {
                if (!isset($item->fields) || !isset($item->fields->byline)) {
                    return null;
                }
                return $item->fields->byline;
            };
        } else {
            return response()->json(['message' => 'Invalid API provider']);
        }

        $client = new Client(['base_uri' => $url]);
        $response = $client->request('GET', '', ['query' => $params]);
        $data = json_decode($response->getBody()->getContents());

        $items = array_map($mapping, $data->response->results);

        $items = array_filter($items);

        return response()->json(['authors' => $items]);
    }
}
