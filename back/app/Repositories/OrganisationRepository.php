<?php

namespace App\Repositories;

use App\Models\Organisation;

class OrganisationRepository
{
    public function getAll()
    {
        return Organisation::all();
    }

    public function findById($id)
    {
        return Organisation::findOrFail($id);
    }

    public function create(array $data)
    {
        return Organisation::create($data);
    }

    public function update($id, array $data)
    {
        $organisation = Organisation::findOrFail($id);
        $organisation->update($data);
        return $organisation;
    }

    public function delete($id)
    {
        return Organisation::destroy($id);
    }
}
