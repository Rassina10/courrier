<?php

namespace App\Services;

use App\Repositories\StructureRepository;

class StructureService
{
    protected $structureRepository;

    public function __construct(StructureRepository $structureRepository)
    {
        $this->structureRepository = $structureRepository;
    }

    public function getAllStructures()
    {
        return $this->structureRepository->getAll();
    }

    public function getStructureById($id)
    {
        return $this->structureRepository->findById($id);
    }

    public function createStructure(array $data)
    {

        if (empty($data['name'])) {
            throw new \Exception("Le nom de la structure est obligatoire.");
        }

        if (isset($data['niveau']) && $data['niveau'] < 0) {
            throw new \Exception("Le niveau doit être positif.");
        }

        return $this->structureRepository->create($data);
    }

    public function updateStructure($id, array $data)
    {
        return $this->structureRepository->update($id, $data);
    }

    public function deleteStructure($id)
    {
        return $this->structureRepository->delete($id);
    }
}
