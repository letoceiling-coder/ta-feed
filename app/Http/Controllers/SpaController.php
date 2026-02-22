<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SpaController extends Controller
{
    /**
     * Return the SPA view for all frontend routes
     */
    public function index()
    {
        return view('spa');
    }
}
