<?php

namespace App\Services;
use App\Repositories\CourrierRepository;
use Illuminate\Support\Facades\DB;

class CourrierService
{
    protected $courrierRepository;

    public function __construct(CourrierRepository $courrierRepository)
    {
        $this->courrierRepository = $courrierRepository;
    }

    public function getAllCourriers()
    {
        return $this->courrierRepository->getAll();
    }

    public function getCourrierById($id)
    {
        return $this->courrierRepository->findById($id);
    }

    public function createCourrier(array $data)
    {
        return DB::transaction(function() use ($data){
            return $this->courrierRepository->create($data);
        });
    }

    public function updateCourrier($id, array $data)
    {
        return DB::transaction(function () use ($id, $data)
        {
            return $this->courrierRepository->update($id, $data);
        });
    }

    public function deleteCourrier($id)
    {
        return $this->courrierRepository->delete($id);
    }
}