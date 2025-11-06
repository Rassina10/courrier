<?php

namespace App\Repositories;

use App\Models\Courrier;

class CourrierRepository 
{
    public function getAll()
    {
        return Courrier::all();
    }

    public function findById($id)
    {
        return Courrier::findOrFail($id);
    }

    public function create(array $data)
    {
        return Courrier::create($data);
    }

    public function update($id, array $data)
    {
        $courrier = Courrier::findOrFail($id);
        $courrier->update($data);
        return $courrier;
    }

    public function delete($id)
    {
        $courrier = Courrier::findOrFail($id);
        return $courrier->delate();
    }
}
