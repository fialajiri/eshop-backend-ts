# [Ecommerce Project](https://eshop-frontend-ts.vercel.app/produkty)

## UNDER DEVELOPMENT!!!

## Obecné informace
Tento projekt tvoří backend k eshopu. Tato webová stránka bude sloužit pro prezentaci a prodej výrobků prodejce. Mezi hlavní vlastnost patří:

  - Autorizaci a authentikaci uživatelů pomocí jwt tokenů a HttpOnly Cookies
  - Registraci uživatelů
  - Vkládání, editaci a mazání výrobků a aktualit
  - Vytváření fotogalerií a nahrávání obrázků
  
## Technologie
  - Backend je napsaný v typescriptu pomocí frameworku Express a bězí na Node.js
    - express: 4.17.2
  
  - Authorizace a authentikace uživatelů pomocí json web tokenů  
    - jsonwebtoken: 8.5.1    
    
  - Všechna data se ukládají do databáze MongoDB  
    - mongoose: 6.1.5
    
  - Fotografie se ukládají do AWS S3 Bucketu nepřímo, tj. nejsou přes server. Na AWS se nahrávají přímo z frontendu
    - aws-sdk: 2.1035.0
    
  - Projekt je testovám pomocí frameworku Jest
    - jest: 27.4.7    
    - supertest": 6.1.6
    - mongodb-memory-server: 8.1.0
        
  - Frontend je napsaný v typescriptu s použitím knihovny React a frameworku Next.js
    - kód je k prohlédnutí [zde](https://github.com/fialajiri/eshop-frontend-ts)
