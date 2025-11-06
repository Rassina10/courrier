<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\StructureService;

class StructureController extends Controller
{
    protected $structureService;

    public function __construct(StructureService $structureService)
    {
        $this->structureService = $structureService;
    }

    public function store(Request $request)
    {
      
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'niveau'          => 'nullable|string',
            'type'            => 'nullable|string',
            'organisation_id' => 'required|integer',
            'parent_id'       => 'nullable|integer'
        ]);

        $structure = $this->structureService->createStructure($validated);

        return response()->json($structure, 201);
    }
}
