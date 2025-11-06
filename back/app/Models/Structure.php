<?php

namespace App\Models;

use App\Scopes\OrganisationScope;
use Illuminate\Database\Eloquent\Model;

class Structure extends Model
{
    
    protected $fillable =[
        'name',
        'niveau',
        'type',
        'organisation_id',
        'parent_id'
    ];

    protected static function booted()
    {
        static::addGlobalScope(new OrganisationScope);
    }

    public function organisation()
    {
        return $this->belongsTo(Organisation::class);
    }
    public function parent(){
        return $this->belongsTo(Structure::class);
    }
    public function children(){
        return $this-> hasMany(Structure::class);
    }

   
}
