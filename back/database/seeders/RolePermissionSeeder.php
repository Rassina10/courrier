<?php

namespace Database\Seeders;

use App\Models\Organisation;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        
        $org1 = Organisation::create(['name' => 'Organisation A']);
        $org2 = Organisation::create(['name' => 'Organisation B']);

        
        $permissionsA = [
            Permission::create(['name' => 'view articles', 'guard_name' => 'web', 'organisation_id' => $org1->id]),
            Permission::create(['name' => 'edit articles', 'guard_name' => 'web', 'organisation_id' => $org1->id]),
        ];

        
        $adminA = Role::create(['name' => 'admin', 'guard_name' => 'web', 'organisation_id' => $org1->id]);
        $editorA = Role::create(['name' => 'editor', 'guard_name' => 'web', 'organisation_id' => $org1->id]);

        $adminA->givePermissionTo($permissionsA);
        $editorA->givePermissionTo($permissionsA[0]); 

        
        $permissionsB = [
            Permission::create(['name' => 'manage users', 'guard_name' => 'web', 'organisation_id' => $org2->id]),
        ];

        
        $adminB = Role::create(['name' => 'admin', 'guard_name' => 'web', 'organisation_id' => $org2->id]);
        $adminB->givePermissionTo($permissionsB);

        
        $user1 = User::create([
            'name' => 'Alice',
            'email' => 'alice@example.com',
            'password' => bcrypt('password'),
            'organisation_id' => $org1->id
        ]);
        $user1->assignRole($adminA);

        $user2 = User::create([
            'name' => 'Bob',
            'email' => 'bob@example.com',
            'password' => bcrypt('password'),
            'organisation_id' => $org2->id
        ]);
        $user2->assignRole($adminB);
    }
}
