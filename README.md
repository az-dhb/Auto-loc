# Auto-Loc 🚗 — Plateforme de Location de Voitures

## Équipe
- Dehbi Azouaou
- TRAORE ASAEL BENAJA DE LA GRACE
- BENMOUMENE SAIDAGHILES
- BENMOUMENE SAIDAGHILES


## Lien de Production
🔗 [auto-loc.vercel.app]([https://auto-loc.vercel.app](https://auto-9dpwfkfmq-az-dhbs-projects.vercel.app/auth))

## Identifiants de Test
- **Email :** a_dehbi@estin.dz
- **Mot de passe :** 00000000

---

## Mapping du Thème — Location Auto ("Auto-Loc")

| Élément | Correspondance dans l'application |
|--------|-----------------------------------|
| **Table A — Clients** | Gérée via **Supabase Auth**. Ce sont les utilisateurs qui s'inscrivent sur la plateforme pour louer des voitures. Chaque client possède un profil avec son nom complet, une photo de profil, et son permis de conduire. |
| **Table B — Voitures** | Les véhicules disponibles à la location. Chaque voiture contient : marque, modèle, année, prix par jour, transmission, carburant, nombre de sièges, localisation, et une image. |
| **Table C — Réservations** | La table de jointure qui relie un client (Table A) à une voiture (Table B). Elle contient les dates de début et de fin, ainsi qu'un statut (pending / confirmed / cancelled). |
| **Fichier (Storage)** | La **photo du permis de conduire** uploadée par le client depuis sa page profil. Stockée dans Supabase Storage dans le bucket `driver-licenses`, et référencée par URL dans la table `clients`. Les images des voitures sont également stockées dans le bucket `cars-images`. |

---

## Analyse d'Architecture

### 1. Pourquoi Vercel + Supabase est plus logique financièrement qu'un serveur classique ? (CAPEX vs OPEX)

Déployer une application sur une infrastructure classique implique des dépenses en **CAPEX** (Capital Expenditure) : achat de serveurs physiques, de matériel réseau, de licences logicielles, et installation dans un data center. Ces coûts sont engagés avant même qu'un seul utilisateur utilise l'application, ce qui représente un risque financier important pour un projet à ses débuts.

Avec **Vercel** et **Supabase**, on bascule vers un modèle **OPEX** (Operational Expenditure) : on ne paie que ce qu'on consomme, à la demande. Les deux plateformes proposent des offres gratuites suffisantes pour lancer Auto-Loc sans aucun investissement initial. Si l'application ne génère pas de trafic, le coût reste nul. Si elle grandit, les coûts évoluent proportionnellement aux revenus. C'est le modèle économique le plus adapté pour un projet en phase de lancement.

### 2. Comment Vercel gère-t-il la scalabilité par rapport à un Data Center physique ?

Un data center physique local nécessite une infrastructure lourde : serveurs rack, systèmes de climatisation, onduleurs, équipes de maintenance, et une configuration manuelle pour chaque montée en charge. Si le trafic double soudainement, il faut commander, installer et configurer de nouveaux serveurs — un processus qui peut prendre plusieurs semaines.

**Vercel** repose sur une architecture **serverless** distribuée sur un réseau mondial de points de présence (edge network). Chaque requête est traitée par une fonction déployée automatiquement au plus proche de l'utilisateur. En cas de pic de trafic — par exemple si de nombreux clients consultent les voitures disponibles en même temps — Vercel instancie automatiquement de nouvelles fonctions en quelques millisecondes, sans aucune intervention manuelle. Il n'y a pas de serveur à allumer, pas de climatisation à gérer, pas de capacité à prévoir à l'avance.

### 3. Données Structurées vs Données Non-Structurées dans Auto-Loc

**Données structurées** — stockées dans **Supabase PostgreSQL** :
- Table `clients` : id, full_name, avatar_url, license_url, license_validated, created_at
- Table `cars` : id, brand, model, year, price_per_day, transmission, fuel_type, seats, location, status, owner_id
- Table `reservations` : id, client_id (FK), car_id (FK), start_date, end_date, status, created_at

Ces données respectent un schéma fixe, sont fortement typées, et peuvent être interrogées via SQL avec des jointures, des filtres, et des règles RLS (Row Level Security).

**Données non-structurées** — stockées dans **Supabase Storage** :
- Les **photos des voitures** uploadées par les propriétaires lors de la mise en ligne d'un véhicule (bucket `cars-images`)
- Les **photos du permis de conduire** uploadées par les clients depuis leur profil (bucket `driver-licenses`)
- La **photo de profil** de chaque client (bucket `pfp`)

Ces fichiers sont des objets binaires sans schéma défini. Ils ne peuvent pas être interrogés comme une base de données — ils sont simplement stockés et référencés par leur URL publique dans les tables PostgreSQL.
