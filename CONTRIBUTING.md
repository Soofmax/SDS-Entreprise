# 🤝 Guide de Contribution - SDS Enterprise

Merci de votre intérêt pour contribuer à **SDS - Salwa Dev Studio** ! Ce guide vous aidera à contribuer efficacement au projet.

## 📋 Table des Matières

- [Code de Conduite](#code-de-conduite)
- [Comment Contribuer](#comment-contribuer)
- [Standards de Développement](#standards-de-développement)
- [Process de Review](#process-de-review)
- [Signaler des Bugs](#signaler-des-bugs)
- [Proposer des Fonctionnalités](#proposer-des-fonctionnalités)

## 📜 Code de Conduite

Ce projet adhère au [Code de Conduite](CODE_OF_CONDUCT.md). En participant, vous acceptez de respecter ces termes.

## 🚀 Comment Contribuer

### 1. Fork & Clone

```bash
# Fork le repository sur GitHub
# Puis clone votre fork
git clone https://github.com/VOTRE-USERNAME/sds-enterprise.git
cd sds-enterprise
```

### 2. Setup Environnement

```bash
# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env.local

# Setup base de données
npx prisma migrate dev
```

### 3. Créer une Branche

```bash
# Créer une branche pour votre feature/fix
git checkout -b feature/nom-de-votre-feature
# ou
git checkout -b fix/nom-du-bug
```

### 4. Développer

- Suivez les [Standards de Développement](#standards-de-développement)
- Écrivez des tests pour votre code
- Assurez-vous que tous les tests passent
- Respectez les conventions de nommage

### 5. Commit & Push

```bash
# Commit avec un message descriptif
git add .
git commit -m "feat: ajouter fonctionnalité X"

# Push vers votre fork
git push origin feature/nom-de-votre-feature
```

### 6. Pull Request

- Ouvrez une Pull Request vers la branche `main`
- Décrivez clairement vos changements
- Référencez les issues liées
- Attendez la review avant merge

## 🛠️ Standards de Développement

### Code Style

- **TypeScript** strict activé
- **ESLint** et **Prettier** configurés
- **Conventions de nommage** :
  - Variables/fonctions : `camelCase`
  - Composants : `PascalCase`
  - Fichiers : `kebab-case` ou `PascalCase`
  - Constants : `UPPER_SNAKE_CASE`

### Structure des Commits

Utilisez [Conventional Commits](https://www.conventionalcommits.org/) :

```
type(scope): description

feat: ajouter nouvelle fonctionnalité
fix: corriger bug critique
docs: mettre à jour documentation
style: formater code (pas de changement logique)
refactor: refactoriser code existant
test: ajouter ou modifier tests
chore: tâches de maintenance
```

### Tests

- **Tests unitaires** : Jest/Vitest
- **Tests composants** : React Testing Library
- **Tests E2E** : Playwright
- **Couverture minimum** : 80%

```bash
# Lancer les tests
npm run test

# Tests en mode watch
npm run test:watch

# Couverture
npm run test:coverage
```

### Documentation

- Documenter les fonctions complexes
- Mettre à jour le README si nécessaire
- Ajouter des commentaires JSDoc pour les APIs

```typescript
/**
 * Calcule l'aide France Num pour un package donné
 * @param packagePrice - Prix du package en centimes
 * @returns Montant de l'aide en centimes
 */
export function calculateFranceNumAid(packagePrice: number): number {
  // Implementation...
}
```

## 🔍 Process de Review

### Critères de Review

1. **Fonctionnalité** : Le code fait-il ce qu'il est censé faire ?
2. **Tests** : Y a-t-il des tests appropriés ?
3. **Performance** : Le code est-il optimisé ?
4. **Sécurité** : Y a-t-il des vulnérabilités ?
5. **Maintenabilité** : Le code est-il lisible et maintenable ?

### Checklist PR

- [ ] Code testé localement
- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Documentation mise à jour
- [ ] Pas de console.log oubliés
- [ ] Types TypeScript corrects
- [ ] Performance vérifiée
- [ ] Sécurité vérifiée

## 🐛 Signaler des Bugs

### Template Bug Report

```markdown
**Description du Bug**
Description claire et concise du bug.

**Reproduction**
Étapes pour reproduire le comportement :
1. Aller à '...'
2. Cliquer sur '....'
3. Scroller jusqu'à '....'
4. Voir l'erreur

**Comportement Attendu**
Description de ce qui devrait se passer.

**Screenshots**
Si applicable, ajouter des screenshots.

**Environnement**
- OS: [e.g. macOS, Windows, Linux]
- Navigateur: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 22]
- Node.js: [e.g. 18.17.0]

**Contexte Additionnel**
Tout autre contexte utile.
```

## 💡 Proposer des Fonctionnalités

### Template Feature Request

```markdown
**Problème à Résoudre**
Description claire du problème que cette fonctionnalité résoudrait.

**Solution Proposée**
Description claire de ce que vous voulez qui se passe.

**Alternatives Considérées**
Description des solutions alternatives que vous avez considérées.

**Contexte Additionnel**
Tout autre contexte ou screenshots utiles.
```

## 🏷️ Types de Contributions

### 🐛 Bug Fixes
- Corrections de bugs critiques
- Améliorations de performance
- Corrections de sécurité

### ✨ Nouvelles Fonctionnalités
- Nouvelles pages ou composants
- Intégrations tierces
- Améliorations UX/UI

### 📚 Documentation
- Amélioration README
- Guides d'utilisation
- Commentaires code

### 🧪 Tests
- Tests unitaires
- Tests d'intégration
- Tests E2E

### 🎨 Design
- Améliorations UI
- Nouvelles animations
- Optimisations responsive

## 🚦 Workflow Git

### Branches

- `main` : Branche principale (production)
- `develop` : Branche de développement
- `feature/*` : Nouvelles fonctionnalités
- `fix/*` : Corrections de bugs
- `hotfix/*` : Corrections urgentes

### Merge Strategy

- **Feature branches** → `develop` via Pull Request
- **Develop** → `main` via Pull Request (release)
- **Hotfixes** → `main` directement puis merge vers `develop`

## 🏆 Reconnaissance

Les contributeurs sont reconnus dans :
- Section "Contributors" du README
- Page "About" du site web
- Mentions sur LinkedIn/réseaux sociaux

## 📞 Support

Besoin d'aide ? Contactez-nous :

- **Email** : [dev@salwadevstudio.com](mailto:dev@salwadevstudio.com)
- **Discord** : [SDS Community](https://discord.gg/sds-community)
- **Issues GitHub** : Pour questions techniques

## 📝 Ressources Utiles

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

**Merci de contribuer à SDS ! Ensemble, nous créons l'avenir du web pour les TPE/PME ! 🚀**

