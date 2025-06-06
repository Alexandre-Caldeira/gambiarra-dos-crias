
Baixar: 
[https://nodejs.org/en/download/](https://nodejs.org/en/download/)

Abrir terminal e colar:

```
npm install firebase
``` 

```
npm install -g firebase-tools
```

```
firebase login
```


```
firebase init
```


```
{
  "hosting": {
    "site": "gambiarra-dos-cria",

    "public": "public",
    ...
  }
}
```


```
firebase deploy --only hosting:gambiarra-dos-cria
```


```
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNrtiyg5QupuJbaU2Lm9Bem77eNzgyKuI",
  authDomain: "gambiarra-dos-crias.firebaseapp.com",
  projectId: "gambiarra-dos-crias",
  storageBucket: "gambiarra-dos-crias.firebasestorage.app",
  messagingSenderId: "43350088552",
  appId: "1:43350088552:web:b9f36056c4d4aa330a54dd",
  measurementId: "G-PYDRH5GK43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
``` 
