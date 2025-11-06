<?php

namespace App\Repositories;

use App\Models\Structure;

class StructureRepository
{
    public function getAll()
    {
        return Structure::all();
    }

    public function findById($id)
    {
        return Structure::findOrFail($id);
    }

    public function create(array $data)
    {
        return Structure::create($data);
    }

    public function update($id, array $data)
    {
        $structure = Structure::findOrFail($id);
        $structure->update($data);
        return $structure;
    }

    public function delete($id)
    {
        return Structure::destroy($id);
    }
}
