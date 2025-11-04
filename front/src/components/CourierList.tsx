import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Archive, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  FileText,
  Calendar,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  MoreHorizontal,
  ArrowUpDown,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { useCurrentUser, type Courrier } from '../App';

// Données de démonstration étendues
const mockCourriers: Courrier[] = [
  {
    id: '1',
    numeroRegistre: 'ENT-2024-001',
    type: 'entrant',
    nature: 'Demande',
    reference: 'REF-001-2024',
    dateReception: new Date('2024-01-15'),
    expediteur: {
      nom: 'Société ABC',
      adresse: '123 Rue Example, Bamako',
      email: 'contact@abc.com',
      telephone: '+223 20 12 34 56'
    },
    objet: 'Demande d\'autorisation d\'exploitation minière',
    priorite: 'urgente',
    nbPiecesJointes: 3,
    piecesJointes: ['dossier_technique.pdf', 'plan_localisation.pdf'],
    statut: 'en_cours',
    delaiTraitement: 15,
    dateEcheance: new Date('2024-01-30'),
    dateCreation: new Date('2024-01-15'),
    creeParId: '2',
    circuit: [],
    historique: [],
    mots_cles: ['autorisation', 'exploitation', 'urgent'],
    classification: 'Réglementaire',
    confidentialite: 'public',
    numerise: true
  },
  {
    id: '2',
    numeroRegistre: 'ENT-2024-002',
    type: 'entrant',
    nature: 'Réclamation',
    reference: 'REC-002-2024',
    dateReception: new Date('2024-01-14'),
    expediteur: {
      nom: 'DIABATE Sekou',
      adresse: 'Quartier ACI 2000, Bamako',
      email: 'diabate.sekou@email.com',
      telephone: '+223 70 12 34 56'
    },
    objet: 'Réclamation concernant le retard de traitement de dossier',
    priorite: 'normale',
    nbPiecesJointes: 1,
    piecesJointes: ['reclamation.pdf'],
    statut: 'impute',
    delaiTraitement: 10,
    dateEcheance: new Date('2024-01-24'),
    dateCreation: new Date('2024-01-14'),
    creeParId: '2',
    circuit: [],
    historique: [],
    mots_cles: ['réclamation', 'retard', 'dossier'],
    classification: 'Administratif',
    confidentialite: 'public',
    numerise: true
  },
  {
    id: '3',
    numeroRegistre: 'SOR-2024-001',
    type: 'sortant',
    nature: 'Réponse',
    reference: 'REP-001-2024',
    dateEnvoi: new Date('2024-01-12'),
    destinataire: {
      nom: 'Mairie de Bamako',
      adresse: 'BP 67, Bamako',
      email: 'contact@mairie-bamako.ml',
      telephone: '+223 20 22 33 44'
    },
    objet: 'Réponse à la demande de partenariat',
    priorite: 'normale',
    nbPiecesJointes: 2,
    piecesJointes: ['reponse_officielle.pdf', 'convention.pdf'],
    statut: 'traite',
    delaiTraitement: 7,
    dateEcheance: new Date('2024-01-19'),
    dateCreation: new Date('2024-01-12'),
    creeParId: '1',
    circuit: [],
    historique: [],
    mots_cles: ['partenariat', 'convention', 'mairie'],
    classification: 'Administratif',
    confidentialite: 'public',
    numerise: true
  },
  {
    id: '4',
    numeroRegistre: 'INT-2024-001',
    type: 'interne',
    nature: 'Rapport',
    reference: 'RAPPORT-MENSUEL-01',
    dateCreation: new Date('2024-01-10'),
    expediteur: {
      nom: 'Service Comptabilité',
      adresse: 'Direction Administrative et Financière'
    },
    destinataire: {
      nom: 'Direction Générale',
      adresse: 'Cabinet du Directeur Général'
    },
    objet: 'Rapport mensuel des activités comptables - Décembre 2023',
    priorite: 'normale',
    nbPiecesJointes: 4,
    piecesJointes: ['rapport_mensuel.pdf', 'annexes.xlsx'],
    statut: 'en_cours',
    delaiTraitement: 5,
    dateEcheance: new Date('2024-01-15'),
    creeParId: '3',
    circuit: [],
    historique: [],
    mots_cles: ['rapport', 'comptabilité', 'mensuel'],
    classification: 'Financier',
    confidentialite: 'restreint',
    numerise: true
  },
  {
    id: '5',
    numeroRegistre: 'ENT-2024-003',
    type: 'entrant',
    nature: 'Facture',
    reference: 'FACT-2024-001',
    dateReception: new Date('2024-01-08'),
    expediteur: {
      nom: 'Entreprise SOGEFIC',
      adresse: 'Zone Industrielle, Bamako',
      email: 'factures@sogefic.com',
      telephone: '+223 20 45 67 89'
    },
    objet: 'Facture pour fournitures de bureau - Janvier 2024',
    priorite: 'normale',
    nbPiecesJointes: 2,
    piecesJointes: ['facture.pdf', 'bon_livraison.pdf'],
    statut: 'archive',
    delaiTraitement: 7,
    dateEcheance: new Date('2024-01-15'),
    dateCreation: new Date('2024-01-08'),
    creeParId: '2',
    circuit: [],
    historique: [],
    mots_cles: ['facture', 'fournitures', 'bureau'],
    classification: 'Financier',
    confidentialite: 'public',
    numerise: true
  }
];

interface FilterState {
  type: string;
  statut: string;
  priorite: string;
  classification: string;
  dateDebut: string;
  dateFin: string;
}

export function CourierList() {
  const { currentUser } = useCurrentUser();
  const [courriers, setCourriers] = useState(mockCourriers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCourrier, setSelectedCourrier] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('dateCreation');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const [filters, setFilters] = useState<FilterState>({
    type: 'all',
    statut: 'all',
    priorite: 'all',
    classification: 'all',
    dateDebut: '',
    dateFin: ''
  });

  const updateFilter = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      statut: 'all',
      priorite: 'all',
      classification: 'all',
      dateDebut: '',
      dateFin: ''
    });
    setSearchTerm('');
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filtrage et recherche
  const filteredCourriers = courriers.filter(courrier => {
    // Recherche textuelle
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      courrier.numeroRegistre.toLowerCase().includes(searchLower) ||
      courrier.objet.toLowerCase().includes(searchLower) ||
      courrier.expediteur?.nom.toLowerCase().includes(searchLower) ||
      courrier.destinataire?.nom.toLowerCase().includes(searchLower) ||
      courrier.mots_cles.some(mc => mc.toLowerCase().includes(searchLower));

    // Filtres
    const matchesType = filters.type === 'all' || courrier.type === filters.type;
    const matchesStatut = filters.statut === 'all' || courrier.statut === filters.statut;
    const matchesPriorite = filters.priorite === 'all' || courrier.priorite === filters.priorite;
    const matchesClassification = filters.classification === 'all' || courrier.classification === filters.classification;

    // Filtres de date
    const dateReception = courrier.dateReception || courrier.dateCreation;
    const matchesDateDebut = !filters.dateDebut || dateReception >= new Date(filters.dateDebut);
    const matchesDateFin = !filters.dateFin || dateReception <= new Date(filters.dateFin);

    return matchesSearch && matchesType && matchesStatut && matchesPriorite && 
           matchesClassification && matchesDateDebut && matchesDateFin;
  });

  // Tri
  const sortedCourriers = [...filteredCourriers].sort((a, b) => {
    let aValue: any = a[sortField as keyof Courrier];
    let bValue: any = b[sortField as keyof Courrier];

    if (sortField === 'dateReception' || sortField === 'dateCreation') {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'enregistre': return 'bg-gray-500';
      case 'impute': return 'bg-blue-500';
      case 'en_cours': return 'bg-yellow-500';
      case 'traite': return 'bg-green-500';
      case 'archive': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatutText = (statut: string) => {
    switch (statut) {
      case 'enregistre': return 'Enregistré';
      case 'impute': return 'Imputé';
      case 'en_cours': return 'En cours';
      case 'traite': return 'Traité';
      case 'archive': return 'Archivé';
      default: return statut;
    }
  };

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case 'tres_urgente': return 'bg-red-600';
      case 'urgente': return 'bg-orange-500';
      default: return 'bg-blue-500';
    }
  };

  const getPrioriteText = (priorite: string) => {
    switch (priorite) {
      case 'tres_urgente': return 'Très urgent';
      case 'urgente': return 'Urgent';
      default: return 'Normal';
    }
  };

  const calculerDelaiRestant = (dateEcheance: Date) => {
    const aujourd_hui = new Date();
    const diffTime = dateEcheance.getTime() - aujourd_hui.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortDirection === 'asc' ? 
      <SortAsc className="h-4 w-4" /> : 
      <SortDesc className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Gestion des courriers</h2>
          <p className="text-gray-600">
            {filteredCourriers.length} courrier(s) trouvé(s)
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Barre de recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par numéro, objet, expéditeur, mots-clés..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {(searchTerm || Object.values(filters).some(f => f !== 'all' && f !== '')) && (
              <Button variant="outline" onClick={clearFilters}>
                Effacer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filtres avancés */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle>Filtres avancés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="entrant">Entrant</SelectItem>
                    <SelectItem value="sortant">Sortant</SelectItem>
                    <SelectItem value="interne">Interne</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <Select value={filters.statut} onValueChange={(value) => updateFilter('statut', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="enregistre">Enregistré</SelectItem>
                    <SelectItem value="impute">Imputé</SelectItem>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="traite">Traité</SelectItem>
                    <SelectItem value="archive">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priorité</label>
                <Select value={filters.priorite} onValueChange={(value) => updateFilter('priorite', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="normale">Normale</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                    <SelectItem value="tres_urgente">Très urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Classification</label>
                <Select value={filters.classification} onValueChange={(value) => updateFilter('classification', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="Administratif">Administratif</SelectItem>
                    <SelectItem value="Financier">Financier</SelectItem>
                    <SelectItem value="Juridique">Juridique</SelectItem>
                    <SelectItem value="Technique">Technique</SelectItem>
                    <SelectItem value="Réglementaire">Réglementaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date début</label>
                <Input
                  type="date"
                  value={filters.dateDebut}
                  onChange={(e) => updateFilter('dateDebut', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date fin</label>
                <Input
                  type="date"
                  value={filters.dateFin}
                  onChange={(e) => updateFilter('dateFin', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des courriers */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('numeroRegistre')}
                      className="flex items-center space-x-1 hover:text-gray-700"
                    >
                      <span>Numéro</span>
                      {getSortIcon('numeroRegistre')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('type')}
                      className="flex items-center space-x-1 hover:text-gray-700"
                    >
                      <span>Type</span>
                      {getSortIcon('type')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Objet / Correspondant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('priorite')}
                      className="flex items-center space-x-1 hover:text-gray-700"
                    >
                      <span>Priorité</span>
                      {getSortIcon('priorite')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('statut')}
                      className="flex items-center space-x-1 hover:text-gray-700"
                    >
                      <span>Statut</span>
                      {getSortIcon('statut')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('dateCreation')}
                      className="flex items-center space-x-1 hover:text-gray-700"
                    >
                      <span>Date</span>
                      {getSortIcon('dateCreation')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Délai
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedCourriers.map((courrier) => {
                  const delaiRestant = calculerDelaiRestant(courrier.dateEcheance);
                  const correspondant = courrier.type === 'entrant' ? courrier.expediteur : courrier.destinataire;
                  
                  return (
                    <tr key={courrier.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {courrier.numeroRegistre}
                            </div>
                            {courrier.reference && (
                              <div className="text-xs text-gray-500">
                                {courrier.reference}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline">
                          {courrier.type === 'entrant' ? 'Entrant' : 
                           courrier.type === 'sortant' ? 'Sortant' : 'Interne'}
                        </Badge>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {courrier.objet}
                          </div>
                          {correspondant && (
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                              <User className="h-3 w-3 mr-1" />
                              {correspondant.nom}
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {courrier.mots_cles.slice(0, 2).map((mc, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {mc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={`${getPrioriteColor(courrier.priorite)} text-white`}>
                          {getPrioriteText(courrier.priorite)}
                        </Badge>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={`${getStatutColor(courrier.statut)} text-white`}>
                          {getStatutText(courrier.statut)}
                        </Badge>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {(courrier.dateReception || courrier.dateCreation).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {delaiRestant < 0 ? (
                            <div className="flex items-center text-red-600">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              <span className="text-sm font-medium">
                                {Math.abs(delaiRestant)} j. retard
                              </span>
                            </div>
                          ) : delaiRestant <= 2 ? (
                            <div className="flex items-center text-orange-600">
                              <Clock className="h-4 w-4 mr-1" />
                              <span className="text-sm">
                                {delaiRestant} j. restants
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span className="text-sm">
                                {delaiRestant} j. restants
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {sortedCourriers.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun courrier trouvé</h3>
              <p className="mt-1 text-sm text-gray-500">
                Essayez de modifier vos critères de recherche ou de filtrage.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}