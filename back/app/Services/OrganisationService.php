<?php

namespace App\Services;

use App\Repositories\OrganisationRepository;

class OrganisationService
{
    protected $organisationRepository;

    public function __construct(OrganisationRepository $organisationRepository)
    {
        $this->organisationRepository = $organisationRepository;
    }

    public function listOrganisations()
    {
        return $this->organisationRepository->getAll();
    }

    public function getOrganisationById($id)
    {
        return $this->organisationRepository->findById($id);
    }

    public function createOrganisation(array $data)
    {
        if (strlen($data['name']) < 3) {
            throw new \Exception(" ");
        }

        return $this->organisationRepository->create($data);
    }

    public function updateOrganisation($id, array $data)
    {
        return $this->organisationRepository->update($id, $data);
    }

    public function deleteOrganisation($id)
    {
        return $this->organisationRepository->delete($id);
    }
}
