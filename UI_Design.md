# UI Design System - Marcien BALOUBOULA NZOUSSI

Ce document trace l'ensemble des choix esthétiques, d'architecture visuelle et de micro-interactions du projet. Il est conçu pour évoluer de manière itérative au fil des développements.

## 1. Direction Artistique Globale : "Architecte Minimal / Dual-Tone"
Basée sur les règles du portfolio cinématographique et l'inspiration de l'agence Akieni. L'objectif est un rendu "1:1 Pixel Perfect", s'éloignant des templates par défaut de bibliothèques UI.

**Caractéristiques principales :**
- **Dual-Tone** : Alternance franche entre des sections très claires (blanc cassé/beige) et des sections sombres profondes (anthracite/charbon) pour rythmer la lecture.
- **Contraste Typographique** : Titres immenses, très resserrés vs. paragraphes aérés.
- **Formes Organiques & Architecturales** : Utilisation d'arches, de masques asymétriques pour les images, et de rayons de courbure prononcés (`rounded-3xl` / `2rem` à `3rem`).
- **Absence de Bordures Dures** : Séparation des éléments par des aplats de couleurs très douces (pastel/perle) ou des ombres diffuses, plutôt que des traits continus.

## 2. Palette de Couleurs (Variables CSS)
- **Background Principal (Clair)** : Blanc cassé très pur (`#F5F5F7`).
- **Background Section Sombre** : Anthracite profond (`#121212` ou `#1A1A1A`).
- **Texte Principal (sur clair)** : Noir ardoise (`#111111`).
- **Texte Principal (sur sombre)** : Pure white (`#FFFFFF`).
- **Accent (Primaire)** : Cyan vibrant (ou la couleur d'accent actuelle du projet) pour attirer le regard sans surcharger.
- **Fonds de Cartes / Badges** : Vert d'eau pastel, gris perle ou teintes transparentes très légères.

## 3. Typographie
- **Titres (Headings)** : `Space Grotesk` - Gras, tracking serré (`tracking-tight`), pour l'impact.
- **Corps de texte (Body)** : `Inter` - Interligne généreux (`leading-relaxed`), pour une parfaite lisibilité.

## 4. Composants Clés
- **Boutons** : Minimalistes, forts contrastes. Effet magnétique au survol (`scale: 1.03`).
- **Cartes (Expériences, Compétences)** : Fond teinté, sans bordure, `rounded-[2rem]`, très léger effet d'élévation au survol.
- **Hero Section** : Asymétrique, titre massif à gauche, image/visuel détouré via un masque géométrique (arche) à droite.
- **Texture Visuelle** : Un subtil overlay de bruit (SVG turbulence à ~5% d'opacité) sur l'ensemble de la page pour un rendu "matière" premium.

## 5. Animations (GSAP)
- **Apparition** : Fade-up séquentiel (stagger) au scroll avec des easing fluides (`power3.out`).
- **Micro-interactions** : Les liens ont un très subtil `translateY(-1px)` au survol. Les éléments interactifs semblent réagir au passage de la souris.
