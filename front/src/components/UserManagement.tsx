import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  UserPlus,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Building,
  Calendar,
  Shield,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { useCurrentUser, type User } from '../App';

// Données de démonstration étendues
const mockUsers: User[] = [
  {
    id: '1',
    nom: 'DIALLO',
    prenom: 'Mamadou',
    email: 'dg@ministere.gov.ml',
    telephone: '+223 20 12 34 56',
    poste: 'Directeur Général',
    direction: 'Direction Générale',
    service: 'Cabinet',
    role: 'dg',
    habilitations: ['all'],
    actif: true
  },
  {
    id: '2',
    nom: 'TRAORE',
    prenom: 'Aissata',
    email: 'courrier@ministere.gov.ml',
    telephone: '+223 20 12 34 57',
    poste: 'Chef Service Courrier',
    direction: 'Direction Générale',
    service: 'Service Courrier',
    role: 'courrier',
    habilitations: ['courrier'],
    actif: true
  },
  {
    id: '3',
    nom: 'KONE',
    prenom: 'Ibrahim',
    email: 'daf@ministere.gov.ml',
    telephone: '+223 20 12 34 58',
    poste: 'Directeur Administratif et Financier',
    direction: 'Direction Administrative et Financière',
    service: 'Direction',
    role: 'directeur',
    habilitations: ['daf'],
    actif: true
  },
  {
    id: '4',
    nom: 'SANGARE',
    prenom: 'Fatoumata',
    email: 'dmines@ministere.gov.ml',
    telephone: '+223 20 12 34 59',
    poste: 'Directrice des Mines',
    direction: 'Direction des Mines',
    service: 'Direction',
    role: 'directeur',
    habilitations: ['mines'],
    actif: true
  },
  {
    id: '5',
    nom: 'COULIBALY',
    prenom: 'Moussa',
    email: 'agent.courrier@ministere.gov.ml',
    telephone: '+223 70 12 34 56',
    poste: 'Agent de Courrier',
    direction: 'Direction Générale',
    service: 'Service Courrier',
    role: 'agent',
    habilitations: ['courrier'],
    actif: true
  },
  {
    id: '6',
    nom: 'KEITA',
    prenom: 'Aminata',
    email: 'akeita@ministere.gov.ml',
    telephone: '+223 70 12 34 57',
    poste: 'Secrétaire de Direction',
    direction: 'Direction Générale',
    service: 'Cabinet',
    role: 'agent',
    habilitations: ['cabinet'],
    actif: false
  }
];

interface UserFormData {
  id?: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  poste: string;
  direction: string;
  service: string;
  role: 'admin' | 'dg' | 'directeur' | 'chef_service' | 'agent' | 'courrier';
  habilitations: string[];
  actif: boolean;
  interimPour?: string;
  dateInterimDebut?: string;
  dateInterimFin?: string;
}

export function UserManagement() {
  const { currentUser } = useCurrentUser();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterDirection, setFilterDirection] = useState('all');
  const [filterStatut, setFilterStatut] = useState('all');
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState<UserFormData>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    poste: '',
    direction: '',
    service: '',
    role: 'agent',
    habilitations: [],
    actif: true
  });

  const directions = [
    'Direction Générale',
    'Direction Administrative et Financière',
    'Direction des Mines',
    'Direction Juridique'
  ];

  const services = {
    'Direction Générale': ['Cabinet', 'Service Courrier'],
    'Direction Administrative et Financière': ['Service Comptabilité', 'Service Ressources Humaines'],
    'Direction des Mines': ['Service Autorisations', 'Service Contrôle'],
    'Direction Juridique': ['Service Contentieux', 'Service Réglementation']
  };

  const roles = [
    { value: 'admin', label: 'Administrateur' },
    { value: 'dg', label: 'Directeur Général' },
    { value: 'directeur', label: 'Directeur' },
    { value: 'chef_service', label: 'Chef de Service' },
    { value: 'courrier', label: 'Service Courrier' },
    { value: 'agent', label: 'Agent' }
  ];

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      poste: '',
      direction: '',
      service: '',
      role: 'agent',
      habilitations: [],
      actif: true
    });
    setEditingUser(null);
  };

  const openEditForm = (user: User) => {
    setFormData({
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone || '',
      poste: user.poste,
      direction: user.direction,
      service: user.service,
      role: user.role,
      habilitations: user.habilitations,
      actif: user.actif,
      interimPour: user.interimPour,
      dateInterimDebut: user.dateInterimDebut?.toISOString().split('T')[0],
      dateInterimFin: user.dateInterimFin?.toISOString().split('T')[0]
    });
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleSubmit = () => {
    if (editingUser) {
      // Modification
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id 
          ? {
              ...user,
              ...formData,
              dateInterimDebut: formData.dateInterimDebut ? new Date(formData.dateInterimDebut) : undefined,
              dateInterimFin: formData.dateInterimFin ? new Date(formData.dateInterimFin) : undefined
            }
          : user
      ));
      alert('Utilisateur modifié avec succès');
    } else {
      // Création
      const newUser: User = {
        ...formData,
        id: Date.now().toString(),
        dateInterimDebut: formData.dateInterimDebut ? new Date(formData.dateInterimDebut) : undefined,
        dateInterimFin: formData.dateInterimFin ? new Date(formData.dateInterimFin) : undefined
      };
      setUsers(prev => [...prev, newUser]);
      alert('Utilisateur créé avec succès');
    }
    
    setShowUserForm(false);
    resetForm();
  };

  const handleDelete = (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
      alert('Utilisateur supprimé avec succès');
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, actif: !user.actif }
        : user
    ));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.poste.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesDirection = filterDirection === 'all' || user.direction === filterDirection;
    const matchesStatut = filterStatut === 'all' || 
      (filterStatut === 'actif' && user.actif) ||
      (filterStatut === 'inactif' && !user.actif);

    return matchesSearch && matchesRole && matchesDirection && matchesStatut;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'dg': return 'bg-purple-500';
      case 'directeur': return 'bg-blue-500';
      case 'chef_service': return 'bg-green-500';
      case 'courrier': return 'bg-orange-500';
      case 'agent': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleText = (role: string) => {
    const roleObj = roles.find(r => r.value === role);
    return roleObj ? roleObj.label : role;
  };

  const updateFormData = (field: keyof UserFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Réinitialiser le service quand la direction change
    if (field === 'direction') {
      setFormData(prev => ({ ...prev, service: '' }));
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Gestion des utilisateurs</h2>
          <p className="text-gray-600">
            {filteredUsers.length} utilisateur(s) trouvé(s)
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button onClick={() => { resetForm(); setShowUserForm(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel utilisateur
          </Button>
          
          <Dialog open={showUserForm} onOpenChange={setShowUserForm}
          >
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Informations personnelles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom *</Label>
                    <Input
                      id="nom"
                      value={formData.nom}
                      onChange={(e) => updateFormData('nom', e.target.value)}
                      placeholder="Nom de famille"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom *</Label>
                    <Input
                      id="prenom"
                      value={formData.prenom}
                      onChange={(e) => updateFormData('prenom', e.target.value)}
                      placeholder="Prénom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      placeholder="adresse@ministere.gov.ml"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input
                      id="telephone"
                      value={formData.telephone}
                      onChange={(e) => updateFormData('telephone', e.target.value)}
                      placeholder="+223 XX XX XX XX"
                    />
                  </div>
                </div>

                {/* Affectation */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Affectation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="poste">Poste *</Label>
                      <Input
                        id="poste"
                        value={formData.poste}
                        onChange={(e) => updateFormData('poste', e.target.value)}
                        placeholder="Intitulé du poste"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Rôle *</Label>
                      <Select value={formData.role} onValueChange={(value: any) => updateFormData('role', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="direction">Direction *</Label>
                      <Select value={formData.direction} onValueChange={(value) => updateFormData('direction', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une direction" />
                        </SelectTrigger>
                        <SelectContent>
                          {directions.map((direction) => (
                            <SelectItem key={direction} value={direction}>
                              {direction}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service">Service *</Label>
                      <Select value={formData.service} onValueChange={(value) => updateFormData('service', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un service" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.direction && services[formData.direction]?.map((service) => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Gestion d'intérim */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Gestion d'intérim (optionnel)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="interimPour">Intérim pour</Label>
                      <Input
                        id="interimPour"
                        value={formData.interimPour || ''}
                        onChange={(e) => updateFormData('interimPour', e.target.value)}
                        placeholder="Nom de la personne remplacée"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateInterimDebut">Date début</Label>
                      <Input
                        id="dateInterimDebut"
                        type="date"
                        value={formData.dateInterimDebut || ''}
                        onChange={(e) => updateFormData('dateInterimDebut', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateInterimFin">Date fin</Label>
                      <Input
                        id="dateInterimFin"
                        type="date"
                        value={formData.dateInterimFin || ''}
                        onChange={(e) => updateFormData('dateInterimFin', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Statut */}
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={formData.actif}
                    onCheckedChange={(checked) => updateFormData('actif', checked)}
                  />
                  <Label>Utilisateur actif</Label>
                </div>

                {/* Boutons */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowUserForm(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingUser ? 'Modifier' : 'Créer'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les rôles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterDirection} onValueChange={setFilterDirection}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les directions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les directions</SelectItem>
                {directions.map((direction) => (
                  <SelectItem key={direction} value={direction}>
                    {direction}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterStatut} onValueChange={setFilterStatut}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="actif">Actifs</SelectItem>
                <SelectItem value="inactif">Inactifs</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setFilterRole('all');
              setFilterDirection('all');
              setFilterStatut('all');
            }}>
              Effacer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des utilisateurs */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Affectation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {user.prenom[0]}{user.nom[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.prenom} {user.nom}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.poste}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {user.email}
                        </div>
                        {user.telephone && (
                          <div className="flex items-center mt-1">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            {user.telephone}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-gray-400" />
                          {user.direction}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {user.service}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${getRoleColor(user.role)} text-white`}>
                        {getRoleText(user.role)}
                      </Badge>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.actif ? (
                          <div className="flex items-center text-green-600">
                            <UserCheck className="h-4 w-4 mr-1" />
                            <span className="text-sm">Actif</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600">
                            <UserX className="h-4 w-4 mr-1" />
                            <span className="text-sm">Inactif</span>
                          </div>
                        )}
                      </div>
                      {user.interimPour && (
                        <div className="text-xs text-blue-600 mt-1">
                          Intérim pour {user.interimPour}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditForm(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          {user.actif ? (
                            <UserX className="h-4 w-4" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun utilisateur trouvé</h3>
              <p className="mt-1 text-sm text-gray-500">
                Essayez de modifier vos critères de recherche ou de filtrage.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistiques en bas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold">{users.length}</p>
                <p className="text-sm text-gray-600">Total utilisateurs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold">{users.filter(u => u.actif).length}</p>
                <p className="text-sm text-gray-600">Utilisateurs actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold">{directions.length}</p>
                <p className="text-sm text-gray-600">Directions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold">
                  {users.filter(u => ['admin', 'dg', 'directeur'].includes(u.role)).length}
                </p>
                <p className="text-sm text-gray-600">Responsables</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}