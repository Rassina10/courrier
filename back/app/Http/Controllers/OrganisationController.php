<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\OrganisationService;

class OrganisationController extends Controller
{
    protected $organisationService;

    public function __construct(OrganisationService $organisationService)
    {
        $this->organisationService = $organisationService;
    }

    public function index ()
    {
        return response()->json($this->organisationService->listOrganisations());
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'type'    => 'nullable|string',
            'address' => 'nullable|string',
            'logo'    => 'nullable|string',
        ]);

        $organisation = $this->organisationService->createOrganisation($validated);

        return response()->json($organisation, 201);
    }

    
}
