<?php

namespace App\Services;

use App\Repositories\RoleRepository;

class RoleService
{
    protected $roleRepo;

    public function __construct(RoleRepository $roleRepo)
    {
        $this->roleRepo = $roleRepo;
    }

    public function listRoles()
    {
        return $this->roleRepo->getAll();
    }

    public function getRole($id)
    {
        return $this->roleRepo->findById($id);
    }

    public function createRole(array $data)
    {
        return $this->roleRepo->create($data);
    }

    public function updateRole($id, array $data)
    {
        $role = $this->roleRepo->findById($id);
        return $this->roleRepo->update($role, $data);
    }

    public function deleteRole($id)
    {
        $role = $this->roleRepo->findById($id);
        return $this->roleRepo->delete($role);
    }

    public function assignPermissionsToRole($roleId, array $permissions)
    {
        return $this->roleRepo->assignPermissions($roleId, $permissions);
    }
}
