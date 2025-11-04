import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Building, 
  Users, 
  User, 
  Edit, 
  Plus, 
  Search,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Calendar,
  UserCheck,
  UserX
} from 'lucide-react';
import { useCurrentUser, type User, type Direction, type Service } from '../App';

// Données de démonstration pour l'organigramme
const mockDirections: Direction[] = [
  {
    id: '1',
    nom: 'Direction Générale',
    code: 'DG',
    responsableId: '1',
    services: [
      {
        id: '1',
        nom: 'Service Courrier',
        code: 'SC',
        directionId: '1',
        responsableId: '2',
        agents: ['2', '5'],
        actif: true
      },
      {
        id: '2',
        nom: 'Cabinet du Directeur',
        code: 'CAB',
        directionId: '1',
        responsableId: '1',
        agents: ['1', '6'],
        actif: true
      }
    ],
    actif: true
  },
  {
    id: '2',
    nom: 'Direction Administrative et Financière',
    code: 'DAF',
    responsableId: '3',
    services: [
      {
        id: '3',
        nom: 'Service Comptabilité',
        code: 'COMPTA',
        directionId: '2',
        responsableId: '7',
        agents: ['7', '8', '9'],
        actif: true
      },
      {
        id: '4',
        nom: 'Service Ressources Humaines',
        code: 'RH',
        directionId: '2',
        responsableId: '10',
        agents: ['10', '11'],
        actif: true
      }
    ],
    actif: true
  },
  {
    id: '3',
    nom: 'Direction des Mines',
    code: 'DMIN',
    responsableId: '4',
    services: [
      {
        id: '5',
        nom: 'Service Autorisations',
        code: 'AUTO',
        directionId: '3',
        responsableId: '12',
        agents: ['12', '13', '14'],
        actif: true
      },
      {
        id: '6',
        nom: 'Service Contrôle',
        code: 'CTRL',
        directionId: '3',
        responsableId: '15',
        agents: ['15', '16'],
        actif: true
      }
    ],
    actif: true
  }
];

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
    id: '7',
    nom: 'DIARRA',
    prenom: 'Aminata',
    email: 'comptabilite@ministere.gov.ml',
    telephone: '+223 70 12 34 58',
    poste: 'Chef Service Comptabilité',
    direction: 'Direction Administrative et Financière',
    service: 'Service Comptabilité',
    role: 'chef_service',
    habilitations: ['comptabilite'],
    actif: true
  },
  {
    id: '12',
    nom: 'TOURE',
    prenom: 'Bakary',
    email: 'autorisations@ministere.gov.ml',
    telephone: '+223 70 12 34 60',
    poste: 'Chef Service Autorisations',
    direction: 'Direction des Mines',
    service: 'Service Autorisations',
    role: 'chef_service',
    habilitations: ['autorisations'],
    actif: true
  }
];

export function Organigramme() {
  const { currentUser } = useCurrentUser();
  const [directions] = useState<Direction[]>(mockDirections);
  const [users] = useState<User[]>(mockUsers);
  const [expandedDirections, setExpandedDirections] = useState<Set<string>>(new Set(['1']));
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'organigramme' | 'liste'>('organigramme');

  const toggleDirection = (directionId: string) => {
    const newExpanded = new Set(expandedDirections);
    if (newExpanded.has(directionId)) {
      newExpanded.delete(directionId);
    } else {
      newExpanded.add(directionId);
    }
    setExpandedDirections(newExpanded);
  };

  const toggleService = (serviceId: string) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId);
    } else {
      newExpanded.add(serviceId);
    }
    setExpandedServices(newExpanded);
  };

  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  const getFilteredUsers = () => {
    if (!searchTerm) return users;
    
    return users.filter(user =>
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.direction.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'dg': return 'bg-purple-500';
      case 'directeur': return 'bg-blue-500';
      case 'chef_service': return 'bg-green-500';
      case 'courrier': return 'bg-orange-500';
      case 'agent': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'dg': return 'Directeur Général';
      case 'directeur': return 'Directeur';
      case 'chef_service': return 'Chef de Service';
      case 'courrier': return 'Service Courrier';
      case 'agent': return 'Agent';
      default: return role;
    }
  };

  const UserCard = ({ user, showDetails = false }: { user: User; showDetails?: boolean }) => (
    <div 
      className={`p-3 border rounded-lg ${selectedUser?.id === user.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'} cursor-pointer transition-colors`}
      onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
    >
      <div className="flex items-center space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">
            {user.prenom[0]}{user.nom[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.prenom} {user.nom}
            </p>
            <Badge className={`${getRoleColor(user.role)} text-white text-xs`}>
              {getRoleText(user.role)}
            </Badge>
            {!user.actif && (
              <Badge variant="destructive" className="text-xs">
                Inactif
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-600 truncate">{user.poste}</p>
          {showDetails && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Mail className="h-3 w-3" />
                <span>{user.email}</span>
              </div>
              {user.telephone && (
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Phone className="h-3 w-3" />
                  <span>{user.telephone}</span>
                </div>
              )}
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Building className="h-3 w-3" />
                <span>{user.direction}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Organigramme</h2>
          <p className="text-gray-600">Structure organisationnelle et affectation des agents</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant={viewMode === 'organigramme' ? 'default' : 'outline'}
            onClick={() => setViewMode('organigramme')}
            size="sm"
          >
            <Building className="h-4 w-4 mr-2" />
            Organigramme
          </Button>
          <Button 
            variant={viewMode === 'liste' ? 'default' : 'outline'}
            onClick={() => setViewMode('liste')}
            size="sm"
          >
            <Users className="h-4 w-4 mr-2" />
            Liste
          </Button>
          {(currentUser?.role === 'admin' || currentUser?.role === 'dg') && (
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          )}
        </div>
      </div>

      {/* Barre de recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un agent, service ou direction..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {viewMode === 'organigramme' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Arbre organisationnel */}
          <div className="lg:col-span-2 space-y-4">
            {directions.map((direction) => {
              const responsable = getUserById(direction.responsableId);
              const isExpanded = expandedDirections.has(direction.id);
              
              return (
                <Card key={direction.id}>
                  <CardHeader 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleDirection(direction.id)}
                  >
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Building className="h-6 w-6 text-blue-600" />
                        <div>
                          <h3 className="text-lg font-semibold">{direction.nom}</h3>
                          <p className="text-sm text-gray-600 font-normal">
                            Code: {direction.code}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {direction.services.length} service(s)
                        </Badge>
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  
                  {isExpanded && (
                    <CardContent className="space-y-4">
                      {/* Responsable de direction */}
                      {responsable && (
                        <div className="pl-4 border-l-2 border-blue-200">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Responsable</h4>
                          <UserCard user={responsable} />
                        </div>
                      )}
                      
                      {/* Services */}
                      <div className="space-y-3">
                        {direction.services.map((service) => {
                          const serviceResponsable = getUserById(service.responsableId);
                          const serviceExpanded = expandedServices.has(service.id);
                          const agents = service.agents.map(agentId => getUserById(agentId)).filter(Boolean);
                          
                          return (
                            <div key={service.id} className="ml-4 border-l-2 border-gray-200 pl-4">
                              <div 
                                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
                                onClick={() => toggleService(service.id)}
                              >
                                <div className="flex items-center space-x-2">
                                  <Users className="h-5 w-5 text-green-600" />
                                  <div>
                                    <h4 className="font-medium">{service.nom}</h4>
                                    <p className="text-sm text-gray-600">Code: {service.code}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-xs">
                                    {agents.length} agent(s)
                                  </Badge>
                                  {serviceExpanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </div>
                              </div>
                              
                              {serviceExpanded && (
                                <div className="mt-3 space-y-2 ml-4">
                                  {/* Responsable de service */}
                                  {serviceResponsable && (
                                    <div>
                                      <h5 className="text-xs font-medium text-gray-500 mb-2">Responsable</h5>
                                      <UserCard user={serviceResponsable} />
                                    </div>
                                  )}
                                  
                                  {/* Autres agents */}
                                  {agents.filter(agent => agent.id !== service.responsableId).length > 0 && (
                                    <div>
                                      <h5 className="text-xs font-medium text-gray-500 mb-2">Agents</h5>
                                      <div className="space-y-2">
                                        {agents
                                          .filter(agent => agent.id !== service.responsableId)
                                          .map((agent) => (
                                            <UserCard key={agent.id} user={agent} />
                                          ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Détails de l'utilisateur sélectionné */}
          <div>
            {selectedUser ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Détails de l'agent</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {selectedUser.prenom[0]}{selectedUser.nom[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedUser.prenom} {selectedUser.nom}</h3>
                      <p className="text-sm text-gray-600">{selectedUser.poste}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedUser.email}</span>
                      </div>
                    </div>
                    
                    {selectedUser.telephone && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Téléphone</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{selectedUser.telephone}</span>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Direction</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedUser.direction}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Service</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedUser.service}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Rôle</label>
                      <div className="mt-1">
                        <Badge className={`${getRoleColor(selectedUser.role)} text-white`}>
                          {getRoleText(selectedUser.role)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Statut</label>
                      <div className="flex items-center space-x-2 mt-1">
                        {selectedUser.actif ? (
                          <>
                            <UserCheck className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600">Actif</span>
                          </>
                        ) : (
                          <>
                            <UserX className="h-4 w-4 text-red-600" />
                            <span className="text-sm text-red-600">Inactif</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {selectedUser.interimPour && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Intérim pour</label>
                        <p className="text-sm mt-1">{selectedUser.interimPour}</p>
                        <p className="text-xs text-gray-500">
                          Du {selectedUser.dateInterimDebut?.toLocaleDateString('fr-FR')} au {selectedUser.dateInterimFin?.toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {(currentUser?.role === 'admin' || currentUser?.role === 'dg') && (
                    <div className="pt-4 border-t">
                      <Button size="sm" className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <User className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Sélectionner un agent
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Cliquez sur un agent pour voir ses détails
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        /* Vue liste */
        <Card>
          <CardHeader>
            <CardTitle>Liste des agents ({getFilteredUsers().length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredUsers().map((user) => (
                <UserCard key={user.id} user={user} showDetails={true} />
              ))}
            </div>
            
            {getFilteredUsers().length === 0 && (
              <div className="text-center py-8">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun agent trouvé</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Essayez de modifier vos critères de recherche.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}