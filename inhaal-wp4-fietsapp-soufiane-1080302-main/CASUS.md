# Werkplaats 4: Fiets indicator

# Inleiding
Dit document beschrijft de casus die dient als inhaalopdracht voor Werkplaats 4. Deze opdracht is kleiner dan de oorspronkelijke opdracht, maar bevat wel alle leerdoelen. Hou er rekening mee dat je deze opdracht individueel moet maken.

# Uitgangspunten
In werkplaats 4 heb je leren werken met het React Javascript framework. In deze opdracht
ga je deze kennis combineren met een aantal zaken die je eerder dit jaar hebt gebruikt om een app en een website op te
leveren. Op deze site kan een bezoeker zien of hij of zij de komende dagen goed of slecht fietsweer heeft.

Omdat je deze opdracht alleen, niet in een team moet afronden en de tijd beperkt is raden
we sterk aan om je strak aan de requirements te houden en niet meer te doen dan nodig.
Als er bijvoorbeeld niet expliciet om een login wordt gevraagd hoef je die niet te maken.
Begin pas aan dergelijke extra functies als je de belangrijkste zaken uit de requirements
hebt staan.

Technieken en thema’s in deze opdracht: 
- HTML & CSS
- Python 
- Javascript en een frontend framework in de vorm van ReactJS 
- Mobile development met React Native
- REST server / client

# Opdracht
Het liefst zouden we elke dag met de fiets naar het hogeschoolgebouw willen komen, maar helaas zit het weer ons vaak tegen. En wat lastig is is dat er weliswaar weersvoorspellingen zijn, maar dat die een aantal factoren bevatten die we allemaal moeten doorspitten om tot een goede voorspelling te komen - we willen niet fietsen als het hard waait, of te koud is, of regent. Konden we we al die factoren nu maar samenvatten in één beoordeling: fietsen, of niet?

In deze opdracht ga je een gecombineerde applicatie maken die middels een webpagina of een mobiele applicatie met één icoon duidelijk maakt of het de komende dagen goed fietsweer is. Deze informatie haalt de pagina op uit een REST API gebaseerd backend.

De oplevering bestaat uit drie componenten:
- Een mobiele app op basis van React Native die het weer de komende dagen toont
- Een frontend op basis van ReactJS die het weer de komende dagen toont
- Een RESTful backend dat instellingen en bezoekersinformatie op slaat en het weer voor de komende dagen beoordeelt

### Frontend & mobiele app
De mobiele app en het web frontend mogen dezelfde code / code stijl gebruiken. In de verdere uitleg noemen we het "frontend", maar we bedoelen daarmee zowel de web applicatie als de mobiele app. 

We maken als frontend een pagina die informatie vanaf het backend haalt en aangeeft met een icoon (een fiets, of een rood kruis, of iets naar keuze) of het vandaag en de komende 2 dagen wel of geen goed fietsweer is. Daar zijn wat variabelen bij betrokken die we moeten configureren in een scherm met instellingen. 

#### Instellingen scherm 
De *eerste* keer dat iemand vanaf zijn browser of mobiel het weer opvraagt moet men twee zaken instellen:
- Een locatie, bijvoorbeeld de naam van een stad.
- De “knock-out” factoren:

| Metriek                        | Initiële waarde |
|--------------------------------| --- |
| Tijdstip van de weerpeiling    | 08:00 |
| Maximale windsnelheid (in m/s) | 3.0 |
| Maximale regenkans             | 25% |
| Minimale temperatuur           | 5 |
| Maximale temperatuur           | 30 |
| Maximale kans op sneeuw        | 10% |

Het "tijdstip van de weerpeiling" slaat op het tijdstip waarop de gebruiker wil gaan fietsen elke dag. Nadat de gebruiker de stad en eventueel de andere instellingen wijzigt worden deze verstuurd aan het backend. Deze slaat de instellingen op. *Bij alle volgende bezoeken wordt dit scherm overgeslagen en wordt meteen het fietsweer getoond*. Er moet dan wel een mogelijkheid zijn voor de gebruiker om de instellingen te wijzigen.

Een voorbeeld van hoe dit scherm met instellingen eruit zou kunnen zien:

![fietsweer_instellen.png](docs%2Fimages%2Ffietsweer_instellen.png)

Hoe je de in het backend bewaarde instellingen koppelt aan het frontend is aan jou. Onze suggestie zou zijn om na opslaan van de instellingen in het backend een ID terug te sturen. Deze ID zou je dan opslaan in het frontend in een cookie of local storage en stuur je bij elk volgend bezoek mee naar het backend. Het backend kan dan direct de juiste instellingen ophalen en het fietsweer tonen. Je mag hier ook voor een andere aanpak kiezen. 

Dit is geen vertrouwelijke informatie en we willen vooral gemakkelijk en snel het fietsweer tonen, voor deze applicatie is dan ook geen gebruikersnaam / wachtwoord loginscherm nodig.  

#### Fietsweer tonen
Waar het allemaal om draait is het fietsweer. Bij openen van het frontend vraagt deze aan het backend op of we kunnen fietsen naar locatie de komende drie dagen. Het backend haalt de weersvoorspellingen op en bepaalt aan de hand van de opgeslagen knock-out instellingen of het fietsweer wordt. Het frontend toont daarna het resultaat voor de komende drie dagen met simpele iconen. Een voorstel voor hoe dit scherm eruit zou kunnen zien:

![fietsweer.png](docs%2Fimages%2Ffietsweer.png)

### RESTful backend
Het backend handelt een aantal zaken af:
- Hier worden de instellingen per client opgeslagen. 
- Het backend communiceert met een externe weersvoorspelling API. Dat mag niet in het frontend gebeuren.
- Het backend bepaalt of het fietsweer is aan de hand van de instellingen en de weersvoorspellingen en stuurt alleen maar de "ja" of "nee" per dag terug naar het frontend. Dat mag niet in het frontend gebeuren.

Het backend zal dus een aantal REST gebaseerde URLs moeten aanbieden. Daarvoor stellen we een API voor met de volgende drie methodes:

| URL | Methode | Body |  Resultaat |
| --- | --- | --- | --- |
| /api/weather/<id> | GET |  | Geef aan de hand van de instellingen van "id" voor de komende drie dagen aan of het wel of geen fietsweer is. |
| /api/weather/ | POST | lijst met knockout instellingen | Slaat de instellingen op en geeft een nieuw "id" terug in de response. |
| /api/weather/<id> | PUT | lijst met knockout instellingen | Overschrijft de huidige instellingen van "id" |

De details van deze 3 routes:  

#### GET /api/weather/####

Op het moment dat het weer via de GET methode wordt opgevraagd gebeurt het volgende:
- Op basis van de locatie in de opgeslagen instellingen wordt door het backend een (HTTP REST) callout gedaan naar een externe partij die weersvoorspellingen aanbiedt. We raden openweathermap (https://openweathermap.org/forecast5) aan - hier kun je met een gratis account en een stadsnaam het weer voor de komende dagen ophalen.
- De gebruiker wil altijd het weer voor de nog komende dagen zien. Bijvoorbeeld, als de gebruiker ergens van zondagnacht 00:01 (technisch gezien dus maandag) tot maandag 23:59 de app raadpleegt, je toont dan altijd het weer voor dinsdag, woensdag en donderdag. 
- Het "tijd voor weerpeiling" criterium bepaald welk tijdstip we gebruiken voor de voorspellingen op die drie dagen. Als de weervoorspelling van de externe partij niet op dat tijdstip is, dan wordt de voorspelling van het dichtstbijzijnde tijdstip genomen. Dat mag gerust uren eerder of later zijn.
- Aan de hand van de instellingen wordt er met de weergegevens bepaald of er een reden is om niet te gaan fietsen. Als één van de instellingen wordt overschreden is het geen goed fietsweer. Dus als het bijvoorbeeld harder waait dan de ingestelde windsnelheid, of als de temperatuur buiten de ingestelde grenzen valt, of als er meer kans op regen is dan ingesteld, dan is het geen goed fietsweer.
- Geef de drie wel/niet goed fietsweer resultaten terug in de response.

Een voorbeeld response die deze route zou kunnen teruggeven op /api/weather/123-123abc123-123:
```json
{
    "id": "123-123abc123-123",
    "location": "Rotterdam",
    "departure": "08:00",
    "okay_to_bike": [
        {
            "date": "01-01-2022",
            "bike_okay": false
        },
        {
            "date": "01-02-2022",
            "bike_okay": true
        },
        {
            "date": "01-03-2022",
            "bike_okay": false
        }
    ]
}
```
Je mag hier gerust een ander JSON formaat voor bedenken.

#### POST /api/weather/
De lijst met instellingen van de gebruiker wordt opgeslagen in de database. Het backend geeft een nieuw "id" terug in de response.

Je mag hier zelf het database model en JSON formaat voor bedenken.

#### PUT /api/weather/####
Via deze methode wordt een bestaande lijst met instellingen van de gebruiker overschreven.

### Technische details
Als webserver om deze code in aan te bieden raden we Python & Flask aan, maar een oplossing met een ander framework in Python of server-side javascript is ook toegestaan. Besef dat opslag in een lokale database een vereiste is, een complete browser-only oplossing is daarmee geen optie.  

Het React Native frontend hoeft niet te worden opgeleverd als complete app (dus niet als APK bestand). Als je de werking kunt demonstreren met de Expo CLI of andere methode op de desktop is dat voldoende. We raden aan om éérst het ReactJS frontend te maken en deze daarna na te bouwen in React Native.  

Hoewel niet verplicht raden we sterk aan om frontend en backend via een Docker Compose file startbaar te maken. 

### Additionele eisen
We hebben een extra wens die niet noodzakelijk is voor het eerste product. De app neemt nu een stad aan om de fietstocht te plannen. De meeste grote steden staan toch wel in de OpenWeathermap API. Maar liever zouden we een losse locatie kiezen, bijvoorbeeld op straatnaam of door een plek op een kaart te kiezen. Je kunt hiervoor een externe API gebruiken om in het frontend een kaart te tekenen en de gebruiker te laten kiezen. De Google Maps API is een goede optie waar veel voorbeelden van gebruik van zijn te vinden. 

# Oplevering
Als oplevering verwachten we een melding via Teams bij de docent met link naar een Github repository met:
- Een REST API backend, met een database (of database script) voor de instellingen en locatie. Let op! API keys en wachtwoorden voor eventuele externe sites mogen niet in github worden opgeslagen. Gebruik hier een extern bestand voor dat je aan jouw .gitignore toevoegt.
- Een ReactJS frontend, ge-packaged voor oplevering via het backend, of direct te starten vanuit een ontwikkelserver. 
- Een React Native mobiele app, ge-packaged voor oplevering of direct te starten vanuit een ontwikkelserver. 
- Een README.md met uitleg over hoe backend, frontend en mobiele app (in geval van oplevering uit een ontwikkelserver) te starten en hoe een nieuwe key voor eventuele externe diensten aan te vragen.
- Een “main” branch met een “v1.0” release tag.

# Beoordeling
Voor de beoordeling volgen we de regels zoals die in de modulehandleiding staan. Kort samengevat komt dat op het volgende neer:
- We verwachten een investering qua tijd en moeite in je code terug te zien. Daarbij
moet je gebruik maken van alle technologie genoemd onder “oplevering”.
- De code voldoet aan de standaarden zoals uitgelegd in WP1, WP2 en WP3. De naamgeving in de code is in het Engels, de code uitgelijnd volgens de PEP8 standaard, etcetera. Code van het backend moet MVC stijl gesplitst zijn, we willen SQL in de route handlers vermijden, etcetera.
- We beoordelen een werkend product (dus frontend en mobiele app) met een “voldoende”. We beoordelen met een “goed” als het product goed verzorgd is en de code volwassenheid en begrip van gebruik van React toont. We beoordelen met een “uitstekend” als je buiten voorstaande ook de additionele eisen oplevert. 

Bij vragen over of onduidelijkheden in de requirements, neem contact op. Ook als je technisch vast komt te zitten geef het aan, we helpen je graag verder!
