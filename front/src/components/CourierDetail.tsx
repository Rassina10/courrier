import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { 
  FileText, 
  User, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Download,
  Print,
  Share2,
  Edit,
  Archive,
  Send,
  ArrowRight,
  History,
  FileSignature,
  MapPin,
  Phone,
  Mail,
  Building,
  Tag,
  Shield,
  Paperclip,
  Eye,
  MessageSquare,
  Users,
  Plus
} from 'lucide-react';
import { useCurrentUser, type Courrier, type HistoriqueAction, type Imputation } from '../App';

interface CourierDetailProps {
  courrierId: string;
  onClose: () => void;
}

// Données de démonstration pour un courrier spécifique
const mockCourrier: Courrier = {
  id: '1',
  numeroRegistre: 'ENT-2024-001',
  type: 'entrant',
  nature: 'Demande',
  reference: 'REF-001-2024',
  dateReception: new Date('2024-01-15'),
  expediteur: {
    nom: 'Société ABC Mining',
    adresse: '123 Rue Example, ACI 2000, Bamako',
    email: 'direction@abc-mining.com',
    telephone: '+223 20 12 34 56'
  },
  objet: 'Demande d\'autorisation d\'exploitation minière pour le site de Kéniéba',
  priorite: 'urgente',
  nbPiecesJointes: 3,
  piecesJointes: [
    'dossier_technique_complet.pdf',
    'plan_de_localisation.pdf',
    'certificat_de_conformite.pdf'
  ],
  statut: 'en_cours',
  delaiTraitement: 15,
  dateEcheance: new Date('2024-01-30'),
  dateCreation: new Date('2024-01-15'),
  creeParId: '2',
  circuit: [],
  historique: [],
  mots_cles: ['autorisation', 'exploitation', 'minière', 'urgent', 'kéniéba'],
  classification: 'Réglementaire',
  confidentialite: 'public',
  numerise: true,
  fichierPDF: 'courrier_001.pdf'
};

const mockHistorique: HistoriqueAction[] = [
  {
    id: '1',
    courrierId: '1',
    action: 'Enregistrement',
    description: 'Courrier enregistré dans le système',
    userId: '2',
    dateAction: new Date('2024-01-15T09:00:00'),
    metadata: { numeroRegistre: 'ENT-2024-001' }
  },
  {
    id: '2',
    courrierId: '1',
    action: 'Numérisation',
    description: 'Document numérisé et archivé',
    userId: '2',
    dateAction: new Date('2024-01-15T09:30:00')
  },
  {
    id: '3',
    courrierId: '1',
    action: 'Imputation',
    description: 'Courrier imputé à la Direction des Mines',
    userId: '1',
    dateAction: new Date('2024-01-15T14:00:00'),
    metadata: { direction: 'Direction des Mines', instructions: 'Traiter en urgence' }
  },
  {
    id: '4',
    courrierId: '1',
    action: 'Acceptation',
    description: 'Imputation acceptée par la Direction des Mines',
    userId: '4',
    dateAction: new Date('2024-01-16T08:00:00')
  }
];

const mockImputations: Imputation[] = [
  {
    id: '1',
    courrierId: '1',
    deUserId: '1',
    versUserId: '4',
    versDirection: 'Direction des Mines',
    versService: 'Service Autorisations',
    instructions: 'Examiner la demande d\'autorisation en urgence. Vérifier la conformité du dossier technique.',
    dateImputation: new Date('2024-01-15T14:00:00'),
    dateTraitement: new Date('2024-01-16T08:00:00'),
    statut: 'accepte',
    commentaires: 'Dossier reçu et pris en charge. Analyse en cours.',
    fichesAccompagnement: []
  }
];

export function CourierDetail({ courrierId, onClose }: CourierDetailProps) {
  const { currentUser } = useCurrentUser();
  const [courrier] = useState<Courrier>(mockCourrier);
  const [historique] = useState<HistoriqueAction[]>(mockHistorique);
  const [imputations] = useState<Imputation[]>(mockImputations);
  const [activeTab, setActiveTab] = useState('details');
  
  // États pour les actions
  const [showImputationForm, setShowImputationForm] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [imputationData, setImputationData] = useState({
    versDirection: '',
    versService: '',
    versUserId: '',
    instructions: '',
    commentaires: ''
  });
  const [responseData, setResponseData] = useState({
    objet: '',
    contenu: '',
    piecesJointes: []
  });

  const calculerDelaiRestant = (dateEcheance: Date) => {
    const aujourd_hui = new Date();
    const diffTime = dateEcheance.getTime() - aujourd_hui.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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

  const handleImputation = () => {
    // Logique d'imputation
    console.log('Imputation:', imputationData);
    setShowImputationForm(false);
    alert('Courrier imputé avec succès');
  };

  const handleResponse = () => {
    // Logique de réponse
    console.log('Réponse:', responseData);
    setShowResponseForm(false);
    alert('Réponse enregistrée avec succès');
  };

  const delaiRestant = calculerDelaiRestant(courrier.dateEcheance);

  const tabs = [
    { id: 'details', label: 'Détails', icon: FileText },
    { id: 'circuit', label: 'Circuit de traitement', icon: Users },
    { id: 'historique', label: 'Historique', icon: History },
    { id: 'pieces', label: 'Pièces jointes', icon: Paperclip }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onClose}>
            ← Retour
          </Button>
          <div>
            <h2 className="text-2xl font-semibold">{courrier.numeroRegistre}</h2>
            <p className="text-gray-600">{courrier.objet}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge className={`${getStatutColor(courrier.statut)} text-white`}>
            {getStatutText(courrier.statut)}
          </Badge>
          <Badge className={`${getPrioriteColor(courrier.priorite)} text-white`}>
            {getPrioriteText(courrier.priorite)}
          </Badge>
        </div>
      </div>

      {/* Alertes de délai */}
      {delaiRestant <= 2 && delaiRestant >= 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <div>
              <p className="font-medium text-orange-800">
                Attention: délai proche de l'expiration
              </p>
              <p className="text-sm text-orange-700">
                {delaiRestant} jour(s) restant(s) pour traiter ce courrier
              </p>
            </div>
          </div>
        </div>
      )}

      {delaiRestant < 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium text-red-800">
                Courrier en retard
              </p>
              <p className="text-sm text-red-700">
                {Math.abs(delaiRestant)} jour(s) de retard
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setShowImputationForm(true)}
              disabled={courrier.statut === 'archive'}
            >
              <Send className="h-4 w-4 mr-2" />
              Imputer
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowResponseForm(true)}
              disabled={courrier.statut === 'archive'}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Répondre
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
            <Button variant="outline">
              <Print className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Partager
            </Button>
            {courrier.statut === 'traite' && (
              <Button variant="outline">
                <Archive className="h-4 w-4 mr-2" />
                Archiver
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation par onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations principales */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Informations du courrier</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <p className="mt-1">{courrier.type === 'entrant' ? 'Courrier entrant' : 'Courrier sortant'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nature</label>
                  <p className="mt-1">{courrier.nature}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Référence</label>
                  <p className="mt-1">{courrier.reference || 'Aucune'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Classification</label>
                  <p className="mt-1">{courrier.classification}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Confidentialité</label>
                  <p className="mt-1 flex items-center space-x-1">
                    <Shield className="h-4 w-4" />
                    <span>{courrier.confidentialite}</span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date de réception</label>
                  <p className="mt-1 flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{courrier.dateReception?.toLocaleDateString('fr-FR')}</span>
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-gray-500">Objet</label>
                <p className="mt-1 text-gray-900">{courrier.objet}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Mots-clés</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {courrier.mots_cles.map((motCle, index) => (
                    <Badge key={index} variant="secondary">
                      <Tag className="h-3 w-3 mr-1" />
                      {motCle}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Correspondant et délais */}
          <div className="space-y-6">
            {/* Correspondant */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>{courrier.type === 'entrant' ? 'Expéditeur' : 'Destinataire'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {((courrier.type === 'entrant' && courrier.expediteur) || 
                  (courrier.type === 'sortant' && courrier.destinataire)) && (
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">
                        {courrier.type === 'entrant' ? courrier.expediteur?.nom : courrier.destinataire?.nom}
                      </p>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {courrier.type === 'entrant' ? courrier.expediteur?.adresse : courrier.destinataire?.adresse}
                        </span>
                      </div>
                      {((courrier.type === 'entrant' && courrier.expediteur?.telephone) ||
                        (courrier.type === 'sortant' && courrier.destinataire?.telephone)) && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>
                            {courrier.type === 'entrant' ? courrier.expediteur?.telephone : courrier.destinataire?.telephone}
                          </span>
                        </div>
                      )}
                      {((courrier.type === 'entrant' && courrier.expediteur?.email) ||
                        (courrier.type === 'sortant' && courrier.destinataire?.email)) && (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>
                            {courrier.type === 'entrant' ? courrier.expediteur?.email : courrier.destinataire?.email}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Délais et échéances */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Délais</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Délai de traitement</label>
                    <p className="mt-1">{courrier.delaiTraitement} jours</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date d'échéance</label>
                    <p className="mt-1">{courrier.dateEcheance.toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Temps restant</label>
                    <div className="mt-1">
                      {delaiRestant < 0 ? (
                        <div className="flex items-center text-red-600">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          <span className="font-medium">
                            {Math.abs(delaiRestant)} j. de retard
                          </span>
                        </div>
                      ) : (
                        <div className={`flex items-center ${delaiRestant <= 2 ? 'text-orange-600' : 'text-green-600'}`}>
                          <Clock className="h-4 w-4 mr-1" />
                          <span>
                            {delaiRestant} j. restants
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'circuit' && (
        <Card>
          <CardHeader>
            <CardTitle>Circuit de traitement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {imputations.length > 0 ? (
                imputations.map((imputation, index) => (
                  <div key={imputation.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant={imputation.statut === 'accepte' ? 'default' : 'secondary'}>
                          {imputation.statut === 'accepte' ? 'Accepté' : 'En attente'}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {imputation.dateImputation.toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      {imputation.statut === 'accepte' && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="font-medium text-gray-500">Vers</label>
                        <p>{imputation.versDirection} - {imputation.versService}</p>
                      </div>
                      <div>
                        <label className="font-medium text-gray-500">Date de traitement</label>
                        <p>{imputation.dateTraitement?.toLocaleDateString('fr-FR') || 'En attente'}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <label className="font-medium text-gray-500">Instructions</label>
                      <p className="text-sm mt-1">{imputation.instructions}</p>
                    </div>
                    
                    {imputation.commentaires && (
                      <div className="mt-3">
                        <label className="font-medium text-gray-500">Commentaires</label>
                        <p className="text-sm mt-1">{imputation.commentaires}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune imputation</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Ce courrier n'a pas encore été imputé.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'historique' && (
        <Card>
          <CardHeader>
            <CardTitle>Historique des actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {historique.map((action, index) => (
                <div key={action.id} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <History className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{action.action}</p>
                      <p className="text-sm text-gray-500">
                        {action.dateAction.toLocaleDateString('fr-FR')} à {action.dateAction.toLocaleTimeString('fr-FR')}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{action.description}</p>
                    {action.metadata && (
                      <div className="mt-2 text-xs text-gray-500">
                        {Object.entries(action.metadata).map(([key, value]) => (
                          <span key={key} className="mr-3">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'pieces' && (
        <Card>
          <CardHeader>
            <CardTitle>Pièces jointes ({courrier.nbPiecesJointes})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {courrier.piecesJointes.map((piece, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="font-medium">{piece}</p>
                      <p className="text-sm text-gray-500">Document PDF</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Voir
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulaire d'imputation */}
      {showImputationForm && (
        <Card>
          <CardHeader>
            <CardTitle>Imputer le courrier</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Direction</label>
                <Select 
                  value={imputationData.versDirection}
                  onValueChange={(value) => setImputationData(prev => ({ ...prev, versDirection: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Direction des Mines">Direction des Mines</SelectItem>
                    <SelectItem value="Direction Administrative et Financière">Direction Administrative et Financière</SelectItem>
                    <SelectItem value="Direction Juridique">Direction Juridique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Service</label>
                <Select 
                  value={imputationData.versService}
                  onValueChange={(value) => setImputationData(prev => ({ ...prev, versService: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Service Autorisations">Service Autorisations</SelectItem>
                    <SelectItem value="Service Comptabilité">Service Comptabilité</SelectItem>
                    <SelectItem value="Service Contentieux">Service Contentieux</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Instructions de traitement</label>
              <Textarea
                value={imputationData.instructions}
                onChange={(e) => setImputationData(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="Instructions détaillées pour le traitement du courrier"
                rows={4}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={handleImputation}>
                <Send className="h-4 w-4 mr-2" />
                Imputer
              </Button>
              <Button variant="outline" onClick={() => setShowImputationForm(false)}>
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulaire de réponse */}
      {showResponseForm && (
        <Card>
          <CardHeader>
            <CardTitle>Rédiger une réponse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Objet de la réponse</label>
              <Input
                value={responseData.objet}
                onChange={(e) => setResponseData(prev => ({ ...prev, objet: e.target.value }))}
                placeholder="Objet de la réponse"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Contenu</label>
              <Textarea
                value={responseData.contenu}
                onChange={(e) => setResponseData(prev => ({ ...prev, contenu: e.target.value }))}
                placeholder="Contenu de la réponse"
                rows={6}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={handleResponse}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Envoyer la réponse
              </Button>
              <Button variant="outline" onClick={() => setShowResponseForm(false)}>
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}