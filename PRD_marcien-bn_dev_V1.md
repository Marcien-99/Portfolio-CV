MARCIEN-BN.DEV — Portfolio CV Intelligent
Product Requirements Document (PRD)
Version 1.0 • Juillet 2026
Auteur : Marcien BALOUBOULA NZOUSSI
Document confidentiel — Usage interne

---

## Table des matières

1. Informations générales
2. Définition du besoin
3. Utilisateurs et cas d'usage
4. Objectifs du produit
5. Modèle fonctionnel des données
6. Fonctionnalités du produit
7. Architecture technique (résumé)
8. Contraintes et principes de développement

---

## 1. Informations générales

### 1.1 Présentation du projet

| Élément | Valeur |
|---|---|
| Nom du projet | marcien-bn.dev |
| Type de projet | Portfolio professionnel + CV interactif et générateur multi-profils |
| Nature | Application web (Next.js + Supabase), hébergée sur Vercel |
| Version du document | PRD Version 1.0 |
| Statut | En conception |
| Langues | Français (principale) et Anglais, dès la V1 |
| Public principal | Recruteurs, RH, laboratoires de recherche, entreprises, clients freelance |
| Accès | Navigation libre ; espace d'administration réservé au propriétaire |
| Délai de lancement visé | Moins de 30 jours (première version) |
| Contrainte budgétaire | 0 € — usage exclusif des plans gratuits (Vercel, Supabase, et tout service tiers) |

### 1.2 Résumé exécutif

marcien-bn.dev est un site portfolio personnel propriétaire, remplaçant un CV PDF statique par une vitrine interactive et un générateur de CV piloté par une base de données unique. Le site présente un profil professionnel transversal (sûreté de fonctionnement, électronique/automatisme, informatique), avec une administration permettant de tout modifier sans toucher au code, et une génération de CV à la volée (aucun fichier stocké) en français et en anglais.

### 1.3 Contexte

Marcien évolue sur trois domaines qui se recoupent naturellement dans ses projets réels (fiabilité électronique, sûreté de fonctionnement, développement logiciel) plutôt que d'être trois identités cloisonnées. L'enjeu du site est de refléter cette transversalité de façon cohérente, sans diluer aucun des trois domaines, tout en résolvant un problème concret : maintenir plusieurs versions de CV (France, Canada, Doctorat, Freelance...) à la main devient vite ingérable et source d'incohérences.

### 1.4 Ambition

Construire un portfolio de niveau professionnel qui inspire confiance à des publics variés (recruteurs tech, laboratoires de recherche, entreprises industrielles), tout en gardant une base de code simple à faire évoluer, sans aucun coût récurrent, et avec une administration entièrement autonome.

---

## 2. Définition du besoin

### 2.1 Contexte

Le porteur de projet souhaite disposer d'une vitrine unique et à jour, capable de générer automatiquement plusieurs variantes de CV cohérentes à partir d'une seule base d'informations, sans devoir maintenir plusieurs documents séparés.

### 2.2 Utilisateurs concernés

| Utilisateur | Besoins principaux |
|---|---|
| Visiteur (recruteur, RH, labo, client freelance) | Comprendre rapidement le profil, explorer compétences/projets/expériences, télécharger un CV adapté à son besoin, contacter |
| Administrateur (Marcien) | Ajouter/modifier une compétence, une expérience, un projet ; changer le statut d'un projet (en cours / terminé) ; gérer les variantes de CV ; sans intervention sur le code |

### 2.3 Problèmes identifiés

- Un CV PDF statique ne rend pas justice à un profil transversal (sûreté de fonctionnement, électronique, informatique) et devient vite obsolète.
- Maintenir plusieurs versions de CV manuellement (France, Canada, Doctorat...) multiplie le risque d'incohérence et le temps de mise à jour.
- Un site développé rapidement avec un agent IA mal encadré accumule des choix de structure improvisés, coûteux à corriger ensuite.
- Un profil mal structuré risque de sembler dispersé (trois identités séparées) plutôt que cohérent (un profil transversal).

### 2.4 Besoins fonctionnels

Le site devra permettre de :

- Présenter le profil professionnel de façon attractive et cohérente, sur les trois domaines ;
- Naviguer et filtrer compétences, expériences et projets par domaine (sûreté de fonctionnement, électronique, automatisme, informatique/IA) ;
- Générer et télécharger un CV en PDF, en français ou en anglais, à partir d'une seule base de données, sans fichier stocké ;
- Modifier l'intégralité du contenu (compétences, expériences, projets, formations, textes, photo) depuis une interface d'administration sécurisée, sans toucher au code ;
- Faire évoluer le statut d'un projet (en cours → terminé) en un seul geste ;
- Fonctionner entièrement dans les limites des plans gratuits des technologies utilisées.

### 2.5 Périmètre du projet

**En V1** : profil bilingue (FR/EN), un seul template visuel de CV, génération PDF à la demande, administration complète (CRUD compétences/expériences/projets/formations), filtrage par domaine, formulaire de contact.

**Hors périmètre V1** (anticipé dans l'architecture, non développé) : templates de CV additionnels par contexte (Canada, Doctorat, Freelance, version courte/longue), assistant IA de correspondance offre d'emploi ↔ CV, blog technique, statistiques de téléchargement, mode clair.

---

## 3. Utilisateurs et cas d'usage

### 3.1 Catégories d'utilisateurs

**Visiteur**
- Parcourt le site sans compte ;
- Filtre les contenus par domaine d'expertise ;
- Télécharge un CV en PDF (FR ou EN) ;
- Contacte via un formulaire.

**Administrateur (rôle unique en V1)**
- Seul rôle de gestion ;
- Attend : pouvoir mettre à jour une compétence ou un projet en quelques minutes, faire évoluer le statut d'un projet, sans dépendre d'un développeur.

### 3.2 Cas d'usage principaux

**Cas d'usage 1 — Découverte du profil par un recruteur**
Un visiteur arrive sur l'accueil, comprend en quelques secondes le positionnement transversal (sûreté de fonctionnement, électronique, informatique), explore les projets filtrés par domaine d'intérêt.

**Cas d'usage 2 — Téléchargement d'un CV**
Un visiteur clique sur "Télécharger le CV", choisit la langue (FR/EN), le site génère un PDF à la volée à partir des données du profil sélectionné et le sert immédiatement — aucun fichier n'est stocké côté serveur.

**Cas d'usage 3 — Mise à jour d'un projet par l'administrateur**
L'administrateur se connecte à l'espace privé, fait passer un projet du statut "en cours" à "terminé" ; le changement est immédiatement reflété sur le site public.

**Cas d'usage 4 — Ajout d'une nouvelle compétence**
L'administrateur ajoute une compétence future, la rattache à un ou plusieurs domaines (tags), la publie ; elle apparaît instantanément dans la page Compétences et devient disponible pour les futurs profils de CV.

**Cas d'usage 5 — Contact**
Un visiteur envoie un message via le formulaire de contact ; le message est validé côté serveur et transmis par email, sans stockage d'historique nécessaire en V1.

---

## 4. Objectifs du produit

### 4.1 Objectif général

Fournir une vitrine professionnelle unique, transversale et bilingue, capable de générer des CV cohérents à la demande à partir d'une base d'informations unique, administrable sans compétence technique, à coût nul.

### 4.2 Objectifs fonctionnels

| Réf. | Objectif |
|---|---|
| OF-01 | Présenter le profil (accueil, à propos, compétences, expériences, formations, projets) en FR et EN |
| OF-02 | Permettre le filtrage des compétences/expériences/projets par domaine |
| OF-03 | Générer un CV en PDF à la demande (FR/EN), sans stockage de fichier |
| OF-04 | Offrir une administration permettant de gérer tout le contenu sans toucher au code |
| OF-05 | Permettre le changement de statut d'un projet (en cours / terminé) en un geste |
| OF-06 | Fournir un formulaire de contact validé et protégé contre le spam |
| OF-06bis | Traduire automatiquement en anglais tout contenu saisi en français, y compris lors des modifications ultérieures, avec possibilité de relecture manuelle |
| OF-07 | Préparer l'architecture à l'ajout de futurs templates de CV (Canada, Doctorat, Freelance) sans refonte de la base de données |

### 4.3 Objectifs non fonctionnels

- **Simplicité** : administration utilisable sans compétence technique.
- **Performance** : chargement mobile perçu sous 2 secondes ; génération PDF sous 3 secondes.
- **Compatibilité** : mobile-first, navigateurs modernes.
- **Évolutivité** : ajout de nouveaux profils de CV (V2) sans réécriture du socle.
- **Maintenabilité** : code structuré et documenté, repris facilement par un agent IA sur une session ultérieure.
- **Coût** : fonctionnement garanti à 0 € dans les limites des plans gratuits.
- **Sécurité** : traitée en détail dans le document Spec technique (Phase B).

### 4.4 Critères de réussite

| Critère | Cible mesurable |
|---|---|
| Délai de lancement | Site en production sous 30 jours |
| Contenu au lancement | 100 % des expériences/formations du CV actuel intégrées ; minimum 4 projets détaillés (dont le projet connecteur, avec visuels) |
| Bilingue | Contenu FR complet et EN complet dès le lancement |
| Génération PDF | PDF généré et téléchargeable en moins de 3 secondes perçues, aucun fichier stocké côté serveur |
| Coût | 0 € vérifié — usage dans les limites gratuites de Vercel et Supabase avant mise en production |
| Administration | 100 % du contenu (textes, compétences, expériences, projets, statut, photo) modifiable sans toucher au code |
| Sécurité de base | RLS activée et vérifiée sur 100 % des tables avant mise en production |
| Performance | Chargement mobile perçu sous 2 secondes |

---

## 5. Modèle fonctionnel des données

### 5.1 Objectif

Ce modèle sert de référence commune pour la base de données, l'API et l'interface. Il est volontairement indépendant des choix d'implémentation technique (traités dans le futur document Spec technique).

### 5.2 Compétence (Skill)

Élément représentant une compétence technique ou méthodologique.

| Propriété | Description |
|---|---|
| Identifiant | Identifiant unique |
| Nom (FR / EN) | Nom affiché dans chaque langue |
| Catégorie | Rattachement à une catégorie de compétence |
| Domaine(s) | Tags transversaux (sûreté de fonctionnement, électronique, automatisme, informatique/IA) |
| Niveau | Optionnel — niveau ou barre de progression |
| Statut | Visible / masqué |

### 5.3 Expérience professionnelle

| Propriété | Description |
|---|---|
| Identifiant | Identifiant unique |
| Titre (FR / EN) | Intitulé du poste |
| Entreprise, lieu | — |
| Période | Date de début / fin |
| Description (FR / EN) | Missions et réalisations |
| Domaine(s) | Tags transversaux |
| Statut | Visible / masqué |

### 5.4 Formation

Diplômes, certifications. Structure proche de l'expérience professionnelle (titre, établissement, période, description bilingue).

### 5.5 Projet

| Propriété | Description |
|---|---|
| Identifiant | Identifiant unique |
| Titre, description (FR / EN) | Contexte, démarche, résultat (format étude de cas) |
| Domaine(s) | Tags transversaux |
| Statut | `en_cours` ou `termine` |
| Images | Une ou plusieurs images illustrant le projet |
| Statut de visibilité | Visible / masqué |

### 5.6 Profil de CV (CV Profile)

Représente une variante de CV (ex : "Standard", et en V2 : "Canada", "Doctorat", "Freelance").

| Propriété | Description |
|---|---|
| Identifiant | Identifiant unique |
| Nom | Nom de la variante |
| Template | Référence au template visuel utilisé (un seul en V1) |
| Items associés | Liste des expériences/projets/compétences à inclure (table de liaison) |

### 5.7 Photo de CV

Photo(s) professionnelle(s) disponibles, avec une photo marquée comme active pour la génération PDF.

### 5.8 Message de contact

Message reçu via le formulaire, transmis par email, sans nécessité de conservation en base au-delà de l'envoi.

### 5.9 Paramètres du site

Informations globales : liens sociaux, bio courte, coordonnées, textes de l'accueil.

### 5.10 Relations entre les données

- Une compétence, une expérience et un projet peuvent chacun être rattachés à un ou plusieurs domaines (tags) ;
- Un profil de CV référence un ensemble d'expériences, de projets et de compétences via une table de liaison ;
- Un projet possède un statut qui pilote directement son affichage (en cours / terminé), sans déplacement manuel entre sections.

---

## 6. Fonctionnalités du produit

### 6.1 Module présentation

- Pages Accueil, À propos, Compétences, Expériences, Formations, Projets, Contact.
- Bilingue FR/EN avec sélecteur de langue.

### 6.2 Module filtrage

- Filtres par domaine (sûreté de fonctionnement, électronique, automatisme, informatique/IA) applicables sur compétences, expériences et projets.

### 6.3 Module génération de CV

- Sélection de la langue (FR/EN) ;
- Génération du PDF à la volée à partir des données du profil sélectionné (un seul template en V1) ;
- Aucun fichier stocké côté serveur ;
- Utilisation de la photo marquée comme active.

### 6.4 Module contact

- Formulaire validé côté serveur, protection anti-spam (honeypot) ;
- Envoi par email (service transactionnel gratuit).

### 6.5 Module administration

- Connexion sécurisée (compte unique) ;
- Gestion CRUD : compétences, expériences, formations, projets (incluant changement de statut en cours/terminé), photos, textes, paramètres du site ;
- Gestion des profils de CV et de leurs items associés ;
- Aucune modification du code nécessaire.

### 6.6 Synthèse des modules

| Module | V1 | Évolution prévue |
|---|---|---|
| Présentation bilingue | ✔ | — |
| Filtrage par domaine | ✔ | — |
| Génération CV (1 template) | ✔ | Templates additionnels (Canada, Doctorat, Freelance) |
| Contact | ✔ | — |
| Administration | ✔ | Statistiques de téléchargement |
| Assistant IA de correspondance offre/CV | — | V3 |
| Blog technique | — | V2/V3 |

---

## 7. Architecture technique (résumé)

*(Le détail — schéma de base de données précis, contrat d'API, contraintes de sécurité — fera l'objet du document Spec technique, Phase B de la méthodologie de développement.)*

| Composant | Technologie retenue | Justification |
|---|---|---|
| Frontend + logique serveur | Next.js (App Router) | SSR/ISR pour le SEO, un seul framework, écosystème mature |
| Base de données | Supabase (PostgreSQL) | Relationnel, Row Level Security natif, plan gratuit suffisant à ce volume |
| Authentification | Supabase Auth | Compte admin unique, intégré à la base de données |
| Stockage fichiers | Supabase Storage | Photos uniquement (pas de PDF stocké) |
| Génération PDF | @react-pdf/renderer | Génération légère compatible avec les limites serverless du plan gratuit Vercel (contrairement à une solution type navigateur headless) |
| Hébergement | Vercel | Déploiement continu, plan gratuit suffisant pour ce trafic |
| Emails transactionnels | Service gratuit (ex. Resend, plan gratuit) | Envoi des messages de contact |
| Traduction automatique | DeepL API Free | Traduit le contenu FR → EN à chaque modification ; qualité supérieure sur le vocabulaire technique par rapport aux alternatives gratuites ; 500 000 caractères/mois gratuits, largement suffisant au volume du site |

---

## 8. Contraintes et principes de développement

- **Simplicité** : ne développer en V1 que ce qui sert le cas d'usage réel (un seul template de CV, deux langues) ; tout template additionnel reste hors périmètre tant qu'il n'est pas explicitement ajouté à ce PRD.
- **Coût nul** : chaque choix technique doit être validé contre les limites du plan gratuit correspondant avant intégration.
- **Performance** : expérience fluide sur mobile et connexion moyenne.
- **Compatibilité** : mobile-first, navigateurs modernes.
- **Évolutivité** : le modèle de données (section 5) anticipe l'ajout de nouveaux profils de CV sans migration lourde.
- **Maintenabilité** : code structuré et documenté ; toute décision de développement importante doit être reportée dans ce PRD ou dans le futur document Spec technique, jamais laissée uniquement dans l'historique de conversation avec l'agent IA.
- **Sécurité** : traitée en détail dans le document Spec technique (Phase B), qui fixera la politique RLS table par table, la gestion des secrets, la validation serveur systématique, et le niveau d'accès de chaque route.

---

## Conclusion

Ce PRD définit le périmètre, les objectifs, le modèle de données fonctionnel et les fonctionnalités de la V1 de marcien-bn.dev. Il sert de document de référence pour la suite du projet, notamment la rédaction du document Spec technique (Phase B), qui détaillera le schéma de base de données précis, le contrat d'API et les contraintes de sécurité, avant le démarrage des tâches de développement (Phase C).

Toute évolution du besoin devra passer par une mise à jour explicite de ce document, et non par un ajustement oral en cours de développement.
