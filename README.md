# TierrieToH2025


## Démarrage:

```sh
npm run upload:server
npm start
```

### Voici mon projet ToH pour la ressource  R5.Real.05
Les fonctionnalités disponibles sont : 
- Toutes celles des étapes des TP
- L'upload d'images pour les héros (persistées)
- Une arène de combat automatique entre héros



### Upload d'images héros

- Les images uploadées sont stockées dans le dossier `uploads/heroes/<heroId>/` à la racine du projet.
- Un petit serveur HTTP local sert ces fichiers et gère l'upload via `POST /api/heroes/:id/photo`.



Ensuite, utilisez la page de détail d'un héros pour glisser-déposer une image ou en choisir une via le champ fichier.
