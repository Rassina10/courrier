<?php
namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class OrganisationScope implements Scope
{
    public function apply(Builder $builder, Model $model)
    {
        
        if (auth('api')->check()) {
            $builder->where(
                $model->getTable() . '.organisation_id', 
                auth('api')->user()->organisation_id
            );
        }
    }
}
