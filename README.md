# Site de mariage — Cécile & Pierre

## Mettre les fichiers sur GitHub
Dans le dépôt `mariage-cecile-pierre`, cliquez **Add file → Upload files**. Déposez **le contenu de ce dossier**, en conservant `public/`, `netlify/` et `netlify.toml` à la racine. Ne déposez **pas le ZIP fermé** comme un seul fichier.

## Déployer sur Netlify
**Add new project → Import an existing project → GitHub** et sélectionnez le dépôt. Netlify détectera `netlify.toml` (dossier public et fonctions).

## Relier Google Sheets
Dans Netlify : **Project configuration → Environment variables**, ajoutez :
- **Key :** `APPS_SCRIPT_URL`
- **Value :** URL du déploiement Apps Script qui finit par `/exec`.

⚠️ Votre déploiement Apps Script est actuellement **« Moi uniquement »** : les réponses envoyées depuis Netlify ne fonctionneront pas tant que vous n'aurez pas créé un déploiement accessible aux visiteurs. Pour cela, le script doit d'abord être renforcé (limitation des abus, contrôle des entrées, protection contre les formules et dédoublonnage). Ne mettez pas en service le formulaire public avant ce travail.

## À savoir
- Aucun visuel de faire-part n'est inclus.
- Les codes `SARDINE1`, etc., sont conservés.
- Les données d'invitation sont actuellement dans `netlify/functions/invitation.js` : **elles ne se synchronisent pas automatiquement** avec les modifications du Google Sheets. Ne partagez pas publiquement ce dépôt ; les codes faciles ne sont pas une authentification forte.
- Les confirmations ne sont pas enregistrées tant que `APPS_SCRIPT_URL` n'est pas configurée et que l'accès au script n'est pas adapté.
- Testez tout avant de diffuser le QR code.
