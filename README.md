<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

# Sistema di Gestione per Ufficio Brevetti

## Panoramica del Progetto

Il progetto "UfficioBrevetti" è un'applicazione completa per la gestione di brevetti, marchi e design industriali. È composto da un backend sviluppato con Nest.js e MongoDB e un frontend basato su Svelte e TypeScript. L'architettura è pensata per offrire un sistema completo, scalabile e containerizzato che permetta di gestire in modo efficiente tutte le attività tipiche di un ufficio brevetti.

## Componenti Principali del Backend

### Infrastruttura e Configurazione

- **Docker e Docker Compose**: L'intero sistema è containerizzato per garantire la portabilità e la consistenza tra ambienti di sviluppo, test e produzione.
- **MongoDB**: Database NoSQL utilizzato per la persistenza dei dati, accessibile tramite Mongoose per una gestione ORM avanzata.
- **Mongo Express**: Interfaccia di amministrazione per MongoDB, utile in fase di sviluppo.
- **Configurazione Ambiente**: Gestione separata delle configurazioni per diversi ambienti (development, test, production) tramite variabili d'ambiente.
- **CI/CD Pipeline**: Integrazione con GitLab CI/CD per automatizzare i processi di linting, testing, building e deployment.

### Moduli Principali

1. **Modulo Brevetti**:
   - CRUD completo per la gestione dei brevetti
   - Ricerca avanzata con filtri multipli (stato, titolare, date, ecc.)
   - Sistema di monitoraggio delle scadenze
   - Timeline per tracciare la storia di ogni brevetto
   - Sistema di note per annotazioni e commenti

2. **Modulo Utenti e Autenticazione**:
   - Gestione utenti con ruoli differenziati (ADMIN, UTENTE_STANDARD)
   - Autenticazione JWT con refresh token
   - Protezione degli endpoint tramite Guards
   - Hash delle password con bcrypt

3. **Modulo Titolari**:
   - Gestione dei titolari dei brevetti (persone fisiche, aziende, enti pubblici)
   - Relazioni con i brevetti
   - Ricerca e filtraggio

4. **Modulo Notifiche**:
   - Sistema di notifiche per scadenze imminenti
   - Notifiche per cambi di stato dei brevetti
   - Tracciamento delle notifiche lette/non lette per utente

### Caratteristiche Tecniche

- **REST API**: Interfaccia RESTful completa per tutte le operazioni
- **TypeScript**: Utilizzo di TypeScript per una tipizzazione forte e un codice più robusto
- **Data Transfer Objects (DTO)**: Validazione input tramite DTO e class-validator
- **Schema Mongoose**: Definizione precisa dei modelli dati con validatori, indici e hooks
- **Guards per Autorizzazione**: Sistema di controllo accessi basato su ruoli
- **Paginazione**: Implementazione standardizzata della paginazione per tutte le liste

## Struttura del Backend

L'applicazione backend segue l'architettura modulare di Nest.js con una chiara separazione tra:
- **Controllers**: Gestiscono le richieste HTTP e delegano la logica di business ai servizi
- **Services**: Implementano la logica di business e interagiscono con i modelli dati
- **Schemas/Models**: Definiscono la struttura dei dati e l'interazione con MongoDB
- **DTOs**: Validano i dati in entrata
- **Guards**: Proteggono gli endpoint in base all'autenticazione e ai ruoli
- **Decorators**: Facilitano l'implementazione di funzionalità cross-cutting

## Funzionalità Implementate

1. **Gestione Completa dei Brevetti**:
   - Registrazione di nuovi brevetti con tutte le informazioni pertinenti
   - Monitoraggio dello stato di ogni brevetto (DEPOSITO, ESAME, CONCESSIONE, ecc.)
   - Tracciamento delle date chiave (deposito, concessione, scadenza)
   - Sistema di note e timeline per ogni brevetto

2. **Dashboard Analitica**:
   - Statistiche sui brevetti per stato
   - Distribuzione temporale dei brevetti
   - Analisi per titolare
   - Monitoraggio delle scadenze imminenti

3. **Sistema di Ricerca Avanzato**:
   - Ricerca full-text su titolo, numero e descrizione
   - Filtri per stato, titolare, date di deposito
   - Ordinamento personalizzabile
   - Paginazione dei risultati

4. **Gestione Utenti e Sicurezza**:
   - Autenticazione sicura con JWT
   - Refresh token per sessioni prolungate
   - Controllo accessi granulare basato su ruoli
   - Protezione degli endpoint sensibili

5. **Notifiche e Promemoria**:
   - Sistema automatico di notifiche per scadenze
   - Tracciamento delle notifiche lette/non lette
   - Possibilità di invio email per notifiche urgenti

## Best Practices Implementate

1. **Sicurezza**:
   - Hash delle password con bcrypt
   - Autenticazione JWT con scadenza token
   - Validazione input con class-validator
   - Controllo accessi basato su ruoli

2. **Performance**:
   - Indici MongoDB ottimizzati per query frequenti
   - Paginazione per gestire grandi dataset
   - Proiezioni per ridurre la quantità di dati trasferiti

3. **Manutenibilità**:
   - Codice fortemente tipizzato con TypeScript
   - Architettura modulare per separazione delle responsabilità
   - DTOs per validazione input
   - Interfacce condivise per tipi comuni (es. PaginatedResponse)

4. **Deployment e DevOps**:
   - Containerizzazione con Docker
   - CI/CD con GitLab
   - Configurazione per ambienti multipli

## Miglioramenti Recenti

- Risoluzione di problemi di tipizzazione nelle risposte paginate
- Creazione di interfacce condivise per standardizzare il formato delle risposte API
- Ottimizzazione delle query MongoDB con l'uso di FilterQuery tipizzato
- Configurazione multi-repository per sincronizzazione tra GitLab e GitHub

## Prossimi Sviluppi

1. **Integrazione Frontend**:
   - Implementazione dell'interfaccia utente con Svelte e TypeScript
   - Componenti UI riutilizzabili per brevetti, dashboard, ecc.

2. **Funzionalità Aggiuntive**:
   - Sistema di reportistica avanzata
   - Esportazione dati in vari formati
   - Integrazione con servizi esterni per verifica brevetti

3. **Ottimizzazioni**:
   - Implementazione di caching per migliorare le performance
   - Miglioramento del sistema di notifiche

## Conclusioni

Il progetto UfficioBrevetti rappresenta una soluzione completa e robusta per la gestione delle attività di un ufficio brevetti. L'architettura modulare, la forte tipizzazione e l'uso di best practices moderne garantiscono un'applicazione manutenibile, scalabile e sicura. La configurazione Docker e CI/CD facilita il deployment e la gestione degli ambienti, mentre l'API RESTful offre un'interfaccia chiara per l'integrazione con il frontend o con altri servizi.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
