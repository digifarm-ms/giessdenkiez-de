interface Item {
  title: string;
  description: string;
}

type TreeTypeId = 'LINDE' | 'AHORN' | 'EICHE' | 'KASTANIE' | 'PLATANE';
export interface TreeType extends Item {
  id: TreeTypeId;
}

type IconType = 'info' | 'zoom' | 'water' | 'subscribe';
export interface CollaborationItem extends Item {
  icon: IconType;
}
interface FAQ extends Item {
  qa: Array<{ question: string; answer: string }>;
}
interface Content {
  faq: FAQ;
  imprintAndPrivacy: {
    title: string;
    description: string;
    attribution: string;
  };
  intro: {
    title: string;
    subline: string;
    disclaimer: string;
    description: string[];
  };
  //pls do not delete the following eventNote section to facilitate process of enabling/disabling future news & notes
  //if event announcemnt is needed just de-comment this section and fill in the announcement text below
  eventNote?: {
    title: string;
  };
  whatsNew?: {
    title: string;
    description: string[];
  };
  loading: {
    snippets: string[];
  };
  sidebar: {
    about: Item[];
    waterNeeds: Item[];
    treetypes: TreeType[];
  };
  collaborate: {
    title: string;
    tiles: CollaborationItem[];
  };
}

const content: Content = {
  faq: {
    title: 'Fragen & Antworten',
    description:
      '<a href="https://www.stadt-muenster.de/farbe/mitmachen/muenster-schenkt-aus.html" target="_blank" rel="noreferrer">Auf der Infoseite des Grünflächenamtes</a> findest Du viele Tipps und Infos zum Gießen, zu Bäumen und zum Kontakt mit Anderen, die ebenfalls gießen.',
    qa: [],
  },
  imprintAndPrivacy: {
    title: 'Impressum und Datenschutz',
    description:
      '<a target="blank" href="https://www.stadt-muenster.de/impressum">Impressum</a> – <a target="blank" href="https://www.stadt-muenster.de/datenschutz">Datenschutz</a>',
    attribution:
      '© <a href="https://www.mapbox.com/about/maps/" target="_blank" rel="noreferrer">Mapbox</a> – © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> – <a href="https://www.mapbox.com/map-feedback" target="_blank" rel="noreferrer"><strong>Diese Karte verbessern</strong></a>',
  },
  intro: {
    title: 'Münster schenkt aus',
    subline:
      'Die münsterschen Straßenbäume leiden unter Trockenheit <br class="large" /> und Du kannst ihnen helfen!',
    disclaimer:
      'Hinweis: Das Laden von vielen tausend Bäumen ist ressourcenintensiv und funktioniert aktuell nicht auf allen Mobilgeräten einwandfrei. Wir empfehlen die Nutzung via Desktop-Computer',
    description: [
      'Willkommen in der Gieß-App von Münster schenkt aus. Auf dieser Plattform kannst Du Dich über Bäume in Deiner Nachbarschaft und ihren Wasserbedarf informieren. Du kannst für Bäume eine Gießpatenschaft übernehmen und/oder auch dokumentieren, wieviel Wasser Du ihnen gegeben hast.',
      '<a href="https://www.stadt-muenster.de/farbe/mitmachen/muenster-schenkt-aus.html" target="_blank" rel="noreferrer">Auf der Infoseite des Grünflächenamtes</a> kannst Du Dich über das richtige Gießen von Bäumen informieren. Wenn Du die Gieß-App regelmäßig nutzen möchtest, solltest Du ein Konto erstellen. Die Karte kannst Du aber auch ohne Konto erkunden.',
    ],
  },
  //pls do not delete the following eventNote section to facilitate process of enabling/disabling future news & notes
  // eventNote: {
  //   title:
  //     '<b>Gieß den Kiez Maintenance: </b><br> Nach dem Herbstputz ist uns aufgefallen, daß auch unser Datenbank etwas aufgeräumt werden muss. Daher werden wir am 29.11.2022 von 11:00 bis 16:00 Uhr die Plattform für Wartungsarbeiten abschalten. Wir bitten um euer Verständnis.',
  // },
  whatsNew: {
    title: 'Diese Website ist noch in Arbeit!',
    description: [
      'Das ist eine Vorabversion von "Münster schenkt aus", einer Website über die in Zukunft das Gießen von Stadtbäumen durch Freiwillige koordiniert werden soll.',
      'Diese Website basiert auf der Open-Source-Anwendung <a href="https://citylab-berlin.org/de/projects/giess-den-kiez/" target="_blank" rel="noreferrer">Gieß den Kiez</a>, die vom <a href="https://citylab-berlin.org/" target="_blank" rel="noreferrer">CityLAB</a> in Berlin entwickelt und dort seit 2021 verwendet wird',
    ],
  },
  loading: {
    snippets: [
      'Wir laden gerade über 2.000 Bäume aus dem münsterschen Baumbestand.',
      'Wenn du diese Seite über das Mobilfunknetz aufrufst, kann es etwas dauern.',
      'Sammle Informationen aller Bäume aus Münsters Baumkataster.',
      'Schon gewusst? Ein Stadtbaum benötigt etwa 70l Wasser in der Woche.',
    ],
  },
  sidebar: {
    about: [
      {
        title: 'Über das Projekt',
        description:
          'Die Folgen des Klimawandels, insbesondere die trockenen und heißen Sommer, belasten das münstersche Ökosystem. Unsere Stadtbäume vertrocknen und tragen langfristige Schäden davon: In den letzten Jahren mussten immer mehr Bäume gefällt werden und ihre Lebensdauer sinkt. Inzwischen wird die Bevölkerung regelmäßig zur Unterstützung aufgerufen, allerdings weitgehend unkoordiniert. Dies möchten wir ändern und mit diesem Projekt eine koordinierte Beteiligung von Bürgerinnen und Bürgern bei der Bewässerung städtischen Grüns ermöglichen.',
      },
      {
        title: 'Über uns',
        description: `„Gieß den Kiez” ist ein Projekt des <a target="blank" href="https://www.citylab-berlin.org/" target="_blank" rel="noreferrer">CityLAB Berlin</a> / Technologiestiftung Berlin. Diese App wurde dort ohne kommerzielle Interessen als Open-Source-Software entwickelt, damit sie nicht nur in Berlin, sondern auch in anderen Kommunen wie Münster genutzt und weiterentwickelt werden kann.<br/><br/>
        Die Adaption und Installation von „Gieß den Kiez“ für Münster wurde umgesetzt im Rahmen des Projektes <a href="https://www.stadt-muenster.de/digifarm/startseite" target="_blank" rel="noreferrer">DIGIFARM.MS</a>.
        DIGIFARM.MS ist eine Maßnahme der Bundesförderung „<a href="https://smartcity.ms/modellprojekte-smart-cities/" target="_blank" rel="noreferrer">Modellprojekte Smart Cities</a>“, gefördert durch: 
        <img src="/images/bundesministerium-logo.png" alt="Bundesministerium für Wohnen, Stadtentwicklung und Bauwesen" width="50%" /><img src="/images/kfw-logo.png" alt="KfW" width="45%" />
        `,
      },
      {
        title: 'Datenquellen',
        description:
          'Die Karte zeigt die münsterschen Straßenbäume. Zusätzlich wird abgebildet, wie viel Niederschlag in den letzten 30 Tagen bei jedem Baum gefallen ist und ob diese in dieser Zeit bereits gegossen wurden.',
      },
    ],
    waterNeeds: [
      {
        title: 'Niedriger Wasserbedarf',
        description:
          'Straßenbäume höheren Alters (>40 Jahre) haben in der Regel gelernt, sich über das Grundwasser selbst zu versorgen, aber auch sie leiden unter der zunehmenden Hitze und freuen sich über zusätzliches Wasser. Jungbäume unter 3 Jahren hingegen haben einen niedrigen Wasserbedarf, da diese im Normalfall durch die bezirklichen Grünflächenämter versorgt werden.',
      },
      {
        title: 'Mittlerer Wasserbedarf',
        description:
          'Mittelalte Bäume zwischen 15 und 40 Jahren werden in der Regel nicht mehr durch die Grünflächenämter bewässert, haben aber schon ein gewisses Durchhaltevermögen. Aber auch für sie sind die Hitzesommer ungewohnt und sie freuen sich über jeden Eimer: Gerne ein Mal in der Woche mit bis zu 100l gießen. ',
      },
      {
        title: 'Hoher Wasserbedarf',
        description:
          'Jungbäume zwischen vier und 15 Jahren werden nicht in allen Bezirken von der Verwaltung bewässert und sind noch keine „Selbstversorger“. Sie freuen sich über viel Wasser von bis zu 200l pro Gießung (ein Mal in der Woche).',
      },
    ],
    treetypes: [
      {
        id: 'LINDE',
        title: 'Linde (Tilia)',
        description:
          'Die Linde gilt seit Jahren als der berlintypische Straßenbaum. Mit einem Anteil von gut einem Drittel prägt sie den Straßenbaumbestand. Insgesamt lassen sich 10 verschiedene Arten unterscheiden. Bevorzugt gepflanzt wird die Winter-Linde (Tilia cordata), die als mittelgroßer Baum auch in schmaleren Straßen noch Raum findet. Die großkronige Kaiserlinde (Tilia intermedia) ist dagegen den weiträumigen Alleen vorbehalten.',
      },
      {
        id: 'AHORN',
        title: 'Ahorn (Acer)',
        description:
          'Die Gattung der Ahorne umfasst ca. 20% des Gesamtbestandes. Für den Standort „Straße” ist vor allem der Spitzahorn (Acer platanoides) geeignet. Die frühe Blüte und die bunte Herbstfärbung machen den Ahorn zu einer besonders beliebten Baumgattung.',
      },
      {
        id: 'EICHE',
        title: 'Eiche (Quercus)',
        description:
          'Der Anteil der Eichen beträgt rund 9% des Gesamtbestandes. In Berlin wird vor allem die Stiel-Eiche (Quercus robur) angepflanzt. Als Lichtbaum ist die Eiche nicht für enge Straßen geeignet. Die jüngsten Alleen im Parlaments- und Regierungsviertel wurden mit der sog. Spree-Eiche (Quercus palustris) bepflanzt, die sich u.a. durch ihre besonders schöne Herbstfärbung auszeichnet.',
      },
      {
        id: 'PLATANE',
        title: 'Platane (Platanus)',
        description:
          'Ein idealer Alleebaum für breite Straßen ist die Platane (Platanus acerifolia), die neben einer Höhe von 20 bis 30 m auch einen stattlichen Kronendurchmesser von 15 bis 20 m erreichen kann. Am Gesamtbestand haben die Platanen einen Anteil von etwa 6%. Die bekannteste und mit über 120 Jahren älteste Platanenallee in Berlin ist die Puschkinallee in Berlin-Treptow.',
      },
      {
        id: 'KASTANIE',
        title: 'Kastanie (Aesculus)',
        description:
          'Die Rosskastanie (Aesculus hippocastanum) hat einem Anteil von ca. 5% am Gesamtbestand, belegt damit den fünften Platz unter den Berliner Straßenbäumen.',
      },
    ],
  },
  collaborate: {
    title: '<b>Wie kann ich mitmachen?</b>',
    tiles: [
      {
        icon: 'water',
        title: 'Bäume bewässern',
        description:
          'Informiere Dich auf unserer Plattform, ob die Bäume in deiner Straße Wasser benötigen. Wenn ja, schnapp Dir eine Gießkanne, einen Eimer oder einen Schlauch und leg los. Danach trägst Du die Bewässerung hier ein.',
      },
      {
        icon: 'subscribe',
        title: 'Gießpatenschaft für Bäume übernehmen',
        description:
          'Wenn Du regelmäßig die gleichen Bäume gießen willst, kannst Du Dich als Gießpate / Gießpatin für sie eintragen und so anzeigen, dass für sie gesorgt ist. So findet eine Koordinierung in der Nachbarschaft statt.',
      },
      {
        icon: 'zoom',
        title: 'Den Baumbestand erkunden',
        description:
          'Unsere Karte ermöglicht es, mehr über einzelne Bäume und auch den gesamten Baumbestand zu erfahren. Nutze die Filter- und Suchfunktion, um mehr über die Bäume Münsters zu lernen.',
      },
      {
        icon: 'info',
        title: 'Mit anderen austauschen',
        description:
          'Wir werden Dich mit unserem Newsletter, der an die E-Mail-Adresse Deines Benutzerkontos hier gesendet wird, über aktuelle Entwicklungen und Aktionen auf dem Laufenden halten.',
      },
      {
        icon: 'info',
        title: 'Noch mehr Mitmachen',
        description:
          'Du kannst aber auch im Projektteam mitarbeiten, Wasserspender werden, Andere fürs Gießen begeistern, Links zu Münster schenkt aus viel teilen oder in der Presse über Münster schenkt aus berichten. <a href="https://www.stadt-muenster.de/farbe/mitmachen/muenster-schenkt-aus" target="_blank" rel="noreferrer">Auf unserer Webseite findest weitere Infos dazu.</a> Und natürlich freuen wir uns immer über Posts/Likes bei Instagram oder Facebook.',
      },
    ],
  },
};

export default content;
