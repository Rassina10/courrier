<?php

namespace App\Models;

use App\Scopes\OrganisationScope;
use Illuminate\Database\Eloquent\Model;

class Courrier extends Model
{
    //
    protected $fillable = [
        'organisation_id',
        'user_id',
        'reference',
        'objet',
        'niveau',
        'date_reception',
        'numerise',
        'nature',
        'type',
        'numero_registre',
        'statut'
    ];

    protected static function booted()
    {
        static::addGlobalScope(new OrganisationScope);

        static::creating(function ($model) {
            if (auth('api')->check()) {
                $model->organisation_id = auth('api')->user()->organisation_id;
            }
        });
    }

    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function organisation()
    {
        return $this->belongsTo(Organisation::class);
    }
}
