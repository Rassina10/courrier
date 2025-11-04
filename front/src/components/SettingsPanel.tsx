import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Settings, 
  Clock, 
  Tag, 
  Shield, 
  Bell, 
  Mail, 
  FileText,
  Database,
  Download,
  Upload,
  Trash2,
  Plus,
  Edit,
  Save,
  AlertTriangle,
  CheckCircle,
  Info,
  Archive
} from 'lucide-react';
import { useCurrentUser } from '../App';

interface DelaiType {
  id: string;
  nature: string;
  delaiJours: number;
  actif: boolean;
}

interface NotificationTemplate {
  id: string;
  nom: string;
  type: 'email' | 'interne';
  evenement: string;
  sujet: string;
  contenu: string;
  actif: boolean;
}

interface ParametreSysteme {
  id: string;
  categorie: string;
  nom: string;
  valeur: string;
  description: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  options?: string[];
}

export function SettingsPanel() {
  const { currentUser } = useCurrentUser();
  
  // Données de démonstration pour les paramètres
  const [delaisTypes, setDelaisTypes] = useState<DelaiType[]>([
    { id: '1', nature: 'Demande', delaiJours: 15, actif: true },
    { id: '2', nature: 'Réclamation', delaiJours: 10, actif: true },
    { id: '3', nature: 'Information', delaiJours: 5, actif: true },
    { id: '4', nature: 'Convocation', delaiJours: 3, actif: true },
    { id: '5', nature: 'Rapport', delaiJours: 30, actif: true },
    { id: '6', nature: 'Facture', delaiJours: 7, actif: true },
    { id: '7', nature: 'Contrat', delaiJours: 30, actif: true },
    { id: '8', nature: 'Autorisation', delaiJours: 20, actif: true }
  ]);

  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      nom: 'Notification nouveau courrier',
      type: 'email',
      evenement: 'nouveau_courrier',
      sujet: 'Nouveau courrier: {{numeroRegistre}}',
      contenu: 'Un nouveau courrier {{numeroRegistre}} vous a été assigné.\n\nObjet: {{objet}}\nExpéditeur: {{expediteur}}\nPriorité: {{priorite}}',
      actif: true
    },
    {
      id: '2',
      nom: 'Rappel délai proche',
      type: 'email',
      evenement: 'delai_proche',
      sujet: 'Rappel: Délai proche pour {{numeroRegistre}}',
      contenu: 'Le courrier {{numeroRegistre}} arrive à échéance dans {{joursRestants}} jour(s).',
      actif: true
    },
    {
      id: '3',
      nom: 'Alerte dépassement délai',
      type: 'email',
      evenement: 'delai_depasse',
      sujet: 'Alerte: Délai dépassé pour {{numeroRegistre}}',
      contenu: 'Le courrier {{numeroRegistre}} est en retard de {{joursRetard}} jour(s).',
      actif: true
    }
  ]);

  const [parametresSysteme, setParametresSysteme] = useState<ParametreSysteme[]>([
    {
      id: '1',
      categorie: 'Général',
      nom: 'Nom de l\'organisation',
      valeur: 'Ministère des Mines - République du Mali',
      description: 'Nom complet de l\'organisation',
      type: 'text'
    },
    {
      id: '2',
      categorie: 'Général',
      nom: 'Adresse',
      valeur: 'BP 12345, Bamako, Mali',
      description: 'Adresse officielle',
      type: 'text'
    },
    {
      id: '3',
      categorie: 'Courrier',
      nom: 'Délai alerte (jours)',
      valeur: '2',
      description: 'Nombre de jours avant échéance pour envoyer une alerte',
      type: 'number'
    },
    {
      id: '4',
      categorie: 'Courrier',
      nom: 'Auto-archivage',
      valeur: 'true',
      description: 'Archiver automatiquement les courriers traités après 30 jours',
      type: 'boolean'
    },
    {
      id: '5',
      categorie: 'Sécurité',
      nom: 'Durée de session (minutes)',
      valeur: '480',
      description: 'Durée avant déconnexion automatique',
      type: 'number'
    },
    {
      id: '6',
      categorie: 'Notifications',
      nom: 'Notifications par email',
      valeur: 'true',
      description: 'Activer les notifications par email',
      type: 'boolean'
    }
  ]);

  const [nouveauDelai, setNouveauDelai] = useState({ nature: '', delaiJours: 15 });
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [showTemplateForm, setShowTemplateForm] = useState(false);

  const [templateForm, setTemplateForm] = useState({
    nom: '',
    type: 'email' as 'email' | 'interne',
    evenement: '',
    sujet: '',
    contenu: ''
  });

  const ajouterDelai = () => {
    if (nouveauDelai.nature.trim()) {
      const newDelai: DelaiType = {
        id: Date.now().toString(),
        nature: nouveauDelai.nature,
        delaiJours: nouveauDelai.delaiJours,
        actif: true
      };
      setDelaisTypes(prev => [...prev, newDelai]);
      setNouveauDelai({ nature: '', delaiJours: 15 });
    }
  };

  const modifierDelai = (id: string, delaiJours: number) => {
    setDelaisTypes(prev => 
      prev.map(delai => 
        delai.id === id ? { ...delai, delaiJours } : delai
      )
    );
  };

  const toggleDelai = (id: string) => {
    setDelaisTypes(prev => 
      prev.map(delai => 
        delai.id === id ? { ...delai, actif: !delai.actif } : delai
      )
    );
  };

  const supprimerDelai = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce délai ?')) {
      setDelaisTypes(prev => prev.filter(delai => delai.id !== id));
    }
  };

  const openTemplateForm = (template?: NotificationTemplate) => {
    if (template) {
      setTemplateForm({
        nom: template.nom,
        type: template.type,
        evenement: template.evenement,
        sujet: template.sujet,
        contenu: template.contenu
      });
      setEditingTemplate(template);
    } else {
      setTemplateForm({
        nom: '',
        type: 'email',
        evenement: '',
        sujet: '',
        contenu: ''
      });
      setEditingTemplate(null);
    }
    setShowTemplateForm(true);
  };

  const sauvegarderTemplate = () => {
    if (editingTemplate) {
      setTemplates(prev => 
        prev.map(template => 
          template.id === editingTemplate.id 
            ? { ...template, ...templateForm }
            : template
        )
      );
    } else {
      const newTemplate: NotificationTemplate = {
        id: Date.now().toString(),
        ...templateForm,
        actif: true
      };
      setTemplates(prev => [...prev, newTemplate]);
    }
    setShowTemplateForm(false);
  };

  const toggleTemplate = (id: string) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === id ? { ...template, actif: !template.actif } : template
      )
    );
  };

  const supprimerTemplate = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      setTemplates(prev => prev.filter(template => template.id !== id));
    }
  };

  const modifierParametre = (id: string, valeur: string) => {
    setParametresSysteme(prev => 
      prev.map(param => 
        param.id === id ? { ...param, valeur } : param
      )
    );
  };

  const exporterParametres = () => {
    const data = {
      delaisTypes,
      templates,
      parametresSysteme,
      dateExport: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'parametres_courrier.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const evenements = [
    { value: 'nouveau_courrier', label: 'Nouveau courrier' },
    { value: 'imputation', label: 'Imputation' },
    { value: 'delai_proche', label: 'Délai proche' },
    { value: 'delai_depasse', label: 'Délai dépassé' },
    { value: 'validation', label: 'Validation requise' },
    { value: 'reponse', label: 'Réponse reçue' }
  ];

  const parametresParCategorie = parametresSysteme.reduce((acc, param) => {
    if (!acc[param.categorie]) {
      acc[param.categorie] = [];
    }
    acc[param.categorie].push(param);
    return acc;
  }, {} as Record<string, ParametreSysteme[]>);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Paramètres système</h2>
          <p className="text-gray-600">Configuration de l'application de gestion de courrier</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exporterParametres}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
        </div>
      </div>

      <Tabs defaultValue="delais" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="delais" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Délais</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="systeme" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Système</span>
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Maintenance</span>
          </TabsTrigger>
        </TabsList>

        {/* Gestion des délais */}
        <TabsContent value="delais">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Délais de traitement par nature</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Formulaire d'ajout */}
                <div className="flex items-end space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <Label>Nature du courrier</Label>
                    <Input
                      value={nouveauDelai.nature}
                      onChange={(e) => setNouveauDelai(prev => ({ ...prev, nature: e.target.value }))}
                      placeholder="Ex: Demande spéciale"
                    />
                  </div>
                  <div>
                    <Label>Délai (jours)</Label>
                    <Input
                      type="number"
                      value={nouveauDelai.delaiJours}
                      onChange={(e) => setNouveauDelai(prev => ({ ...prev, delaiJours: parseInt(e.target.value) }))}
                      className="w-24"
                      min="1"
                    />
                  </div>
                  <Button onClick={ajouterDelai}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>

                {/* Liste des délais */}
                <div className="space-y-2">
                  {delaisTypes.map((delai) => (
                    <div key={delai.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={delai.actif}
                          onCheckedChange={() => toggleDelai(delai.id)}
                        />
                        <div>
                          <p className="font-medium">{delai.nature}</p>
                          <p className="text-sm text-gray-600">{delai.delaiJours} jour(s)</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={delai.delaiJours}
                          onChange={(e) => modifierDelai(delai.id, parseInt(e.target.value))}
                          className="w-20"
                          min="1"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => supprimerDelai(delai.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Règles automatiques */}
            <Card>
              <CardHeader>
                <CardTitle>Règles automatiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Auto-assignation des délais</p>
                    <p className="text-sm text-gray-600">
                      Assigner automatiquement le délai selon la nature du courrier
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Calcul des jours ouvrables</p>
                    <p className="text-sm text-gray-600">
                      Exclure les weekends et jours fériés du calcul des délais
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Templates de notifications</span>
                  </div>
                  <Button onClick={() => openTemplateForm()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau template
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {templates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <Switch
                            checked={template.actif}
                            onCheckedChange={() => toggleTemplate(template.id)}
                          />
                          <div>
                            <h4 className="font-medium">{template.nom}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={template.type === 'email' ? 'default' : 'secondary'}>
                                {template.type === 'email' ? 'Email' : 'Interne'}
                              </Badge>
                              <Badge variant="outline">
                                {evenements.find(e => e.value === template.evenement)?.label}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openTemplateForm(template)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => supprimerTemplate(template.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <p><strong>Sujet:</strong> {template.sujet}</p>
                        <p className="mt-1"><strong>Contenu:</strong> {template.contenu.substring(0, 100)}...</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Formulaire de template */}
            {showTemplateForm && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingTemplate ? 'Modifier le template' : 'Nouveau template'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nom du template</Label>
                      <Input
                        value={templateForm.nom}
                        onChange={(e) => setTemplateForm(prev => ({ ...prev, nom: e.target.value }))}
                        placeholder="Nom du template"
                      />
                    </div>
                    
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={templateForm.type}
                        onValueChange={(value: 'email' | 'interne') => 
                          setTemplateForm(prev => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="interne">Notification interne</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Événement déclencheur</Label>
                    <Select
                      value={templateForm.evenement}
                      onValueChange={(value) => setTemplateForm(prev => ({ ...prev, evenement: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un événement" />
                      </SelectTrigger>
                      <SelectContent>
                        {evenements.map((evenement) => (
                          <SelectItem key={evenement.value} value={evenement.value}>
                            {evenement.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Sujet</Label>
                    <Input
                      value={templateForm.sujet}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, sujet: e.target.value }))}
                      placeholder="Sujet du message (utiliser {{variable}} pour les variables)"
                    />
                  </div>
                  
                  <div>
                    <Label>Contenu</Label>
                    <Textarea
                      value={templateForm.contenu}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, contenu: e.target.value }))}
                      placeholder="Contenu du message (utiliser {{variable}} pour les variables)"
                      rows={6}
                    />
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Variables disponibles:</h4>
                    <div className="text-sm text-blue-700 grid grid-cols-2 gap-2">
                      <span>{{numeroRegistre}}</span>
                      <span>{{objet}}</span>
                      <span>{{expediteur}}</span>
                      <span>{{destinataire}}</span>
                      <span>{{priorite}}</span>
                      <span>{{dateEcheance}}</span>
                      <span>{{joursRestants}}</span>
                      <span>{{joursRetard}}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={sauvegarderTemplate}>
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </Button>
                    <Button variant="outline" onClick={() => setShowTemplateForm(false)}>
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Paramètres système */}
        <TabsContent value="systeme">
          <div className="space-y-6">
            {Object.entries(parametresParCategorie).map(([categorie, params]) => (
              <Card key={categorie}>
                <CardHeader>
                  <CardTitle>{categorie}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {params.map((param) => (
                      <div key={param.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{param.nom}</h4>
                          <p className="text-sm text-gray-600">{param.description}</p>
                        </div>
                        
                        <div className="w-48">
                          {param.type === 'boolean' ? (
                            <Switch
                              checked={param.valeur === 'true'}
                              onCheckedChange={(checked) => 
                                modifierParametre(param.id, checked ? 'true' : 'false')
                              }
                            />
                          ) : param.type === 'select' && param.options ? (
                            <Select
                              value={param.valeur}
                              onValueChange={(value) => modifierParametre(param.id, value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {param.options.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              type={param.type === 'number' ? 'number' : 'text'}
                              value={param.valeur}
                              onChange={(e) => modifierParametre(param.id, e.target.value)}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Maintenance */}
        <TabsContent value="maintenance">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Maintenance de la base de données</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Archivage automatique</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Archiver automatiquement les courriers traités de plus de 30 jours
                    </p>
                    <Button size="sm">
                      <Archive className="h-4 w-4 mr-2" />
                      Lancer l'archivage
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Nettoyage des fichiers</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Supprimer les fichiers temporaires et orphelins
                    </p>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Nettoyer
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Sauvegarde</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Créer une sauvegarde complète de la base de données
                    </p>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Vérification d'intégrité</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Vérifier l'intégrité des données et fichiers
                    </p>
                    <Button size="sm" variant="outline">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Vérifier
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Logs système</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Info className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-600">2024-01-15 10:30:25</span>
                    <span>Sauvegarde automatique effectuée</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-gray-600">2024-01-15 09:00:00</span>
                    <span>Archivage automatique: 45 courriers archivés</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="text-gray-600">2024-01-14 23:55:12</span>
                    <span>Délai dépassé détecté pour 3 courriers</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}