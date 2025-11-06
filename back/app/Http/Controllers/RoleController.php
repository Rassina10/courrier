<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\RoleService;

class RoleController extends Controller
{
    protected $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    public function index()
    {
        return response()->json($this->roleService->listRoles());
    }

    public function store(Request $request)
    {
        
        $request->validate([
            'name' => 'required|string|unique:roles,name',
            'organisation_id'=> 'required|integer'
        ]);

        $role = $this->roleService->createRole(['name' => $request->name,
                                                'organisation_id' => $request->organisation_id
                                            ]);

        return response()->json(['message' => 'Rôle créé avec succès', 'role' => $role], 201);
    }

    public function show($id)
    {
        return response()->json($this->roleService->getRole($id));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name,' . $id
        ]);

        $role = $this->roleService->updateRole($id, ['name' => $request->name]);

        return response()->json(['message' => 'Rôle mis à jour avec succès', 'role' => $role]);
    }

    public function destroy($id)
    {
        $this->roleService->deleteRole($id);
        return response()->json(['message' => 'Rôle supprimé avec succès']);
    }

    public function assignPermissions(Request $request, $id){
        $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'string|exists:permissions,name'
        ]);

        $role = $this->roleService->assignPermissionsToRole($id, $request->permissions);

        return response()->json([
            'message' => 'permissions assignées avec succès',
            'role' => $role
        ]);
    }
}

