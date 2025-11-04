import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Mail, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  FileText,
  Users,
  Archive,
  Send,
  ArrowRight,
  Calendar,
  Bell
} from 'lucide-react';
import { useCurrentUser } from '../App';

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  change?: number;
}

interface CourierEnAttente {
  id: string;
  numeroRegistre: string;
  objet: string;
  expediteur: string;
  priorite: 'normale' | 'urgente' | 'tres_urgente';
  dateReception: Date;
  delaiRestant: number;
  action: string;
}

interface Notification {
  id: string;
  type: 'alerte' | 'rappel' | 'validation' | 'nouveau';
  message: string;
  courrierId?: string;
  dateCreation: Date;
  lu: boolean;
}

export function Dashboard() {
  const { currentUser } = useCurrentUser();

  // Données simulées basées sur le rôle de l'utilisateur
  const stats: StatCard[] = [
    {
      title: 'Courriers en attente',
      value: 8,
      icon: <Mail className="h-6 w-6" />,
      color: 'bg-blue-500',
      change: +2
    },
    {
      title: 'En retard',
      value: 3,
      icon: <AlertTriangle className="h-6 w-6" />,
      color: 'bg-red-500',
      change: -1
    },
    {
      title: 'Traités aujourd\'hui',
      value: 12,
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'bg-green-500',
      change: +4
    },
    {
      title: 'Total du mois',
      value: 156,
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-purple-500',
      change: +15
    }
  ];

  const courriersEnAttente: CourierEnAttente[] = [
    {
      id: '1',
      numeroRegistre: 'ENT-2024-001',
      objet: 'Demande d\'autorisation d\'exploitation',
      expediteur: 'Société ABC',
      priorite: 'urgente',
      dateReception: new Date('2024-01-15'),
      delaiRestant: 2,
      action: 'À valider'
    },
    {
      id: '2',
      numeroRegistre: 'ENT-2024-002',
      objet: 'Réclamation service client',
      expediteur: 'M. DIABATE Sekou',
      priorite: 'normale',
      dateReception: new Date('2024-01-14'),
      delaiRestant: 5,
      action: 'À traiter'
    },
    {
      id: '3',
      numeroRegistre: 'INT-2024-005',
      objet: 'Rapport mensuel des activités',
      expediteur: 'Service Comptabilité',
      priorite: 'normale',
      dateReception: new Date('2024-01-13'),
      delaiRestant: -1,
      action: 'En retard'
    }
  ];

  const notifications: Notification[] = [
    {
      id: '1',
      type: 'alerte',
      message: 'Le courrier ENT-2024-001 expire dans 2 jours',
      courrierId: '1',
      dateCreation: new Date(),
      lu: false
    },
    {
      id: '2',
      type: 'nouveau',
      message: 'Nouveau courrier reçu: ENT-2024-015',
      courrierId: '15',
      dateCreation: new Date(),
      lu: false
    },
    {
      id: '3',
      type: 'validation',
      message: 'Votre réponse au courrier SOR-2024-008 a été validée',
      courrierId: '8',
      dateCreation: new Date(),
      lu: true
    }
  ];

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alerte': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'nouveau': return <Mail className="h-4 w-4 text-blue-500" />;
      case 'validation': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête du dashboard */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Tableau de bord</h2>
          <p className="text-gray-600">
            Bonjour {currentUser?.prenom}, voici un aperçu de vos courriers
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  {stat.change && (
                    <p className={`text-sm ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change > 0 ? '+' : ''}{stat.change} depuis hier
                    </p>
                  )}
                </div>
                <div className={`${stat.color} p-3 rounded-full text-white`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Courriers en attente */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Courriers en attente de traitement</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courriersEnAttente.map((courrier) => (
                <div key={courrier.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{courrier.numeroRegistre}</Badge>
                      <Badge className={`${getPrioriteColor(courrier.priorite)} text-white`}>
                        {getPrioriteText(courrier.priorite)}
                      </Badge>
                    </div>
                    <h4 className="font-medium mt-2">{courrier.objet}</h4>
                    <p className="text-sm text-gray-600">De: {courrier.expediteur}</p>
                    <p className="text-sm text-gray-600">
                      Reçu le {courrier.dateReception.toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={courrier.delaiRestant < 0 ? "destructive" : courrier.delaiRestant <= 2 ? "default" : "secondary"}>
                      {courrier.delaiRestant < 0 ? `${Math.abs(courrier.delaiRestant)} j. de retard` : `${courrier.delaiRestant} j. restants`}
                    </Badge>
                    <Button size="sm" variant="outline">
                      {courrier.action}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full">
                Voir tous les courriers
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications et alertes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className={`p-3 rounded-lg border ${notification.lu ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="flex items-start space-x-2">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.dateCreation.toLocaleTimeString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" size="sm" className="w-full">
                Voir toutes les notifications
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques et indicateurs de performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance du mois</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Traitement dans les délais</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Taux de réponse</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Satisfaction client</span>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Courriers entrants</span>
                </div>
                <span className="text-sm font-medium">67%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Courriers sortants</span>
                </div>
                <span className="text-sm font-medium">28%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Courriers internes</span>
                </div>
                <span className="text-sm font-medium">5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
              <Send className="h-6 w-6" />
              <span className="text-sm">Nouveau courrier</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
              <Archive className="h-6 w-6" />
              <span className="text-sm">Archiver</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Imputer</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
              <FileText className="h-6 w-6" />
              <span className="text-sm">Générer rapport</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}