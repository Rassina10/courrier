<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Scopes\OrganisationScope;

class Role extends Model
{
    protected static function booted()
    {
        static::addGlobalScope(new OrganisationScope);
    }
}
