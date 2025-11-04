import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Upload, 
  FileText, 
  X, 
  Plus, 
  Save, 
  Send, 
  AlertCircle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building,
  User,
  Hash,
  Clock,
  Tag,
  Shield
} from 'lucide-react';
import { useCurrentUser } from '../App';

interface FormData {
  type: 'entrant' | 'sortant' | 'interne';
  nature: string;
  reference: string;
  expediteur?: {
    nom: string;
    adresse: string;
    telephone?: string;
    email?: string;
  };
  destinataire?: {
    nom: string;
    adresse: string;
    telephone?: string;
    email?: string;
  };
  objet: string;
  priorite: 'normale' | 'urgente' | 'tres_urgente';
  delaiTraitement: number;
  classification: string;
  confidentialite: 'public' | 'restreint' | 'confidentiel';
  mots_cles: string[];
  piecesJointes: File[];
  observations: string;
}

export function CourierForm() {
  const { currentUser } = useCurrentUser();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    type: 'entrant',
    nature: '',
    reference: '',
    objet: '',
    priorite: 'normale',
    delaiTraitement: 15,
    classification: '',
    confidentialite: 'public',
    mots_cles: [],
    piecesJointes: [],
    observations: ''
  });

  const [motCleInput, setMotCleInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const natures = [
    'Demande', 'Réclamation', 'Information', 'Convocation', 
    'Rapport', 'Facture', 'Contrat', 'Autorisation', 'Certificat'
  ];

  const classifications = [
    'Administratif', 'Financier', 'Juridique', 'Technique', 
    'Commercial', 'Réglementaire', 'Ressources Humaines'
  ];

  const delaisStandards = {
    'Demande': 15,
    'Réclamation': 10,
    'Information': 5,
    'Convocation': 3,
    'Rapport': 30,
    'Facture': 7,
    'Contrat': 30,
    'Autorisation': 20,
    'Certificat': 10
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-ajustement du délai selon la nature
    if (field === 'nature' && delaisStandards[value]) {
      setFormData(prev => ({
        ...prev,
        delaiTraitement: delaisStandards[value]
      }));
    }
  };

  const updateCorrespondant = (type: 'expediteur' | 'destinataire', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const ajouterMotCle = () => {
    if (motCleInput.trim() && !formData.mots_cles.includes(motCleInput.trim())) {
      setFormData(prev => ({
        ...prev,
        mots_cles: [...prev.mots_cles, motCleInput.trim()]
      }));
      setMotCleInput('');
    }
  };

  const supprimerMotCle = (motCle: string) => {
    setFormData(prev => ({
      ...prev,
      mots_cles: prev.mots_cles.filter(mc => mc !== motCle)
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      piecesJointes: [...prev.piecesJointes, ...files]
    }));
  };

  const supprimerFichier = (index: number) => {
    setFormData(prev => ({
      ...prev,
      piecesJointes: prev.piecesJointes.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (stepNumber: number) => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.type) newErrors.type = 'Le type est obligatoire';
      if (!formData.nature) newErrors.nature = 'La nature est obligatoire';
      if (!formData.objet) newErrors.objet = 'L\'objet est obligatoire';
      if (!formData.classification) newErrors.classification = 'La classification est obligatoire';
    }

    if (stepNumber === 2) {
      if (formData.type === 'entrant' && !formData.expediteur?.nom) {
        newErrors.expediteur = 'L\'expéditeur est obligatoire';
      }
      if (formData.type === 'sortant' && !formData.destinataire?.nom) {
        newErrors.destinataire = 'Le destinataire est obligatoire';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const generateNumeroRegistre = () => {
    const prefix = formData.type === 'entrant' ? 'ENT' : 
                   formData.type === 'sortant' ? 'SOR' : 'INT';
    const year = new Date().getFullYear();
    const numero = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${year}-${numero}`;
  };

  const handleSubmit = () => {
    if (validateStep(3)) {
      const numeroRegistre = generateNumeroRegistre();
      
      // Ici on sauvegarderait normalement dans la base de données
      console.log('Nouveau courrier enregistré:', {
        ...formData,
        numeroRegistre,
        dateCreation: new Date(),
        creeParId: currentUser?.id,
        statut: 'enregistre'
      });

      alert(`Courrier enregistré avec succès!\nNuméro de registre: ${numeroRegistre}`);
      
      // Réinitialiser le formulaire
      setFormData({
        type: 'entrant',
        nature: '',
        reference: '',
        objet: '',
        priorite: 'normale',
        delaiTraitement: 15,
        classification: '',
        confidentialite: 'public',
        mots_cles: [],
        piecesJointes: [],
        observations: ''
      });
      setStep(1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Enregistrement d'un nouveau courrier</h2>
          <p className="text-gray-600">Saisie des informations obligatoires selon les règles de gestion</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  num === step 
                    ? 'bg-blue-600 text-white' 
                    : num < step 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Étape 1: Informations générales */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Étape 1: Informations générales</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type">Type de courrier *</Label>
                <Select value={formData.type} onValueChange={(value: any) => updateFormData('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrant">Courrier entrant</SelectItem>
                    <SelectItem value="sortant">Courrier sortant</SelectItem>
                    <SelectItem value="interne">Courrier interne</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nature">Nature du courrier *</Label>
                <Select value={formData.nature} onValueChange={(value) => updateFormData('nature', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner la nature" />
                  </SelectTrigger>
                  <SelectContent>
                    {natures.map((nature) => (
                      <SelectItem key={nature} value={nature}>{nature}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.nature && <p className="text-sm text-red-600">{errors.nature}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference">Référence</Label>
                <Input
                  id="reference"
                  value={formData.reference}
                  onChange={(e) => updateFormData('reference', e.target.value)}
                  placeholder="Référence du courrier"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priorite">Priorité</Label>
                <Select value={formData.priorite} onValueChange={(value: any) => updateFormData('priorite', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normale">Normale</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                    <SelectItem value="tres_urgente">Très urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="objet">Objet du courrier *</Label>
              <Textarea
                id="objet"
                value={formData.objet}
                onChange={(e) => updateFormData('objet', e.target.value)}
                placeholder="Décrivez l'objet du courrier"
                rows={3}
              />
              {errors.objet && <p className="text-sm text-red-600">{errors.objet}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="classification">Classification *</Label>
                <Select value={formData.classification} onValueChange={(value) => updateFormData('classification', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Classification" />
                  </SelectTrigger>
                  <SelectContent>
                    {classifications.map((classif) => (
                      <SelectItem key={classif} value={classif}>{classif}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.classification && <p className="text-sm text-red-600">{errors.classification}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confidentialite">Confidentialité</Label>
                <Select value={formData.confidentialite} onValueChange={(value: any) => updateFormData('confidentialite', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="restreint">Restreint</SelectItem>
                    <SelectItem value="confidentiel">Confidentiel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delai">Délai de traitement (jours)</Label>
                <Input
                  id="delai"
                  type="number"
                  value={formData.delaiTraitement}
                  onChange={(e) => updateFormData('delaiTraitement', parseInt(e.target.value))}
                  min="1"
                  max="365"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Mots-clés</Label>
              <div className="flex space-x-2">
                <Input
                  value={motCleInput}
                  onChange={(e) => setMotCleInput(e.target.value)}
                  placeholder="Ajouter un mot-clé"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), ajouterMotCle())}
                />
                <Button type="button" onClick={ajouterMotCle} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.mots_cles.map((motCle, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{motCle}</span>
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => supprimerMotCle(motCle)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Étape 2: Correspondants */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Étape 2: Informations sur les correspondants</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.type !== 'sortant' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Expéditeur {formData.type === 'entrant' ? '*' : ''}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom/Raison sociale *</Label>
                    <Input
                      value={formData.expediteur?.nom || ''}
                      onChange={(e) => updateCorrespondant('expediteur', 'nom', e.target.value)}
                      placeholder="Nom de l'expéditeur"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <Input
                      value={formData.expediteur?.telephone || ''}
                      onChange={(e) => updateCorrespondant('expediteur', 'telephone', e.target.value)}
                      placeholder="Numéro de téléphone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Adresse</Label>
                    <Textarea
                      value={formData.expediteur?.adresse || ''}
                      onChange={(e) => updateCorrespondant('expediteur', 'adresse', e.target.value)}
                      placeholder="Adresse complète"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.expediteur?.email || ''}
                      onChange={(e) => updateCorrespondant('expediteur', 'email', e.target.value)}
                      placeholder="Adresse email"
                    />
                  </div>
                </div>
                {errors.expediteur && <p className="text-sm text-red-600">{errors.expediteur}</p>}
              </div>
            )}

            {formData.type !== 'entrant' && (
              <div className="space-y-4">
                <Separator />
                <h3 className="text-lg font-medium flex items-center space-x-2">
                  <Send className="h-5 w-5" />
                  <span>Destinataire {formData.type === 'sortant' ? '*' : ''}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom/Raison sociale *</Label>
                    <Input
                      value={formData.destinataire?.nom || ''}
                      onChange={(e) => updateCorrespondant('destinataire', 'nom', e.target.value)}
                      placeholder="Nom du destinataire"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <Input
                      value={formData.destinataire?.telephone || ''}
                      onChange={(e) => updateCorrespondant('destinataire', 'telephone', e.target.value)}
                      placeholder="Numéro de téléphone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Adresse</Label>
                    <Textarea
                      value={formData.destinataire?.adresse || ''}
                      onChange={(e) => updateCorrespondant('destinataire', 'adresse', e.target.value)}
                      placeholder="Adresse complète"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.destinataire?.email || ''}
                      onChange={(e) => updateCorrespondant('destinataire', 'email', e.target.value)}
                      placeholder="Adresse email"
                    />
                  </div>
                </div>
                {errors.destinataire && <p className="text-sm text-red-600">{errors.destinataire}</p>}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Étape 3: Pièces jointes et finalisation */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Étape 3: Pièces jointes et finalisation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Pièces jointes</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500">Cliquez pour télécharger</span>
                    <span className="text-gray-600"> ou glissez-déposez</span>
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  PDF, DOC, DOCX, JPG, PNG jusqu'à 10MB
                </p>
              </div>

              {formData.piecesJointes.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Fichiers sélectionnés:</h4>
                  {formData.piecesJointes.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({Math.round(file.size / 1024)} KB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => supprimerFichier(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">Observations</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => updateFormData('observations', e.target.value)}
                placeholder="Observations particulières sur ce courrier"
                rows={4}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800">Rappel des règles de gestion:</p>
                  <ul className="mt-2 space-y-1 text-blue-700">
                    <li>• Un numéro de registre unique sera généré automatiquement</li>
                    <li>• Le courrier sera numërisé selon la règle RG6.1</li>
                    <li>• Les métadonnées saisies sont obligatoires selon RG2.3</li>
                    <li>• L'archivage sera structuré automatiquement selon RG6.4</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Boutons de navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={step === 1}
        >
          Précédent
        </Button>

        <div className="space-x-2">
          {step < 3 ? (
            <Button onClick={nextStep}>
              Suivant
            </Button>
          ) : (
            <div className="space-x-2">
              <Button variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Enregistrer comme brouillon
              </Button>
              <Button onClick={handleSubmit}>
                <FileText className="h-4 w-4 mr-2" />
                Enregistrer le courrier
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}