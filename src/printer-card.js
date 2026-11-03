var PRINTER_CARD_VERSION = '__VERSION__';

// ── i18n ──────────────────────────────────────────────────────────────────────
var HpI18n = {
  fr: {
    printer: 'Imprimante',
    st_ready: 'Prête',
    st_inpowersave: 'En veille',
    st_processing: 'Impression en cours',
    st_scanprocessing: 'Numérisation en cours',
    st_copying: 'Copie en cours',
    st_canceljob: 'Annulation de la tâche',
    st_stopped: 'Arrêtée',
    st_offline: 'Hors ligne',
    st_unknown: 'État inconnu',
    offline_text: 'L\'imprimante est éteinte ou injoignable.',
    last_seen: 'Dernier contact {t}',
    inks: 'Niveaux d\'encre',
    alerts: 'Alertes',
    no_alerts: 'Aucune alerte',
    no_device: 'Aucune imprimante trouvée',
    toner: 'Niveaux de toner',
    pages: '{n} pages imprimées',
    pages_left: '≈ {n} pages',
    c_black: 'Noir',
    c_cyan: 'Cyan',
    c_magenta: 'Magenta',
    c_yellow: 'Jaune',
    c_tricolor: 'Couleur',
    c_ink: 'Encre',
    cw_black: 'noire',
    printhead: 'Tête d\'impression',
    al_low: 'Encre {c} faible ({p} %)',
    al_empty: 'Encre {c} presque épuisée ({p} %)',
    al_cartridge: 'Cartouche {c} : {s}',
    al_printhead: 'Tête d\'impression : {s}',
    al_expired: 'Garantie de la cartouche {c} expirée',
    al_stopped: 'L\'imprimante est arrêtée',
    cs_missing: 'absente',
    cs_empty: 'vide',
    cs_used: 'déjà utilisée',
    cs_counterfeit: 'contrefaite',
    cs_nongenuine: 'non HP',
    cs_incompatible: 'incompatible',
    cs_damaged: 'endommagée',
    cs_problem: 'problème détecté',
    ipp_media_empty: 'Bac à papier vide',
    ipp_media_low: 'Papier bientôt épuisé',
    ipp_media_jam: 'Bourrage papier',
    ipp_door_open: 'Capot ouvert',
    ipp_cover_open: 'Capot ouvert',
    ipp_input_tray_missing: 'Bac à papier absent',
    ipp_output_area_full: 'Bac de sortie plein',
    ipp_marker_supply_empty: 'Cartouche vide',
    ipp_media_needed: 'Chargez du papier',
    ipp_toner_empty: 'Toner vide',
    ipp_marker_supply_missing: 'Cartouche absente',
    ipp_offline: 'Imprimante hors ligne',
    ed_device: 'Imprimante',
    ed_device_helper: 'Appareil de l\'intégration HP Printer ou IPP (toutes marques)',
    ed_name: 'Nom',
    ed_name_helper: 'Laisser vide pour le nom de l\'appareil',
    ed_show_image: 'Image de l\'imprimante',
    ed_show_inks: 'Niveaux d\'encre',
    ed_show_alerts: 'Alertes',
    ed_show_stats: 'Compteur de pages',
    ed_show_expired: 'Alerte garantie expirée',
    ed_low_threshold: 'Seuil d\'encre faible (%)',
    ed_admin_url: 'Page d\'administration (URL)',
    ed_admin_url_helper: 'Ouverte au clic sur l\'imprimante — laisser vide pour l\'adresse détectée',
    open_admin: 'Ouvrir la page d\'administration de l\'imprimante',
    ed_image: 'Image personnalisée (URL)',
    ed_image_helper: 'Ex. /local/imprimante.png — remplace l\'illustration',
    ed_picture: 'Illustration',
    ed_picture_helper: 'Automatique : dessin selon la marque et la gamme (HP, Brother, Epson, Canon), sinon imprimante générique',
    pic_auto: 'Automatique',
    pic_officejet: 'HP OfficeJet / PageWide (multifonction)',
    pic_laserjet: 'HP LaserJet (laser)',
    pic_deskjet: 'HP DeskJet / ENVY (compacte)',
    pic_smart_tank: 'HP Smart Tank (réservoirs)',
    pic_generic: 'Imprimante générique (IPP)',
    pic_brother_laser: 'Brother HL / DCP-L / MFC-L',
    pic_brother_inkjet: 'Brother MFC-J / DCP-J',
    pic_ecotank: 'Epson EcoTank',
    pic_epson_inkjet: 'Epson Expression / WorkForce',
    pic_pixma: 'Canon PIXMA / MAXIFY',
    pic_megatank: 'Canon MegaTank (PIXMA G)',
    pic_canon_laser: 'Canon i-SENSYS / imageCLASS',
    ed_language: 'Langue',
    ed_language_helper: 'Laisser vide pour suivre la langue de Home Assistant',
    ed_entities: 'Entités (avancé)',
    ed_entities_helper: 'Détectées automatiquement depuis l\'appareil ; à renseigner seulement pour forcer une entité',
    en_status: 'Statut',
    en_ipp: 'Capteur IPP (alertes papier, capot…)',
    en_total_pages: 'Total de pages',
    en_eprint: 'Statut ePrint',
    en_eprint_registration: 'Enregistrement ePrint',
    ed_show_eprint: 'Statut ePrint',
    ep_on: 'ePrint activé',
    ep_off: 'ePrint désactivé',
    ep_unregistered: 'ePrint non enregistré',
    ed_zoom: 'Bouton de détail',
    ed_zoom_helper: 'En haut à droite : affiche la carte complète, un clic ailleurs revient à la vue compacte',
    zoom_in: 'Afficher la carte complète',
    zoom_out: 'Revenir à la vue compacte',
  },
  en: {
    printer: 'Printer',
    st_ready: 'Ready',
    st_inpowersave: 'Sleeping',
    st_processing: 'Printing',
    st_scanprocessing: 'Scanning',
    st_copying: 'Copying',
    st_canceljob: 'Cancelling job',
    st_stopped: 'Stopped',
    st_offline: 'Offline',
    st_unknown: 'Unknown state',
    offline_text: 'The printer is turned off or unreachable.',
    last_seen: 'Last seen {t}',
    inks: 'Ink levels',
    alerts: 'Alerts',
    no_alerts: 'No alerts',
    no_device: 'No printer found',
    toner: 'Toner levels',
    pages: '{n} pages printed',
    pages_left: '≈ {n} pages',
    c_black: 'Black',
    c_cyan: 'Cyan',
    c_magenta: 'Magenta',
    c_yellow: 'Yellow',
    c_tricolor: 'Tri-color',
    c_ink: 'Ink',
    printhead: 'Printhead',
    al_low: '{c} ink low ({p} %)',
    al_empty: '{c} ink nearly empty ({p} %)',
    al_cartridge: '{c} cartridge: {s}',
    al_printhead: 'Printhead: {s}',
    al_expired: '{c} cartridge warranty expired',
    al_stopped: 'The printer is stopped',
    cs_missing: 'missing',
    cs_empty: 'empty',
    cs_used: 'previously used',
    cs_counterfeit: 'counterfeit',
    cs_nongenuine: 'non-HP',
    cs_incompatible: 'incompatible',
    cs_damaged: 'damaged',
    cs_problem: 'problem detected',
    ipp_media_empty: 'Paper tray empty',
    ipp_media_low: 'Paper running low',
    ipp_media_jam: 'Paper jam',
    ipp_door_open: 'Cover open',
    ipp_cover_open: 'Cover open',
    ipp_input_tray_missing: 'Paper tray missing',
    ipp_output_area_full: 'Output tray full',
    ipp_marker_supply_empty: 'Cartridge empty',
    ipp_media_needed: 'Load paper',
    ipp_toner_empty: 'Toner empty',
    ipp_marker_supply_missing: 'Cartridge missing',
    ipp_offline: 'Printer offline',
    ed_device: 'Printer',
    ed_device_helper: 'Device from the HP Printer or IPP integration (any brand)',
    ed_name: 'Name',
    ed_name_helper: 'Leave empty to use the device name',
    ed_show_image: 'Printer picture',
    ed_show_inks: 'Ink levels',
    ed_show_alerts: 'Alerts',
    ed_show_stats: 'Page counter',
    ed_show_expired: 'Expired warranty alert',
    ed_low_threshold: 'Low ink threshold (%)',
    ed_admin_url: 'Admin page (URL)',
    ed_admin_url_helper: 'Opened when clicking the printer — leave empty for the detected address',
    open_admin: 'Open the printer admin page',
    ed_image: 'Custom picture (URL)',
    ed_image_helper: 'E.g. /local/printer.png — replaces the illustration',
    ed_picture: 'Illustration',
    ed_picture_helper: 'Automatic: drawing by brand and range (HP, Brother, Epson, Canon), else a generic printer',
    pic_auto: 'Automatic',
    pic_officejet: 'HP OfficeJet / PageWide (all-in-one)',
    pic_laserjet: 'HP LaserJet (laser)',
    pic_deskjet: 'HP DeskJet / ENVY (compact)',
    pic_smart_tank: 'HP Smart Tank (ink tanks)',
    pic_generic: 'Generic printer (IPP)',
    pic_brother_laser: 'Brother HL / DCP-L / MFC-L',
    pic_brother_inkjet: 'Brother MFC-J / DCP-J',
    pic_ecotank: 'Epson EcoTank',
    pic_epson_inkjet: 'Epson Expression / WorkForce',
    pic_pixma: 'Canon PIXMA / MAXIFY',
    pic_megatank: 'Canon MegaTank (PIXMA G)',
    pic_canon_laser: 'Canon i-SENSYS / imageCLASS',
    ed_language: 'Language',
    ed_language_helper: 'Leave empty to follow the Home Assistant language',
    ed_entities: 'Entities (advanced)',
    ed_entities_helper: 'Detected from the device; only set them to force an entity',
    en_status: 'Status',
    en_ipp: 'IPP sensor (paper, cover… alerts)',
    en_total_pages: 'Total pages',
    en_eprint: 'ePrint status',
    en_eprint_registration: 'ePrint registration',
    ed_show_eprint: 'ePrint status',
    ep_on: 'ePrint on',
    ep_off: 'ePrint off',
    ep_unregistered: 'ePrint not registered',
    ed_zoom: 'Detail button',
    ed_zoom_helper: 'Top right: shows the full card, a click anywhere else goes back to the compact view',
    zoom_in: 'Show the full card',
    zoom_out: 'Back to the compact view',
  },
  de: {
    printer: 'Drucker',
    st_ready: 'Bereit',
    st_inpowersave: 'Energiesparmodus',
    st_processing: 'Druckt',
    st_scanprocessing: 'Scannt',
    st_copying: 'Kopiert',
    st_canceljob: 'Druckauftrag wird abgebrochen',
    st_stopped: 'Angehalten',
    st_offline: 'Offline',
    st_unknown: 'Unbekannter Status',
    offline_text: 'Der Drucker ist ausgeschaltet oder nicht erreichbar.',
    last_seen: 'Zuletzt gesehen: {t}',
    inks: 'Tintenfüllstände',
    alerts: 'Warnmeldungen',
    no_alerts: 'Keine Warnmeldungen',
    no_device: 'Kein Drucker gefunden',
    toner: 'Tonerfüllstände',
    pages: '{n} Seiten gedruckt',
    pages_left: '≈ {n} Seiten',
    c_black: 'Schwarz',
    c_cyan: 'Cyan',
    c_magenta: 'Magenta',
    c_yellow: 'Gelb',
    c_tricolor: 'Farbe',
    c_ink: 'Tinte',
    printhead: 'Druckkopf',
    al_low: 'Wenig Tinte: {c} ({p} %)',
    al_empty: 'Tinte fast leer: {c} ({p} %)',
    al_cartridge: 'Patrone {c}: {s}',
    al_printhead: 'Druckkopf: {s}',
    al_expired: 'Garantie der Patrone {c} abgelaufen',
    al_stopped: 'Der Drucker wurde angehalten',
    cs_missing: 'fehlt',
    cs_empty: 'leer',
    cs_used: 'bereits verwendet',
    cs_counterfeit: 'gefälscht',
    cs_nongenuine: 'Kein Originalprodukt von HP',
    cs_incompatible: 'inkompatibel',
    cs_damaged: 'beschädigt',
    cs_problem: 'Problem erkannt',
    ipp_media_empty: 'Papierfach leer',
    ipp_media_low: 'Papier fast aufgebraucht',
    ipp_media_jam: 'Papierstau',
    ipp_door_open: 'Tür geöffnet',
    ipp_cover_open: 'Abdeckung geöffnet',
    ipp_input_tray_missing: 'Papierfach fehlt',
    ipp_output_area_full: 'Papierausgabefach voll',
    ipp_marker_supply_empty: 'Patrone leer',
    ipp_media_needed: 'Papier einlegen',
    ipp_toner_empty: 'Toner leer',
    ipp_marker_supply_missing: 'Patrone fehlt',
    ipp_offline: 'Drucker offline',
    ed_device: 'Drucker',
    ed_device_helper: 'Gerät aus der HP-Drucker- oder IPP-Integration (beliebige Marke)',
    ed_name: 'Name',
    ed_name_helper: 'Leer lassen, um den Gerätenamen zu verwenden',
    ed_show_image: 'Druckerbild',
    ed_show_inks: 'Tintenfüllstände',
    ed_show_alerts: 'Warnmeldungen',
    ed_show_stats: 'Seitenzähler',
    ed_show_expired: 'Warnung bei abgelaufener Garantie',
    ed_low_threshold: 'Schwellenwert für niedrigen Tintenstand (%)',
    ed_admin_url: 'Administrationsseite (URL)',
    ed_admin_url_helper: 'Wird beim Klicken auf den Drucker geöffnet – leer lassen, um die erkannte Adresse zu verwenden',
    open_admin: 'Drucker-Administrationsseite öffnen',
    ed_image: 'Eigenes Bild (URL)',
    ed_image_helper: 'Z. B. /local/printer.png – ersetzt die Illustration',
    ed_picture: 'Illustration',
    ed_picture_helper: 'Automatisch: Darstellung anhand von Marke und Produktreihe (HP, Brother, Epson, Canon), andernfalls ein allgemeiner Drucker',
    pic_auto: 'Automatisch',
    pic_officejet: 'HP OfficeJet / PageWide (Multifunktionsgerät)',
    pic_laserjet: 'HP LaserJet (Laserdrucker)',
    pic_deskjet: 'HP DeskJet / ENVY (Kompaktdrucker)',
    pic_smart_tank: 'HP Smart Tank (Tintentanks)',
    pic_generic: 'Allgemeiner Drucker (IPP)',
    pic_brother_laser: 'Brother HL / DCP-L / MFC-L',
    pic_brother_inkjet: 'Brother MFC-J / DCP-J',
    pic_ecotank: 'Epson EcoTank',
    pic_epson_inkjet: 'Epson Expression / WorkForce',
    pic_pixma: 'Canon PIXMA / MAXIFY',
    pic_megatank: 'Canon MegaTank (PIXMA G)',
    pic_canon_laser: 'Canon i-SENSYS / imageCLASS',
    ed_language: 'Sprache',
    ed_language_helper: 'Leer lassen, um die in Home Assistant eingestellte Sprache zu verwenden',
    ed_entities: 'Entitäten (erweitert)',
    ed_entities_helper: 'Automatisch anhand des Geräts erkannt; nur festlegen, wenn eine bestimmte Entität erzwungen werden soll',
    en_status: 'Status',
    en_ipp: 'IPP-Sensor (Papier, Abdeckung usw. – Warnmeldungen)',
    en_total_pages: 'Seiten insgesamt',
    en_eprint: 'ePrint-Status',
    en_eprint_registration: 'ePrint-Registrierung',
    ed_show_eprint: 'ePrint-Status',
    ep_on: 'ePrint aktiviert',
    ep_off: 'ePrint deaktiviert',
    ep_unregistered: 'ePrint nicht registriert',
    ed_zoom: 'Detailansicht-Schaltfläche',
    ed_zoom_helper: 'Oben rechts: zeigt die vollständige Karte an. Ein Klick an eine andere Stelle führt zurück zur kompakten Ansicht.',
    zoom_in: 'Vollständige Karte anzeigen',
    zoom_out: 'Zur kompakten Ansicht zurückkehren',
  },
  es: {
    printer: 'Impresora',
    st_ready: 'Lista',
    st_inpowersave: 'En reposo',
    st_processing: 'Imprimiendo',
    st_scanprocessing: 'Escaneando',
    st_copying: 'Copiando',
    st_canceljob: 'Cancelando el trabajo',
    st_stopped: 'Detenida',
    st_offline: 'Desconectada',
    st_unknown: 'Estado desconocido',
    offline_text: 'La impresora está apagada o no se puede acceder a ella.',
    last_seen: 'Vista por última vez {t}',
    inks: 'Niveles de tinta',
    alerts: 'Alertas',
    no_alerts: 'Sin alertas',
    no_device: 'No se encontró ninguna impresora',
    toner: 'Niveles de tóner',
    pages: '{n} páginas impresas',
    pages_left: '≈ {n} páginas',
    c_black: 'Negro',
    c_cyan: 'Cian',
    c_magenta: 'Magenta',
    c_yellow: 'Amarillo',
    c_tricolor: 'Tricolor',
    c_ink: 'Tinta',
    printhead: 'Cabezal de impresión',
    al_low: 'Tinta baja: {c} ({p} %)',
    al_empty: 'Tinta casi agotada: {c} ({p} %)',
    al_cartridge: 'Cartucho {c}: {s}',
    al_printhead: 'Cabezal de impresión: {s}',
    al_expired: 'Garantía del cartucho {c} caducada',
    al_stopped: 'La impresora está detenida',
    cs_missing: 'ausente',
    cs_empty: 'vacío',
    cs_used: 'ya utilizado',
    cs_counterfeit: 'falsificado',
    cs_nongenuine: 'no original de HP',
    cs_incompatible: 'incompatible',
    cs_damaged: 'dañado',
    cs_problem: 'problema detectado',
    ipp_media_empty: 'Bandeja de papel vacía',
    ipp_media_low: 'Queda poco papel',
    ipp_media_jam: 'Atasco de papel',
    ipp_door_open: 'Puerta abierta',
    ipp_cover_open: 'Tapa abierta',
    ipp_input_tray_missing: 'Falta la bandeja de papel',
    ipp_output_area_full: 'Bandeja de salida llena',
    ipp_marker_supply_empty: 'Cartucho vacío',
    ipp_media_needed: 'Cargue papel',
    ipp_toner_empty: 'Tóner vacío',
    ipp_marker_supply_missing: 'Falta el cartucho',
    ipp_offline: 'Impresora desconectada',
    ed_device: 'Impresora',
    ed_device_helper: 'Dispositivo de la integración HP Printer o IPP (cualquier marca)',
    ed_name: 'Nombre',
    ed_name_helper: 'Déjalo vacío para usar el nombre del dispositivo',
    ed_show_image: 'Imagen de la impresora',
    ed_show_inks: 'Niveles de tinta',
    ed_show_alerts: 'Alertas',
    ed_show_stats: 'Contador de páginas',
    ed_show_expired: 'Alerta de garantía caducada',
    ed_low_threshold: 'Umbral de tinta baja (%)',
    ed_admin_url: 'Página de administración (URL)',
    ed_admin_url_helper: 'Se abre al hacer clic en la impresora; déjalo vacío para usar la dirección detectada',
    open_admin: 'Abrir la página de administración de la impresora',
    ed_image: 'Imagen personalizada (URL)',
    ed_image_helper: 'P. ej. /local/printer.png; sustituye la ilustración',
    ed_picture: 'Ilustración',
    ed_picture_helper: 'Automática: dibujo según la marca y la gama (HP, Brother, Epson, Canon); si no, una impresora genérica',
    pic_auto: 'Automática',
    pic_officejet: 'HP OfficeJet / PageWide (multifunción)',
    pic_laserjet: 'HP LaserJet (láser)',
    pic_deskjet: 'HP DeskJet / ENVY (compacta)',
    pic_smart_tank: 'HP Smart Tank (depósitos de tinta)',
    pic_generic: 'Impresora genérica (IPP)',
    pic_brother_laser: 'Brother HL / DCP-L / MFC-L',
    pic_brother_inkjet: 'Brother MFC-J / DCP-J',
    pic_ecotank: 'Epson EcoTank',
    pic_epson_inkjet: 'Epson Expression / WorkForce',
    pic_pixma: 'Canon PIXMA / MAXIFY',
    pic_megatank: 'Canon MegaTank (PIXMA G)',
    pic_canon_laser: 'Canon i-SENSYS / imageCLASS',
    ed_language: 'Idioma',
    ed_language_helper: 'Déjalo vacío para seguir el idioma de Home Assistant',
    ed_entities: 'Entidades (avanzado)',
    ed_entities_helper: 'Detectadas a partir del dispositivo; indícalas solo para forzar una entidad',
    en_status: 'Estado',
    en_ipp: 'Sensor IPP (alertas de papel, tapa…)',
    en_total_pages: 'Total de páginas',
    en_eprint: 'Estado de ePrint',
    en_eprint_registration: 'Registro de ePrint',
    ed_show_eprint: 'Estado de ePrint',
    ep_on: 'ePrint activado',
    ep_off: 'ePrint desactivado',
    ep_unregistered: 'ePrint no registrado',
    ed_zoom: 'Botón de detalle',
    ed_zoom_helper: 'Arriba a la derecha: muestra la tarjeta completa; un clic en cualquier otro lugar vuelve a la vista compacta',
    zoom_in: 'Mostrar la tarjeta completa',
    zoom_out: 'Volver a la vista compacta',
  },
  sr: {
    printer: 'Штампач',
    st_ready: 'Спреман',
    st_inpowersave: 'У стању мировања',
    st_processing: 'Штампа',
    st_scanprocessing: 'Скенира',
    st_copying: 'Копира',
    st_canceljob: 'Отказивање задатка',
    st_stopped: 'Заустављен',
    st_offline: 'Ван мреже',
    st_unknown: 'Непознато стање',
    offline_text: 'Штампач је искључен или недоступан.',
    last_seen: 'Последњи пут виђен {t}',
    inks: 'Нивои мастила',
    alerts: 'Упозорења',
    no_alerts: 'Нема упозорења',
    no_device: 'Није пронађен ниједан штампач',
    toner: 'Нивои тонера',
    pages: 'Одштампано страница: {n}',
    pages_left: '≈ {n} страница',
    c_black: 'Црна',
    c_cyan: 'Цијан',
    c_magenta: 'Магента',
    c_yellow: 'Жута',
    c_tricolor: 'Тробојна',
    c_ink: 'Мастило',
    printhead: 'Глава за штампање',
    al_low: 'Низак ниво мастила: {c} ({p} %)',
    al_empty: 'Мастило је скоро потрошено: {c} ({p} %)',
    al_cartridge: 'Кертриџ ({c}): {s}',
    al_printhead: 'Глава за штампање: {s}',
    al_expired: 'Истекла је гаранција кертриџа ({c})',
    al_stopped: 'Штампач је заустављен',
    cs_missing: 'недостаје',
    cs_empty: 'празан',
    cs_used: 'већ коришћен',
    cs_counterfeit: 'фалсификован',
    cs_nongenuine: 'није оригинални HP',
    cs_incompatible: 'некомпатибилан',
    cs_damaged: 'оштећен',
    cs_problem: 'откривен проблем',
    // The printhead (глава) is feminine: its own forms, where they differ from the cartridge ones.
    ph_empty: 'празна',
    ph_used: 'већ коришћена',
    ph_counterfeit: 'фалсификована',
    ph_nongenuine: 'није оригинална HP',
    ph_incompatible: 'некомпатибилна',
    ph_damaged: 'оштећена',
    ipp_media_empty: 'Лежиште за папир је празно',
    ipp_media_low: 'Папир је при крају',
    ipp_media_jam: 'Заглављен папир',
    ipp_door_open: 'Врата су отворена',
    ipp_cover_open: 'Поклопац је отворен',
    ipp_input_tray_missing: 'Недостаје лежиште за папир',
    ipp_output_area_full: 'Излазно лежиште је пуно',
    ipp_marker_supply_empty: 'Кертриџ је празан',
    ipp_media_needed: 'Убаците папир',
    ipp_toner_empty: 'Тонер је празан',
    ipp_marker_supply_missing: 'Недостаје кертриџ',
    ipp_offline: 'Штампач је ван мреже',
    ed_device: 'Штампач',
    ed_device_helper: 'Уређај из интеграције HP Printer или IPP (било који бренд)',
    ed_name: 'Назив',
    ed_name_helper: 'Оставите празно за назив уређаја',
    ed_show_image: 'Слика штампача',
    ed_show_inks: 'Нивои мастила',
    ed_show_alerts: 'Упозорења',
    ed_show_stats: 'Бројач страница',
    ed_show_expired: 'Упозорење о истеклој гаранцији',
    ed_low_threshold: 'Праг ниског нивоа мастила (%)',
    ed_admin_url: 'Страница за администрацију (URL)',
    ed_admin_url_helper: 'Отвара се кликом на штампач — оставите празно за откривену адресу',
    open_admin: 'Отвори страницу за администрацију штампача',
    ed_image: 'Прилагођена слика (URL)',
    ed_image_helper: 'Нпр. /local/printer.png — замењује илустрацију',
    ed_picture: 'Илустрација',
    ed_picture_helper: 'Аутоматски: цртеж према марки и линији (HP, Brother, Epson, Canon), иначе генерички штампач',
    pic_auto: 'Аутоматски',
    pic_officejet: 'HP OfficeJet / PageWide (мултифункционални)',
    pic_laserjet: 'HP LaserJet (ласерски)',
    pic_deskjet: 'HP DeskJet / ENVY (компактни)',
    pic_smart_tank: 'HP Smart Tank (резервоари за мастило)',
    pic_generic: 'Генерички штампач (IPP)',
    pic_brother_laser: 'Brother HL / DCP-L / MFC-L',
    pic_brother_inkjet: 'Brother MFC-J / DCP-J',
    pic_ecotank: 'Epson EcoTank',
    pic_epson_inkjet: 'Epson Expression / WorkForce',
    pic_pixma: 'Canon PIXMA / MAXIFY',
    pic_megatank: 'Canon MegaTank (PIXMA G)',
    pic_canon_laser: 'Canon i-SENSYS / imageCLASS',
    ed_language: 'Језик',
    ed_language_helper: 'Оставите празно да бисте пратили језик Home Assistant-а',
    ed_entities: 'Ентитети (напредно)',
    ed_entities_helper: 'Откривају се из уређаја; попуните их само да бисте наметнули ентитет',
    en_status: 'Статус',
    en_ipp: 'IPP сензор (упозорења за папир, поклопац…)',
    en_total_pages: 'Укупно страница',
    en_eprint: 'ePrint статус',
    en_eprint_registration: 'ePrint регистрација',
    ed_show_eprint: 'ePrint статус',
    ep_on: 'ePrint укључен',
    ep_off: 'ePrint искључен',
    ep_unregistered: 'ePrint није регистрован',
    ed_zoom: 'Дугме за детаље',
    ed_zoom_helper: 'Горе десно: приказује целу картицу, клик било где другде враћа на компактни приказ',
    zoom_in: 'Прикажи целу картицу',
    zoom_out: 'Назад на компактни приказ',
  },
  'sr-Latn': {
    printer: 'Štampač',
    st_ready: 'Spreman',
    st_inpowersave: 'U stanju mirovanja',
    st_processing: 'Štampa',
    st_scanprocessing: 'Skenira',
    st_copying: 'Kopira',
    st_canceljob: 'Otkazivanje zadatka',
    st_stopped: 'Zaustavljen',
    st_offline: 'Van mreže',
    st_unknown: 'Nepoznato stanje',
    offline_text: 'Štampač je isključen ili nedostupan.',
    last_seen: 'Poslednji put viđen {t}',
    inks: 'Nivoi mastila',
    alerts: 'Upozorenja',
    no_alerts: 'Nema upozorenja',
    no_device: 'Nije pronađen nijedan štampač',
    toner: 'Nivoi tonera',
    pages: 'Odštampano stranica: {n}',
    pages_left: '≈ {n} stranica',
    c_black: 'Crna',
    c_cyan: 'Cijan',
    c_magenta: 'Magenta',
    c_yellow: 'Žuta',
    c_tricolor: 'Trobojna',
    c_ink: 'Mastilo',
    printhead: 'Glava za štampanje',
    al_low: 'Nizak nivo mastila: {c} ({p} %)',
    al_empty: 'Mastilo je skoro potrošeno: {c} ({p} %)',
    al_cartridge: 'Kertridž ({c}): {s}',
    al_printhead: 'Glava za štampanje: {s}',
    al_expired: 'Istekla je garancija kertridža ({c})',
    al_stopped: 'Štampač je zaustavljen',
    cs_missing: 'nedostaje',
    cs_empty: 'prazan',
    cs_used: 'već korišćen',
    cs_counterfeit: 'falsifikovan',
    cs_nongenuine: 'nije originalni HP',
    cs_incompatible: 'nekompatibilan',
    cs_damaged: 'oštećen',
    cs_problem: 'otkriven problem',
    // The printhead (glava) is feminine: its own forms, where they differ from the cartridge ones.
    ph_empty: 'prazna',
    ph_used: 'već korišćena',
    ph_counterfeit: 'falsifikovana',
    ph_nongenuine: 'nije originalna HP',
    ph_incompatible: 'nekompatibilna',
    ph_damaged: 'oštećena',
    ipp_media_empty: 'Ležište za papir je prazno',
    ipp_media_low: 'Papir je pri kraju',
    ipp_media_jam: 'Zaglavljen papir',
    ipp_door_open: 'Vrata su otvorena',
    ipp_cover_open: 'Poklopac je otvoren',
    ipp_input_tray_missing: 'Nedostaje ležište za papir',
    ipp_output_area_full: 'Izlazno ležište je puno',
    ipp_marker_supply_empty: 'Kertridž je prazan',
    ipp_media_needed: 'Ubacite papir',
    ipp_toner_empty: 'Toner je prazan',
    ipp_marker_supply_missing: 'Nedostaje kertridž',
    ipp_offline: 'Štampač je van mreže',
    ed_device: 'Štampač',
    ed_device_helper: 'Uređaj iz integracije HP Printer ili IPP (bilo koji brend)',
    ed_name: 'Naziv',
    ed_name_helper: 'Ostavite prazno za naziv uređaja',
    ed_show_image: 'Slika štampača',
    ed_show_inks: 'Nivoi mastila',
    ed_show_alerts: 'Upozorenja',
    ed_show_stats: 'Brojač stranica',
    ed_show_expired: 'Upozorenje o istekloj garanciji',
    ed_low_threshold: 'Prag niskog nivoa mastila (%)',
    ed_admin_url: 'Stranica za administraciju (URL)',
    ed_admin_url_helper: 'Otvara se klikom na štampač — ostavite prazno za otkrivenu adresu',
    open_admin: 'Otvori stranicu za administraciju štampača',
    ed_image: 'Prilagođena slika (URL)',
    ed_image_helper: 'Npr. /local/printer.png — zamenjuje ilustraciju',
    ed_picture: 'Ilustracija',
    ed_picture_helper: 'Automatski: crtež prema marki i liniji (HP, Brother, Epson, Canon), inače generički štampač',
    pic_auto: 'Automatski',
    pic_officejet: 'HP OfficeJet / PageWide (multifunkcionalni)',
    pic_laserjet: 'HP LaserJet (laserski)',
    pic_deskjet: 'HP DeskJet / ENVY (kompaktni)',
    pic_smart_tank: 'HP Smart Tank (rezervoari za mastilo)',
    pic_generic: 'Generički štampač (IPP)',
    pic_brother_laser: 'Brother HL / DCP-L / MFC-L',
    pic_brother_inkjet: 'Brother MFC-J / DCP-J',
    pic_ecotank: 'Epson EcoTank',
    pic_epson_inkjet: 'Epson Expression / WorkForce',
    pic_pixma: 'Canon PIXMA / MAXIFY',
    pic_megatank: 'Canon MegaTank (PIXMA G)',
    pic_canon_laser: 'Canon i-SENSYS / imageCLASS',
    ed_language: 'Jezik',
    ed_language_helper: 'Ostavite prazno da biste pratili jezik Home Assistant-a',
    ed_entities: 'Entiteti (napredno)',
    ed_entities_helper: 'Otkrivaju se iz uređaja; popunite ih samo da biste nametnuli entitet',
    en_status: 'Status',
    en_ipp: 'IPP senzor (upozorenja za papir, poklopac…)',
    en_total_pages: 'Ukupno stranica',
    en_eprint: 'ePrint status',
    en_eprint_registration: 'ePrint registracija',
    ed_show_eprint: 'ePrint status',
    ep_on: 'ePrint uključen',
    ep_off: 'ePrint isključen',
    ep_unregistered: 'ePrint nije registrovan',
    ed_zoom: 'Dugme za detalje',
    ed_zoom_helper: 'Gore desno: prikazuje celu karticu, klik bilo gde drugde vraća na kompaktni prikaz',
    zoom_in: 'Prikaži celu karticu',
    zoom_out: 'Nazad na kompaktni prikaz',
  },
  it: {
    printer: 'Stampante',
    st_ready: 'Pronta',
    st_inpowersave: 'In standby',
    st_processing: 'Stampa in corso',
    st_scanprocessing: 'Scansione in corso',
    st_copying: 'Copia in corso',
    st_canceljob: 'Annullamento del lavoro',
    st_stopped: 'Arrestata',
    st_offline: 'Non in linea',
    st_unknown: 'Stato sconosciuto',
    offline_text: 'La stampante è spenta o non raggiungibile.',
    last_seen: 'Ultimo contatto {t}',
    inks: 'Livelli di inchiostro',
    alerts: 'Avvisi',
    no_alerts: 'Nessun avviso',
    no_device: 'Nessuna stampante trovata',
    toner: 'Livelli di toner',
    pages: '{n} pagine stampate',
    pages_left: '≈ {n} pagine',
    c_black: 'Nero',
    c_cyan: 'Ciano',
    c_magenta: 'Magenta',
    c_yellow: 'Giallo',
    c_tricolor: 'Tricolore',
    c_ink: 'Inchiostro',
    printhead: 'Testina di stampa',
    al_low: 'Inchiostro scarso: {c} ({p} %)',
    al_empty: 'Inchiostro quasi esaurito: {c} ({p} %)',
    al_cartridge: 'Cartuccia ({c}): {s}',
    al_printhead: 'Testina di stampa: {s}',
    al_expired: 'Garanzia della cartuccia ({c}) scaduta',
    al_stopped: 'La stampante è arrestata',
    cs_missing: 'mancante',
    cs_empty: 'vuota',
    cs_used: 'già utilizzata',
    cs_counterfeit: 'contraffatta',
    cs_nongenuine: 'non originale HP',
    cs_incompatible: 'incompatibile',
    cs_damaged: 'danneggiata',
    cs_problem: 'problema rilevato',
    ipp_media_empty: 'Vassoio carta vuoto',
    ipp_media_low: 'Carta in esaurimento',
    ipp_media_jam: 'Inceppamento carta',
    ipp_door_open: 'Sportello aperto',
    ipp_cover_open: 'Coperchio aperto',
    ipp_input_tray_missing: 'Vassoio carta mancante',
    ipp_output_area_full: 'Vassoio di uscita pieno',
    ipp_marker_supply_empty: 'Cartuccia vuota',
    ipp_media_needed: 'Caricare la carta',
    ipp_toner_empty: 'Toner esaurito',
    ipp_marker_supply_missing: 'Cartuccia mancante',
    ipp_offline: 'Stampante non in linea',
    ed_device: 'Stampante',
    ed_device_helper: 'Dispositivo dell\'integrazione HP Printer o IPP (qualsiasi marca)',
    ed_name: 'Nome',
    ed_name_helper: 'Lasciare vuoto per usare il nome del dispositivo',
    ed_show_image: 'Immagine della stampante',
    ed_show_inks: 'Livelli di inchiostro',
    ed_show_alerts: 'Avvisi',
    ed_show_stats: 'Contatore pagine',
    ed_show_expired: 'Avviso di garanzia scaduta',
    ed_low_threshold: 'Soglia di inchiostro scarso (%)',
    ed_admin_url: 'Pagina di amministrazione (URL)',
    ed_admin_url_helper: 'Aperta al clic sulla stampante — lasciare vuoto per l\'indirizzo rilevato',
    open_admin: 'Apri la pagina di amministrazione della stampante',
    ed_image: 'Immagine personalizzata (URL)',
    ed_image_helper: 'Es. /local/printer.png — sostituisce l\'illustrazione',
    ed_picture: 'Illustrazione',
    ed_picture_helper: 'Automatica: disegno in base a marca e gamma (HP, Brother, Epson, Canon), altrimenti stampante generica',
    pic_auto: 'Automatica',
    pic_officejet: 'HP OfficeJet / PageWide (multifunzione)',
    pic_laserjet: 'HP LaserJet (laser)',
    pic_deskjet: 'HP DeskJet / ENVY (compatta)',
    pic_smart_tank: 'HP Smart Tank (serbatoi di inchiostro)',
    pic_generic: 'Stampante generica (IPP)',
    pic_brother_laser: 'Brother HL / DCP-L / MFC-L',
    pic_brother_inkjet: 'Brother MFC-J / DCP-J',
    pic_ecotank: 'Epson EcoTank',
    pic_epson_inkjet: 'Epson Expression / WorkForce',
    pic_pixma: 'Canon PIXMA / MAXIFY',
    pic_megatank: 'Canon MegaTank (PIXMA G)',
    pic_canon_laser: 'Canon i-SENSYS / imageCLASS',
    ed_language: 'Lingua',
    ed_language_helper: 'Lasciare vuoto per seguire la lingua di Home Assistant',
    ed_entities: 'Entità (avanzate)',
    ed_entities_helper: 'Rilevate dal dispositivo; da impostare solo per forzare un\'entità',
    en_status: 'Stato',
    en_ipp: 'Sensore IPP (avvisi carta, coperchio…)',
    en_total_pages: 'Pagine totali',
    en_eprint: 'Stato ePrint',
    en_eprint_registration: 'Registrazione ePrint',
    ed_show_eprint: 'Stato ePrint',
    ep_on: 'ePrint attivo',
    ep_off: 'ePrint disattivato',
    ep_unregistered: 'ePrint non registrato',
    ed_zoom: 'Pulsante dettagli',
    ed_zoom_helper: 'In alto a destra: mostra la scheda completa, un clic altrove torna alla vista compatta',
    zoom_in: 'Mostra la scheda completa',
    zoom_out: 'Torna alla vista compatta',
  },
  nl: {
    printer: 'Printer',
    st_ready: 'Gereed',
    st_inpowersave: 'Slaapstand',
    st_processing: 'Bezig met afdrukken',
    st_scanprocessing: 'Bezig met scannen',
    st_copying: 'Bezig met kopiëren',
    st_canceljob: 'Taak wordt geannuleerd',
    st_stopped: 'Gestopt',
    st_offline: 'Offline',
    st_unknown: 'Onbekende status',
    offline_text: 'De printer staat uit of is onbereikbaar.',
    last_seen: 'Laatst gezien {t}',
    inks: 'Inktniveaus',
    alerts: 'Meldingen',
    no_alerts: 'Geen meldingen',
    no_device: 'Geen printer gevonden',
    toner: 'Tonerniveaus',
    pages: '{n} pagina\'s afgedrukt',
    pages_left: '≈ {n} pagina\'s',
    c_black: 'Zwart',
    c_cyan: 'Cyaan',
    c_magenta: 'Magenta',
    c_yellow: 'Geel',
    c_tricolor: 'Driekleur',
    c_ink: 'Inkt',
    printhead: 'Printkop',
    al_low: 'Inktniveau laag: {c} ({p} %)',
    al_empty: 'Inkt bijna op: {c} ({p} %)',
    al_cartridge: 'Cartridge ({c}): {s}',
    al_printhead: 'Printkop: {s}',
    al_expired: 'Garantie van cartridge ({c}) verlopen',
    al_stopped: 'De printer is gestopt',
    cs_missing: 'ontbreekt',
    cs_empty: 'leeg',
    cs_used: 'eerder gebruikt',
    cs_counterfeit: 'namaak',
    cs_nongenuine: 'niet-origineel',
    cs_incompatible: 'incompatibel',
    cs_damaged: 'beschadigd',
    cs_problem: 'probleem gedetecteerd',
    ipp_media_empty: 'Papierlade leeg',
    ipp_media_low: 'Papier bijna op',
    ipp_media_jam: 'Papierstoring',
    ipp_door_open: 'Klep open',
    ipp_cover_open: 'Kap open',
    ipp_input_tray_missing: 'Papierlade ontbreekt',
    ipp_output_area_full: 'Uitvoerlade vol',
    ipp_marker_supply_empty: 'Cartridge leeg',
    ipp_media_needed: 'Plaats papier',
    ipp_toner_empty: 'Toner leeg',
    ipp_marker_supply_missing: 'Cartridge ontbreekt',
    ipp_offline: 'Printer offline',
    ed_device: 'Printer',
    ed_device_helper: 'Apparaat van de HP Printer- of IPP-integratie (elk merk)',
    ed_name: 'Naam',
    ed_name_helper: 'Leeg laten om de apparaatnaam te gebruiken',
    ed_show_image: 'Afbeelding van de printer',
    ed_show_inks: 'Inktniveaus',
    ed_show_alerts: 'Meldingen',
    ed_show_stats: 'Paginateller',
    ed_show_expired: 'Melding bij verlopen garantie',
    ed_low_threshold: 'Drempel voor laag inktniveau (%)',
    ed_admin_url: 'Beheerpagina (URL)',
    ed_admin_url_helper: 'Wordt geopend bij een klik op de printer — leeg laten voor het gedetecteerde adres',
    open_admin: 'Beheerpagina van de printer openen',
    ed_image: 'Eigen afbeelding (URL)',
    ed_image_helper: 'Bijv. /local/printer.png — vervangt de illustratie',
    ed_picture: 'Illustratie',
    ed_picture_helper: 'Automatisch: tekening volgens merk en productlijn (HP, Brother, Epson, Canon), anders een algemene printer',
    pic_auto: 'Automatisch',
    pic_officejet: 'HP OfficeJet / PageWide (all-in-one)',
    pic_laserjet: 'HP LaserJet (laserprinter)',
    pic_deskjet: 'HP DeskJet / ENVY (compact)',
    pic_smart_tank: 'HP Smart Tank (inkttanks)',
    pic_generic: 'Algemene printer (IPP)',
    pic_brother_laser: 'Brother HL / DCP-L / MFC-L',
    pic_brother_inkjet: 'Brother MFC-J / DCP-J',
    pic_ecotank: 'Epson EcoTank',
    pic_epson_inkjet: 'Epson Expression / WorkForce',
    pic_pixma: 'Canon PIXMA / MAXIFY',
    pic_megatank: 'Canon MegaTank (PIXMA G)',
    pic_canon_laser: 'Canon i-SENSYS / imageCLASS',
    ed_language: 'Taal',
    ed_language_helper: 'Leeg laten om de taal van Home Assistant te volgen',
    ed_entities: 'Entiteiten (geavanceerd)',
    ed_entities_helper: 'Gedetecteerd vanuit het apparaat; alleen invullen om een entiteit af te dwingen',
    en_status: 'Status',
    en_ipp: 'IPP-sensor (meldingen voor papier, klep…)',
    en_total_pages: 'Totaal aantal pagina\'s',
    en_eprint: 'ePrint-status',
    en_eprint_registration: 'ePrint-registratie',
    ed_show_eprint: 'ePrint-status',
    ep_on: 'ePrint aan',
    ep_off: 'ePrint uit',
    ep_unregistered: 'ePrint niet geregistreerd',
    ed_zoom: 'Detailknop',
    ed_zoom_helper: 'Rechtsboven: toont de volledige kaart, een klik ergens anders gaat terug naar de compacte weergave',
    zoom_in: 'Volledige kaart tonen',
    zoom_out: 'Terug naar de compacte weergave',
  },
  pt: {
    printer: 'Impressora',
    st_ready: 'Pronta',
    st_inpowersave: 'Em suspensão',
    st_processing: 'A imprimir',
    st_scanprocessing: 'A digitalizar',
    st_copying: 'A copiar',
    st_canceljob: 'A cancelar o trabalho',
    st_stopped: 'Parada',
    st_offline: 'Sem ligação',
    st_unknown: 'Estado desconhecido',
    offline_text: 'A impressora está desligada ou inacessível.',
    last_seen: 'Último contacto {t}',
    inks: 'Níveis de tinta',
    alerts: 'Alertas',
    no_alerts: 'Sem alertas',
    no_device: 'Nenhuma impressora encontrada',
    toner: 'Níveis de toner',
    pages: '{n} páginas impressas',
    pages_left: '≈ {n} páginas',
    c_black: 'Preto',
    c_cyan: 'Ciano',
    c_magenta: 'Magenta',
    c_yellow: 'Amarelo',
    c_tricolor: 'Tricolor',
    c_ink: 'Tinta',
    printhead: 'Cabeça de impressão',
    al_low: 'Pouca tinta: {c} ({p} %)',
    al_empty: 'Tinta quase esgotada: {c} ({p} %)',
    al_cartridge: 'Tinteiro ({c}): {s}',
    al_printhead: 'Cabeça de impressão: {s}',
    al_expired: 'Garantia do tinteiro ({c}) expirada',
    al_stopped: 'A impressora está parada',
    cs_missing: 'em falta',
    cs_empty: 'sem tinta',
    cs_used: 'já utilizado',
    cs_counterfeit: 'contrafeito',
    cs_nongenuine: 'não original HP',
    cs_incompatible: 'incompatível',
    cs_damaged: 'com danos',
    cs_problem: 'problema detetado',
    // The printhead (cabeça) is feminine: its own forms, where they differ from the cartridge ones.
    ph_used: 'já utilizada',
    ph_counterfeit: 'contrafeita',
    ipp_media_empty: 'Tabuleiro de papel vazio',
    ipp_media_low: 'Pouco papel',
    ipp_media_jam: 'Papel encravado',
    ipp_door_open: 'Porta aberta',
    ipp_cover_open: 'Tampa aberta',
    ipp_input_tray_missing: 'Tabuleiro de papel em falta',
    ipp_output_area_full: 'Tabuleiro de saída cheio',
    ipp_marker_supply_empty: 'Tinteiro vazio',
    ipp_media_needed: 'Coloque papel',
    ipp_toner_empty: 'Toner vazio',
    ipp_marker_supply_missing: 'Tinteiro em falta',
    ipp_offline: 'Impressora sem ligação',
    ed_device: 'Impressora',
    ed_device_helper: 'Dispositivo da integração HP Printer ou IPP (qualquer marca)',
    ed_name: 'Nome',
    ed_name_helper: 'Deixar vazio para usar o nome do dispositivo',
    ed_show_image: 'Imagem da impressora',
    ed_show_inks: 'Níveis de tinta',
    ed_show_alerts: 'Alertas',
    ed_show_stats: 'Contador de páginas',
    ed_show_expired: 'Alerta de garantia expirada',
    ed_low_threshold: 'Limiar de tinta baixa (%)',
    ed_admin_url: 'Página de administração (URL)',
    ed_admin_url_helper: 'Aberta ao clicar na impressora — deixar vazio para o endereço detetado',
    open_admin: 'Abrir a página de administração da impressora',
    ed_image: 'Imagem personalizada (URL)',
    ed_image_helper: 'Ex.: /local/printer.png — substitui a ilustração',
    ed_picture: 'Ilustração',
    ed_picture_helper: 'Automática: desenho conforme a marca e a gama (HP, Brother, Epson, Canon), caso contrário uma impressora genérica',
    pic_auto: 'Automática',
    pic_officejet: 'HP OfficeJet / PageWide (multifunções)',
    pic_laserjet: 'HP LaserJet (laser)',
    pic_deskjet: 'HP DeskJet / ENVY (compacta)',
    pic_smart_tank: 'HP Smart Tank (depósitos de tinta)',
    pic_generic: 'Impressora genérica (IPP)',
    pic_brother_laser: 'Brother HL / DCP-L / MFC-L',
    pic_brother_inkjet: 'Brother MFC-J / DCP-J',
    pic_ecotank: 'Epson EcoTank',
    pic_epson_inkjet: 'Epson Expression / WorkForce',
    pic_pixma: 'Canon PIXMA / MAXIFY',
    pic_megatank: 'Canon MegaTank (PIXMA G)',
    pic_canon_laser: 'Canon i-SENSYS / imageCLASS',
    ed_language: 'Idioma',
    ed_language_helper: 'Deixar vazio para seguir o idioma do Home Assistant',
    ed_entities: 'Entidades (avançado)',
    ed_entities_helper: 'Detetadas a partir do dispositivo; preencher apenas para forçar uma entidade',
    en_status: 'Estado',
    en_ipp: 'Sensor IPP (alertas de papel, tampa…)',
    en_total_pages: 'Total de páginas',
    en_eprint: 'Estado do ePrint',
    en_eprint_registration: 'Registo do ePrint',
    ed_show_eprint: 'Estado do ePrint',
    ep_on: 'ePrint ativado',
    ep_off: 'ePrint desativado',
    ep_unregistered: 'ePrint não registado',
    ed_zoom: 'Botão de detalhe',
    ed_zoom_helper: 'Canto superior direito: mostra o cartão completo; um clique noutro sítio volta à vista compacta',
    zoom_in: 'Mostrar o cartão completo',
    zoom_out: 'Voltar à vista compacta',
  },
  pl: {
    printer: 'Drukarka',
    st_ready: 'Gotowa',
    st_inpowersave: 'Uśpiona',
    st_processing: 'Drukowanie',
    st_scanprocessing: 'Skanowanie',
    st_copying: 'Kopiowanie',
    st_canceljob: 'Anulowanie zadania',
    st_stopped: 'Zatrzymana',
    st_offline: 'Offline',
    st_unknown: 'Nieznany stan',
    offline_text: 'Drukarka jest wyłączona lub nieosiągalna.',
    last_seen: 'Ostatni kontakt {t}',
    inks: 'Poziomy tuszu',
    alerts: 'Alerty',
    no_alerts: 'Brak alertów',
    no_device: 'Nie znaleziono drukarki',
    toner: 'Poziomy tonera',
    pages: 'Wydrukowane strony: {n}',
    pages_left: '≈ {n} str.',
    c_black: 'Czarny',
    c_cyan: 'Cyjan',
    c_magenta: 'Magenta',
    c_yellow: 'Żółty',
    c_tricolor: 'Trójkolorowy',
    c_ink: 'Tusz',
    printhead: 'Głowica drukująca',
    al_low: 'Niski poziom tuszu: {c} ({p} %)',
    al_empty: 'Tusz prawie wyczerpany: {c} ({p} %)',
    al_cartridge: 'Wkład ({c}): {s}',
    al_printhead: 'Głowica drukująca: {s}',
    al_expired: 'Gwarancja wkładu ({c}) wygasła',
    al_stopped: 'Drukarka jest zatrzymana',
    cs_missing: 'brak',
    cs_empty: 'brak tuszu',
    cs_used: 'już używany',
    cs_counterfeit: 'podróbka',
    cs_nongenuine: 'nieoryginalny HP',
    cs_incompatible: 'niezgodność',
    cs_damaged: 'uszkodzenie',
    cs_problem: 'wykryto problem',
    // The printhead (głowica) is feminine: its own forms, where they differ from the cartridge ones.
    ph_used: 'już używana',
    ph_nongenuine: 'nieoryginalna HP',
    ipp_media_empty: 'Podajnik papieru pusty',
    ipp_media_low: 'Kończy się papier',
    ipp_media_jam: 'Zacięcie papieru',
    ipp_door_open: 'Otwarte drzwiczki',
    ipp_cover_open: 'Otwarta pokrywa',
    ipp_input_tray_missing: 'Brak podajnika papieru',
    ipp_output_area_full: 'Odbiornik papieru pełny',
    ipp_marker_supply_empty: 'Pusty wkład',
    ipp_media_needed: 'Włóż papier',
    ipp_toner_empty: 'Pusty toner',
    ipp_marker_supply_missing: 'Brak wkładu',
    ipp_offline: 'Drukarka offline',
    ed_device: 'Drukarka',
    ed_device_helper: 'Urządzenie z integracji HP Printer lub IPP (dowolna marka)',
    ed_name: 'Nazwa',
    ed_name_helper: 'Pozostaw puste, aby użyć nazwy urządzenia',
    ed_show_image: 'Obraz drukarki',
    ed_show_inks: 'Poziomy tuszu',
    ed_show_alerts: 'Alerty',
    ed_show_stats: 'Licznik stron',
    ed_show_expired: 'Alert o wygasłej gwarancji',
    ed_low_threshold: 'Próg niskiego poziomu tuszu (%)',
    ed_admin_url: 'Strona administracyjna (URL)',
    ed_admin_url_helper: 'Otwierana po kliknięciu drukarki — pozostaw puste, aby użyć wykrytego adresu',
    open_admin: 'Otwórz stronę administracyjną drukarki',
    ed_image: 'Własny obraz (URL)',
    ed_image_helper: 'Np. /local/printer.png — zastępuje ilustrację',
    ed_picture: 'Ilustracja',
    ed_picture_helper: 'Automatycznie: rysunek według marki i serii (HP, Brother, Epson, Canon), w przeciwnym razie drukarka ogólna',
    pic_auto: 'Automatycznie',
    pic_officejet: 'HP OfficeJet / PageWide (urządzenie wielofunkcyjne)',
    pic_laserjet: 'HP LaserJet (laserowa)',
    pic_deskjet: 'HP DeskJet / ENVY (kompaktowa)',
    pic_smart_tank: 'HP Smart Tank (zbiorniki tuszu)',
    pic_generic: 'Drukarka ogólna (IPP)',
    pic_brother_laser: 'Brother HL / DCP-L / MFC-L',
    pic_brother_inkjet: 'Brother MFC-J / DCP-J',
    pic_ecotank: 'Epson EcoTank',
    pic_epson_inkjet: 'Epson Expression / WorkForce',
    pic_pixma: 'Canon PIXMA / MAXIFY',
    pic_megatank: 'Canon MegaTank (PIXMA G)',
    pic_canon_laser: 'Canon i-SENSYS / imageCLASS',
    ed_language: 'Język',
    ed_language_helper: 'Pozostaw puste, aby używać języka Home Assistant',
    ed_entities: 'Encje (zaawansowane)',
    ed_entities_helper: 'Wykrywane z urządzenia; ustaw je tylko, aby wymusić encję',
    en_status: 'Status',
    en_ipp: 'Czujnik IPP (alerty papieru, pokrywy…)',
    en_total_pages: 'Łączna liczba stron',
    en_eprint: 'Status ePrint',
    en_eprint_registration: 'Rejestracja ePrint',
    ed_show_eprint: 'Status ePrint',
    ep_on: 'ePrint włączony',
    ep_off: 'ePrint wyłączony',
    ep_unregistered: 'ePrint niezarejestrowany',
    ed_zoom: 'Przycisk szczegółów',
    ed_zoom_helper: 'W prawym górnym rogu: pokazuje pełną kartę, kliknięcie w innym miejscu przywraca widok kompaktowy',
    zoom_in: 'Pokaż pełną kartę',
    zoom_out: 'Wróć do widoku kompaktowego',
  },
};

// Full code when the dictionary has it (sr-Latn), else the part before the dash (fr-FR -> fr, pt-BR -> pt), else en.
function hpLang(language) {
  var l = String(language || 'en');
  if (HpI18n[l]) return l;
  l = l.split('-')[0];
  return HpI18n[l] ? l : 'en';
}

// Locale for Intl and toLocaleString: Home Assistant's full locale when it resolves to the card's language
// (pt-BR, de-CH…), else the card's language (the `language` option wins). HA's plain `pt` is European
// Portuguese, as is the card's dictionary, so it is passed as pt-PT (Intl reads `pt` as Brazilian).
function hpLocale(lang, hass) {
  var full = hass && (hass.locale?.language || hass.language);
  var loc = full && hpLang(full) === lang ? String(full) : lang;
  return loc === 'pt' ? 'pt-PT' : loc;
}

function hpT(lang, key) {
  var strings = HpI18n[lang] || HpI18n.en;
  return strings[key] || HpI18n.en[key] || key;
}

function hpEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function hpCap(s) {
  var t = String(s);
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function hpFill(str, vars) {
  return String(str).replace(/\{(\w+)\}/g, (m, k) => vars[k] != null ? vars[k] : m);
}

// ── Illustrations ────────────────────────────────────────────────────────────
// Drawn pictures (160 × 120): one per HP range and a generic printer for the other brands (IPP).
// Their `.screen` (control panel) lights up in the status color.
var HP_ART_DEFS = '<defs>' +
  '<linearGradient id="pc-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f5f7f9"/><stop offset="1" stop-color="#cdd3da"/></linearGradient>' +
  '<linearGradient id="pc-dark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#525965"/><stop offset="1" stop-color="#2a2e35"/></linearGradient>' +
  '<linearGradient id="pc-paper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e6e9ee"/></linearGradient>' +
  '</defs><ellipse cx="80" cy="111" rx="64" ry="5" fill="#000" opacity="0.13"/>';

var HP_ART = {
  generic:
    '<rect x="42" y="6" width="76" height="40" rx="2" fill="url(#pc-paper)" stroke="#c3c9d1"/>' +
    '<path d="M52 16h56M52 23h56M52 30h38" stroke="#c9ced6" stroke-width="2.5" stroke-linecap="round"/>' +
    '<rect x="14" y="34" width="132" height="58" rx="14" fill="url(#pc-body)" stroke="#b5bcc6"/>' +
    '<rect x="20" y="37" width="120" height="8" rx="4" fill="#fff" opacity="0.6"/>' +
    '<rect x="100" y="50" width="34" height="14" rx="4" fill="#23272e"/><rect class="screen" x="103" y="53" width="28" height="8" rx="2"/>' +
    '<circle cx="28" cy="57" r="3.5" fill="#8a929c"/>' +
    '<rect x="28" y="74" width="104" height="8" rx="4" fill="url(#pc-dark)"/>' +
    '<path d="M36 78h88l-6 28H42z" fill="url(#pc-paper)" stroke="#c3c9d1"/>',
  officejet:
    '<rect x="62" y="4" width="56" height="14" rx="1" fill="url(#pc-paper)" stroke="#c3c9d1"/>' +
    '<path d="M38 28L50 12H128L138 28z" fill="url(#pc-dark)"/>' +
    '<rect x="16" y="26" width="128" height="16" rx="5" fill="url(#pc-dark)"/>' +
    '<rect x="16" y="40" width="128" height="62" rx="8" fill="url(#pc-body)" stroke="#b5bcc6"/>' +
    '<rect x="26" y="49" width="38" height="18" rx="3" fill="#23272e"/><rect class="screen" x="29" y="52" width="32" height="12" rx="2"/>' +
    '<rect x="36" y="78" width="88" height="7" rx="3.5" fill="url(#pc-dark)"/>' +
    '<path d="M44 82h72l5 15H39z" fill="url(#pc-paper)" stroke="#c3c9d1"/>' +
    '<path d="M17 96h126" stroke="#aab2bc"/>',
  laserjet:
    '<rect x="22" y="12" width="116" height="94" rx="8" fill="url(#pc-body)" stroke="#b5bcc6"/>' +
    '<path d="M22 20a8 8 0 0 1 8-8h100a8 8 0 0 1 8 8v14H22z" fill="url(#pc-dark)"/>' +
    '<path d="M38 18h84l-6 11H44z" fill="#16191d"/><rect x="50" y="22" width="60" height="5" rx="1" fill="url(#pc-paper)"/>' +
    '<rect x="30" y="42" width="42" height="18" rx="4" fill="#23272e"/><rect class="screen" x="33" y="45" width="36" height="12" rx="2"/>' +
    '<circle cx="126" cy="51" r="3.5" fill="#8a929c"/>' +
    '<path d="M23 72h114M23 84h114" stroke="#aab2bc"/>' +
    '<rect x="64" y="92" width="32" height="5" rx="2.5" fill="#8a929c"/>',
  deskjet:
    '<path d="M46 6h68l4 48H42z" fill="url(#pc-paper)" stroke="#c3c9d1"/>' +
    '<rect x="14" y="48" width="132" height="46" rx="16" fill="url(#pc-body)" stroke="#b5bcc6"/>' +
    '<rect x="22" y="51" width="116" height="8" rx="4" fill="#fff" opacity="0.6"/>' +
    '<rect x="102" y="62" width="30" height="8" rx="4" fill="#23272e"/><rect class="screen" x="104" y="64" width="26" height="4" rx="2"/>' +
    '<rect x="34" y="76" width="92" height="7" rx="3.5" fill="url(#pc-dark)"/>' +
    '<path d="M42 80h76l8 22H34z" fill="url(#pc-paper)" stroke="#c3c9d1"/>',
  smart_tank:
    '<rect x="16" y="24" width="128" height="16" rx="5" fill="url(#pc-dark)"/>' +
    '<rect x="16" y="38" width="128" height="64" rx="8" fill="url(#pc-body)" stroke="#b5bcc6"/>' +
    '<rect x="22" y="46" width="30" height="48" rx="4" fill="#dde1e6" stroke="#b5bcc6"/>' +
    '<rect x="25" y="50" width="5" height="40" rx="1.5" fill="#fff"/><rect x="25" y="62" width="5" height="28" rx="1.5" fill="#2b2f36"/>' +
    '<rect x="32" y="50" width="5" height="40" rx="1.5" fill="#fff"/><rect x="32" y="66" width="5" height="24" rx="1.5" fill="#00a6d6"/>' +
    '<rect x="39" y="50" width="5" height="40" rx="1.5" fill="#fff"/><rect x="39" y="58" width="5" height="32" rx="1.5" fill="#d6197c"/>' +
    '<rect x="46" y="50" width="4" height="40" rx="1.5" fill="#fff"/><rect x="46" y="70" width="4" height="20" rx="1.5" fill="#f5c400"/>' +
    '<rect x="98" y="46" width="38" height="14" rx="4" fill="#23272e"/><rect class="screen" x="101" y="49" width="32" height="8" rx="2"/>' +
    '<rect x="60" y="76" width="72" height="7" rx="3.5" fill="url(#pc-dark)"/>' +
    '<path d="M66 80h60l4 16H62z" fill="url(#pc-paper)" stroke="#c3c9d1"/>',
  // Brother: compact mono laser (HL / DCP-L / MFC-L) and inkjet all-in-one with a dark scanner lid (MFC-J / DCP-J).
  brother_laser:
    '<rect x="24" y="16" width="112" height="88" rx="6" fill="url(#pc-body)" stroke="#b5bcc6"/>' +
    '<path d="M24 22a6 6 0 0 1 6-6h100a6 6 0 0 1 6 6v18H24z" fill="url(#pc-dark)"/>' +
    '<path d="M40 22h64l-4 12H44z" fill="#16191d"/><rect x="50" y="25" width="44" height="4" rx="1" fill="url(#pc-paper)"/>' +
    '<rect x="110" y="24" width="20" height="10" rx="3" fill="#23272e"/><rect class="screen" x="112" y="26" width="16" height="6" rx="1.5"/>' +
    '<path d="M25 58h110" stroke="#aab2bc"/><rect x="30" y="66" width="100" height="26" rx="3" fill="#e9ecf0" stroke="#c3c9d1"/>' +
    '<rect x="66" y="76" width="28" height="4" rx="2" fill="#8a929c"/>',
  brother_inkjet:
    '<rect x="18" y="20" width="124" height="18" rx="5" fill="url(#pc-dark)"/>' +
    '<rect x="18" y="36" width="124" height="66" rx="8" fill="url(#pc-body)" stroke="#b5bcc6"/>' +
    '<path d="M22 42h40l-4 16H26z" fill="#23272e"/><rect class="screen" x="28" y="45" width="28" height="10" rx="2"/>' +
    '<rect x="34" y="72" width="92" height="7" rx="3.5" fill="url(#pc-dark)"/>' +
    '<path d="M42 76h76l4 18H38z" fill="url(#pc-paper)" stroke="#c3c9d1"/>' +
    '<path d="M19 96h122" stroke="#aab2bc"/>',
  // Epson: EcoTank with its ink tanks on the front right, and a compact dark Expression / WorkForce inkjet.
  ecotank:
    '<rect x="14" y="22" width="132" height="16" rx="5" fill="url(#pc-dark)"/>' +
    '<rect x="14" y="36" width="104" height="66" rx="7" fill="url(#pc-body)" stroke="#b5bcc6"/>' +
    '<rect x="116" y="36" width="30" height="66" rx="6" fill="#dde1e6" stroke="#b5bcc6"/>' +
    '<rect x="120" y="44" width="5" height="50" rx="1.5" fill="#fff"/><rect x="120" y="56" width="5" height="38" rx="1.5" fill="#2b2f36"/>' +
    '<rect x="126" y="44" width="5" height="50" rx="1.5" fill="#fff"/><rect x="126" y="62" width="5" height="32" rx="1.5" fill="#00a6d6"/>' +
    '<rect x="132" y="44" width="5" height="50" rx="1.5" fill="#fff"/><rect x="132" y="52" width="5" height="42" rx="1.5" fill="#d6197c"/>' +
    '<rect x="138" y="44" width="4" height="50" rx="1.5" fill="#fff"/><rect x="138" y="68" width="4" height="26" rx="1.5" fill="#f5c400"/>' +
    '<rect x="22" y="44" width="34" height="12" rx="3" fill="#23272e"/><rect class="screen" x="25" y="47" width="28" height="6" rx="1.5"/>' +
    '<rect x="26" y="74" width="80" height="7" rx="3.5" fill="url(#pc-dark)"/>' +
    '<path d="M32 78h68l4 18H28z" fill="url(#pc-paper)" stroke="#c3c9d1"/>',
  epson_inkjet:
    '<rect x="54" y="18" width="52" height="16" rx="1" fill="url(#pc-paper)" stroke="#c3c9d1"/>' +
    '<rect x="16" y="30" width="128" height="62" rx="9" fill="url(#pc-dark)"/>' +
    '<rect x="16" y="30" width="128" height="10" rx="5" fill="#626a76"/>' +
    '<path d="M24 48h44l-3 14H27z" fill="#16191d"/><rect class="screen" x="29" y="51" width="34" height="8" rx="2"/>' +
    '<circle cx="128" cy="55" r="3.5" fill="#8a929c"/>' +
    '<rect x="34" y="74" width="92" height="7" rx="3.5" fill="#16191d"/>' +
    '<path d="M42 78h76l6 26H36z" fill="url(#pc-paper)" stroke="#c3c9d1"/>',
  // Canon: low PIXMA / MAXIFY inkjet, MegaTank (PIXMA G) with its front tanks, and an i-SENSYS / imageCLASS laser.
  pixma:
    '<rect x="14" y="40" width="132" height="54" rx="12" fill="url(#pc-dark)"/>' +
    '<rect x="20" y="43" width="120" height="7" rx="3.5" fill="#6b7380" opacity="0.7"/>' +
    '<rect x="100" y="56" width="32" height="12" rx="3" fill="#16191d"/><rect class="screen" x="103" y="59" width="26" height="6" rx="1.5"/>' +
    '<rect x="30" y="74" width="100" height="7" rx="3.5" fill="#16191d"/>' +
    '<path d="M38 78h84l8 24H30z" fill="url(#pc-paper)" stroke="#c3c9d1"/>',
  megatank:
    '<rect x="14" y="30" width="132" height="16" rx="5" fill="url(#pc-dark)"/>' +
    '<rect x="14" y="44" width="132" height="58" rx="8" fill="#3a4049"/>' +
    '<rect x="20" y="52" width="30" height="42" rx="4" fill="#5b636e"/>' +
    '<rect x="23" y="56" width="5" height="34" rx="1.5" fill="#cfd5dc"/><rect x="23" y="66" width="5" height="24" rx="1.5" fill="#1c1f24"/>' +
    '<rect x="30" y="56" width="5" height="34" rx="1.5" fill="#cfd5dc"/><rect x="30" y="70" width="5" height="20" rx="1.5" fill="#00a6d6"/>' +
    '<rect x="37" y="56" width="5" height="34" rx="1.5" fill="#cfd5dc"/><rect x="37" y="62" width="5" height="28" rx="1.5" fill="#d6197c"/>' +
    '<rect x="44" y="56" width="4" height="34" rx="1.5" fill="#cfd5dc"/><rect x="44" y="74" width="4" height="16" rx="1.5" fill="#f5c400"/>' +
    '<rect x="100" y="52" width="36" height="12" rx="3" fill="#16191d"/><rect class="screen" x="103" y="55" width="30" height="6" rx="1.5"/>' +
    '<rect x="62" y="76" width="72" height="7" rx="3.5" fill="#16191d"/>' +
    '<path d="M68 80h60l4 16H64z" fill="url(#pc-paper)" stroke="#c3c9d1"/>',
  canon_laser:
    '<rect x="22" y="14" width="116" height="92" rx="7" fill="url(#pc-body)" stroke="#b5bcc6"/>' +
    '<path d="M36 20h88l-8 16H44z" fill="url(#pc-dark)"/><rect x="54" y="24" width="52" height="5" rx="1" fill="url(#pc-paper)"/>' +
    '<rect x="30" y="44" width="26" height="14" rx="3" fill="#23272e"/><rect class="screen" x="33" y="47" width="20" height="8" rx="1.5"/>' +
    '<rect x="64" y="46" width="66" height="10" rx="5" fill="#e3e7ec"/>' +
    '<path d="M23 66h114" stroke="#aab2bc"/><rect x="28" y="72" width="104" height="28" rx="3" fill="#e9ecf0" stroke="#c3c9d1"/>' +
    '<rect x="64" y="84" width="32" height="4" rx="2" fill="#8a929c"/>',
};

var HP_PICTURES = ['auto', 'officejet', 'laserjet', 'deskjet', 'smart_tank', 'brother_laser', 'brother_inkjet', 'ecotank', 'epson_inkjet',
  'pixma', 'megatank', 'canon_laser', 'generic'];

function hpIsHpDevice(device) {
  var maker = String(device?.manufacturer || '').toLowerCase();
  var model = `${device?.model || ''} ${device?.name || ''}`.toLowerCase().trim();
  return /\bhp\b|hewlett/.test(maker) || /^hp\b/.test(model);
}

// Picture matching a device: the drawing of its HP range, or the generic printer for the other brands.
function hpPictureFor(device, kind) {
  var model = `${device?.model || ''} ${device?.name || ''}`.toLowerCase();
  var brand = hpBrandOf(device);
  if (brand === 'brother') return /\b(mfc|dcp)-?j|inkjet/.test(model) ? 'brother_inkjet' : 'brother_laser';
  if (brand === 'epson') return /ecotank|\b(et|l)-?\d{3,5}/.test(model) ? 'ecotank' : 'epson_inkjet';
  if (brand === 'canon') {
    if (/megatank|\bg\d{3,4}\b/.test(model)) return 'megatank';
    return /i-sensys|imageclass|imagerunner|\b(lbp|mf)\s?\d|laser/.test(model) ? 'canon_laser' : 'pixma';
  }
  if (kind !== 'hp' && brand !== 'hp') return 'generic';
  if (/laserjet|neverstop/.test(model)) return 'laserjet';
  if (/smart tank|ink tank/.test(model)) return 'smart_tank';
  if (/deskjet|envy|tango/.test(model)) return 'deskjet';
  return 'officejet';
}

// ── Status ───────────────────────────────────────────────────────────────────
var HP_STATE_COLORS = {
  ready: 'var(--success-color, #43a047)',
  // Overridable from a theme, like the other states which follow the HA status colors.
  inpowersave: 'var(--printer-card-sleep-color, #5c8fd6)',
  processing: 'var(--info-color, #039be5)',
  scanprocessing: 'var(--printer-card-scan-color, #8e24aa)',
  copying: 'var(--info-color, #039be5)',
  canceljob: 'var(--warning-color, #ffa600)',
  stopped: 'var(--error-color, #db4437)',
};

var HP_STATE_ICONS = {
  ready: 'mdi:printer-check',
  inpowersave: 'mdi:power-sleep',
  processing: 'mdi:printer',
  scanprocessing: 'mdi:scanner',
  copying: 'mdi:content-copy',
  canceljob: 'mdi:cancel',
  stopped: 'mdi:printer-alert',
  offline: 'mdi:printer-off',
};

// States reported by the IPP integration, mapped onto the HP Printer ones.
var HP_IPP_STATES = { idle: 'ready', printing: 'processing', stopped: 'stopped' };

// Brother integration (core, SNMP): the "Printer status" sensor (idle / printing / warmup / other), else the raw
// "Status" text the printer reports, in its own language ("ready", "sleep", "printing", "druk"…).
var HP_BROTHER_STATES = { idle: 'ready', printing: 'processing', warmup: 'processing', other: 'ready' };
function hpBrotherState(v) {
  if (HP_BROTHER_STATES[v]) return HP_BROTHER_STATES[v];
  var t = String(v).toLowerCase();
  if (/print|druk|impr|stampa|drukowa|печат|štamp/.test(t)) return 'processing';
  if (/sleep|veille|ruhe|reposo|riposo|slaap|uśpi|спава|spava|deep/.test(t)) return 'inpowersave';
  return 'ready';
}
// Status entity of a Brother printer (the normalized one first) and its ink / toner sensors, by translation key.
function hpIsBrotherStatus(e) {
  return e?.platform === 'brother' && (e.translation_key === 'printer_status' || e.translation_key === 'status');
}
function hpBrotherInks(list) {
  return list.map((e) => {
    var m = /^(black|cyan|magenta|yellow)_(toner|ink)_remaining$/.exec(e.platform === 'brother' ? e.translation_key || '' : '');
    return m && { name: e.entity_id, color: m[1], level: e.entity_id, toner: m[2] === 'toner' };
  }).filter(Boolean).sort((a, b) => HP_INK_ORDER[a.color] - HP_INK_ORDER[b.color]);
}

var HP_BUSY = ['processing', 'scanprocessing', 'copying'];

// ── Inks ─────────────────────────────────────────────────────────────────────
var HP_INK_COLORS = {
  cyan: '#00a6d6',
  magenta: '#d6197c',
  yellow: '#f5c400',
  // Follows the theme text color: near black on light themes, light on dark ones.
  black: 'color-mix(in srgb, var(--primary-text-color, #212121) 88%, transparent)',
  tricolor: 'linear-gradient(90deg, #00a6d6 0 33%, #d6197c 33% 66%, #f5c400 66%)',
  ink: '#9e9e9e',
};

// Display order of the cartridges, when the printer does not report their station.
var HP_INK_ORDER = { black: 0, cyan: 1, magenta: 2, yellow: 3, tricolor: 4, ink: 5 };

function hpInkColor(text) {
  var t = String(text || '').toLowerCase().replace(/[^a-z]/g, '');
  if (/cyanmagentayellow|tricolor|tricolour|couleur/.test(t)) return 'tricolor';
  if (/cyan/.test(t)) return 'cyan';
  if (/magenta/.test(t)) return 'magenta';
  if (/yellow|jaune/.test(t)) return 'yellow';
  if (/black|noir|photoblack/.test(t)) return 'black';
  return null;
}

// Cartridge states that are fine: ok, newGenuineHP, usedGenuineHP, genuineHP…
function hpCartridgeOk(state) {
  var s = String(state || '').toLowerCase();
  return !s || s === 'ok' || s === 'unknown' || s.indexOf('genuine') >= 0 && s.indexOf('non') < 0;
}

function hpCartridgeProblem(state) {
  var s = String(state || '').toLowerCase();
  if (/missing|absent/.test(s)) return 'cs_missing';
  if (/empty|depleted|verylow/.test(s)) return 'cs_empty';
  if (/counterfeit/.test(s)) return 'cs_counterfeit';
  if (/nongenuine|nonhp|non_hp|refill/.test(s)) return 'cs_nongenuine';
  if (/incompatible|wrong/.test(s)) return 'cs_incompatible';
  if (/damage|fail|error/.test(s)) return 'cs_damaged';
  if (/used/.test(s)) return 'cs_used';
  return 'cs_problem';
}

// ── Discovery ────────────────────────────────────────────────────────────────
function _hpState(hass, id) { return id ? hass.states[id] : undefined; }

function hpIsHpStatus(s) {
  var o = (s?.attributes.options) || [];
  return o.indexOf('inpowersave') >= 0 || (o.indexOf('ready') >= 0 && o.indexOf('scanprocessing') >= 0);
}

function hpIsIppStatus(s) {
  var a = (s?.attributes) || {};
  var o = a.options || [];
  return a.uri_supported !== undefined || (o.indexOf('idle') >= 0 && o.indexOf('printing') >= 0 && o.indexOf('stopped') >= 0);
}

// Registry entries grouped by device, built once per `hass.entities` object (it only changes with the registry).
var hpRegistryIndex = new WeakMap();
function hpRegistryByDevice(reg) {
  var index = hpRegistryIndex.get(reg);
  if (!index) {
    index = new Map();
    Object.values(reg).forEach((e) => {
      if (!e.device_id || e.hidden) return;
      if (!index.has(e.device_id)) index.set(e.device_id, []);
      index.get(e.device_id).push(e);
    });
    hpRegistryIndex.set(reg, index);
  }
  return index;
}

function hpEntitiesOf(hass, deviceIds) {
  if (!hass?.entities) return [];
  var index = hpRegistryByDevice(hass.entities);
  var out = [];
  deviceIds.forEach((id) => { (index.get(id) || []).forEach((e) => { if (hass.states[e.entity_id]) out.push(e); }); });
  return out;
}

function hpDeviceName(hass, id) {
  var d = hass?.devices?.[id];
  return d ? String(d.name_by_user || d.name || '').trim() : '';
}

// Printers: devices carrying an HP Printer status sensor or an IPP printer sensor.
// Sensors attached to a device, listed once per `hass.entities` object; states are read on each call.
var hpSensorIndex = new WeakMap();
function hpDeviceSensors(reg) {
  var list = hpSensorIndex.get(reg);
  if (!list) {
    list = Object.values(reg).filter((e) => e.device_id && e.entity_id.indexOf('sensor.') === 0);
    hpSensorIndex.set(reg, list);
  }
  return list;
}

function hpFindPrinters(hass) {
  if (!hass?.entities) return [];
  var out = [];
  hpDeviceSensors(hass.entities).forEach((e) => {
    var s = hass.states[e.entity_id];
    var kind = hpIsHpStatus(s) ? 'hp' : hpIsBrotherStatus(e) ? 'brother' : (hpIsIppStatus(s) ? 'ipp' : null);
    if (kind && !out.some((p) => p.id === e.device_id)) out.push({ id: e.device_id, kind: kind });
  });
  // HP Printer, then Brother, first: they carry richer data than IPP.
  var rank = { hp: 0, brother: 1, ipp: 2 };
  return out.sort((a, b) => rank[a.kind] - rank[b.kind]);
}

// The HP Printer integration splits a printer into one device per part
// (cartridges, printhead, printer counters…) linked to the main one.
function hpSubDevices(hass, mainId) {
  if (!hass?.devices) return [];
  var main = hass.devices[mainId];
  var mainName = hpDeviceName(hass, mainId);
  return Object.keys(hass.devices).filter((id) => {
    if (id === mainId) return false;
    var d = hass.devices[id];
    if (d.via_device_id === mainId) return true;
    // Name-prefix fallback: never absorb a device linked to another parent, nor another
    // printer ("OfficeJet 2" when the main one is "OfficeJet"). The cheap manufacturer / name
    // test comes first: the printer check scans every sensor, so it only runs on the few matches.
    if (d.via_device_id || !mainName || !main || d.manufacturer !== main.manufacturer) return false;
    if (String(d.name || '').indexOf(`${String(main.name || '')} `) !== 0) return false;
    return !hpIsPrinterDevice(hass, id);
  });
}

// A device carrying its own printer status sensor (HP Printer or IPP) is a printer, not a sub-device.
function hpIsPrinterDevice(hass, id) {
  if (!hass?.entities) return false;
  return hpDeviceSensors(hass.entities).some((e) => {
    if (e.device_id !== id) return false;
    var s = hass.states[e.entity_id];
    return hpIsHpStatus(s) || hpIsIppStatus(s);
  });
}

function hpUnit(s) { return s?.attributes.unit_of_measurement; }

function hpPick(list, hass, test) {
  var hit = list.find((e) => test(e.entity_id, hass.states[e.entity_id]));
  return hit ? hit.entity_id : undefined;
}

// Builds the cartridge list of a HP Printer device: one entry per consumable sub-device.
function hpHpInks(hass, subIds) {
  var inks = [];
  subIds.forEach((id) => {
    var list = hpEntitiesOf(hass, [id]);
    var level = hpPick(list, hass, (eid, s) => eid.indexOf('sensor.') === 0 && hpUnit(s) === '%');
    var typeId = hpPick(list, hass, (eid, s) => {
      var o = (s.attributes.options || []);
      return eid.indexOf('sensor.') === 0 && o.indexOf('printhead') >= 0 && o.indexOf('ink') >= 0;
    });
    var type = typeId ? hass.states[typeId].state : '';
    var status = hpPick(list, hass, (eid, s) => eid.indexOf('binary_sensor.') === 0 && s.attributes.state !== undefined && /(statut|status|state|etat)$/.test(eid));
    if (!level && type !== 'printhead' && !(status && /printhead|tete/i.test(status))) return;
    var name = hpDeviceName(hass, id);
    inks.push({
      device: id,
      name: name,
      printhead: type === 'printhead' || (!level && /printhead|tete/i.test(name)),
      color: hpInkColor(name) || hpInkColor(level) || 'ink',
      level: level,
      status: status,
      station: hpPick(list, hass, (eid) => /(_emplacement|_station|_slot)$/.test(eid)),
      expiry: hpPick(list, hass, (eid, s) => s.attributes.device_class === 'timestamp' && /(expiration|expiry|warranty|garantie)/.test(eid)),
      pages_left: hpPick(list, hass, (_eid, s) => hpUnit(s) === 'pages' && s.attributes.state_class === 'measurement'),
    });
  });
  return inks.sort((a, b) => {
    var sa = a.station ? Number(hass.states[a.station].state) : NaN;
    var sb = b.station ? Number(hass.states[b.station].state) : NaN;
    if (!Number.isNaN(sa) && !Number.isNaN(sb) && sa !== sb) return sa - sb;
    return (HP_INK_ORDER[a.color] ?? 9) - (HP_INK_ORDER[b.color] ?? 9);
  });
}

// IPP integration: one "<color> cartridge" sensor per marker, on the same device.
function hpIppInks(hass, list) {
  return list.filter((e) => {
    var s = hass.states[e.entity_id];
    return e.entity_id.indexOf('sensor.') === 0 && s.attributes.marker_type !== undefined;
  }).map((e) => {
    var s = hass.states[e.entity_id];
    return { name: s.attributes.friendly_name, color: hpInkColor(e.entity_id) || hpInkColor(s.attributes.friendly_name) || 'ink',
      level: e.entity_id, low: s.attributes.marker_low_level, toner: /toner/i.test(String(s.attributes.marker_type || '')) };
  }).sort((a, b) => HP_INK_ORDER[a.color] - HP_INK_ORDER[b.color]);
}

// IPP printer sensor matching a HP Printer device (same model), for paper/cover alerts.
// The candidates (sensors of another device of the same model) come from the registry and are cached
// with it; their states are checked on each call, so a sensor that shows up later is still found.
var hpModelIndex = new WeakMap();
function hpSensorsByModel(hass) {
  var cached = hpModelIndex.get(hass.entities);
  if (!cached || cached.devices !== hass.devices) {
    var byModel = new Map();
    hpDeviceSensors(hass.entities).forEach((e) => {
      var model = hass.devices[e.device_id]?.model;
      if (!model) return;
      if (!byModel.has(model)) byModel.set(model, []);
      byModel.get(model).push(e);
    });
    cached = { devices: hass.devices, byModel: byModel };
    hpModelIndex.set(hass.entities, cached);
  }
  return cached.byModel;
}

// Host part of a URL (http(s), ipp(s)…), lowercased, without the final dot of a fully qualified
// name (HP1234.local. → hp1234.local); '' when there is none.
function hpUrlHost(url) {
  var m = /^[a-z][a-z0-9+.-]*:\/\/(\[[^\]]+\]|[^/:?#]+)/i.exec(String(url || '').trim());
  return m ? m[1].toLowerCase().replace(/\.$/, '') : '';
}

// Hosts advertised by an IPP printer sensor (every uri_supported entry: IP address, mDNS name…)
// and by its device's configuration URL.
function hpIppHosts(hass, e) {
  var uris = hass.states[e.entity_id]?.attributes.uri_supported;
  uris = Array.isArray(uris) ? uris.slice() : String(uris || '').split(',');
  uris.push(hass.devices?.[e.device_id]?.configuration_url);
  var out = [];
  uris.forEach((u) => {
    var h = hpUrlHost(u);
    if (h && out.indexOf(h) < 0) out.push(h);
  });
  return out;
}

// Form of a host: 'v4' or 'v6' (in brackets) address, 'mdns' name (*.local), 'dns' name (other
// domain) or 'bare' name (no domain).
function hpHostForm(h) {
  if (/^\[.*\]$/.test(h)) return 'v6';
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(h)) return 'v4';
  if (h.indexOf('.') < 0) return 'bare';
  return /\.local$/.test(h) ? 'mdns' : 'dns';
}

// Two hosts can tell two printers apart only when written in the same form. A mDNS name and a DNS
// name are not comparable (HPABC123.local and officejet.lan can be the same printer); a name
// without domain is resolved through the DNS search domain, so it is compared with DNS names only
// (officejet and HPABC123.local can be the same printer).
function hpComparable(a, b) {
  var fa = hpHostForm(a);
  var fb = hpHostForm(b);
  if (fa === fb) return true;
  return (fa === 'bare' && fb === 'dns') || (fa === 'dns' && fb === 'bare');
}

// Same host: identical, or the same name with and without its domain (hp1234 / hp1234.local), or
// under the mDNS and a DNS domain (hp1234.local / hp1234.lan). Two DNS names must be identical
// (printer.office1.lan is not printer.office2.lan).
function hpSameHost(a, b) {
  if (a === b) return true;
  var fa = hpHostForm(a);
  var fb = hpHostForm(b);
  if (fa === 'v4' || fa === 'v6' || fb === 'v4' || fb === 'v6' || (fa === 'dns' && fb === 'dns')) return false;
  return a.split('.')[0] === b.split('.')[0];
}

// What the hosts say about an IPP sensor for the HP device's host: 'match' (a host is the same),
// 'mismatch' (hosts of the same form exist and all differ: another printer) or 'unknown' (a side
// has no host, or no host is comparable).
function hpHostVerdict(mainHost, hosts) {
  if (!mainHost || !hosts.length) return 'unknown';
  if (hosts.some((h) => hpSameHost(h, mainHost))) return 'match';
  return hosts.some((h) => hpComparable(h, mainHost)) ? 'mismatch' : 'unknown';
}

// Reference cases: test/ipp-pairing.test.mjs (every case must keep passing).
function hpFindIppSensor(hass, mainId) {
  var main = hass.devices?.[mainId];
  if (!main?.model || !hass.entities) return undefined;
  var sensors = hpSensorsByModel(hass).get(main.model) || [];
  var candidates = sensors.filter((e) => e.device_id !== mainId && hpIsIppStatus(hass.states[e.entity_id]));
  if (!candidates.length) return undefined;
  var mainHost = hpUrlHost(main.configuration_url);
  var hosts = candidates.map((e) => hpIppHosts(hass, e));
  var verdicts = hosts.map((h) => hpHostVerdict(mainHost, h));
  // A matching host always wins, whatever the order of the candidates.
  var hit = verdicts.indexOf('match');
  if (hit >= 0) return candidates[hit].entity_id;
  // This HP device has no host: a sensor whose host matches another device of the model (the other
  // HP device of identical printers, even with its status sensor missing) belongs to that device.
  // The single sensor left, if any, is this one's.
  if (!mainHost) {
    var own = candidates.map((e) => e.device_id);
    var others = sensors.map((e) => e.device_id).filter((id, i, a) => id !== mainId && own.indexOf(id) < 0 && a.indexOf(id) === i)
      .map((id) => hpUrlHost(hass.devices[id]?.configuration_url)).filter((h) => h);
    var left = candidates.filter((_e, i) => !others.some((h) => hpHostVerdict(h, hosts[i]) === 'match'));
    return left.length === 1 ? left[0].entity_id : undefined;
  }
  var printers = sensors.filter((e) => hpIsHpStatus(hass.states[e.entity_id]))
    .map((e) => e.device_id).filter((id, i, a) => a.indexOf(id) === i);
  // A single IPP sensor and a single HP Printer device of this model: paired unless hosts of the same
  // form differ (A may be followed by HP Printer only and B, of the same model, by IPP only).
  if (candidates.length === 1 && printers.length <= 1) return verdicts[0] === 'unknown' ? candidates[0].entity_id : undefined;
  // Identical printers: hosts of different forms cannot tell them apart; only a sensor without any
  // host is accepted, as before.
  var free = candidates.findIndex((_e, i) => !hosts[i].length);
  return free >= 0 ? candidates[free].entity_id : undefined;
}

// Printer web page: the device's configuration URL, else the host of the IPP sensor's URI.
function hpAdminUrl(hass, r) {
  var ids = [r.deviceId];
  var ippEnt = r.ipp && hass.entities?.[r.ipp];
  if (ippEnt?.device_id) ids.push(ippEnt.device_id);
  for (var i = 0; i < ids.length; i++) {
    var d = hass.devices?.[ids[i]];
    if (d?.configuration_url && /^https?:\/\//i.test(d.configuration_url)) return d.configuration_url;
  }
  var s = r.ipp && hass.states[r.ipp];
  var uris = s?.attributes.uri_supported;
  uris = Array.isArray(uris) ? uris : String(uris || '').split(',');
  for (var j = 0; j < uris.length; j++) {
    var m = /^ipps?:\/\/(\[[^\]]+\]|[^/:]+)/i.exec(String(uris[j]).trim());
    if (m) return `http://${m[1]}`;
  }
  return '';
}

// Header icon: the tinted round printer of the project page on the showcase site, for every printer.
// Brand logo, as a badge on the header printer icon, embedded: HP (round mark), Brother, Epson and Canon (wordmarks,
// images/*.svg). Other brands get the icon alone.
var HP_BRAND_LOGOS = {
  hp: '<svg viewBox="0 0 1280 1280"><defs><clipPath id="hp-logo-clip"><circle cx="640" cy="640" r="640"/></clipPath></defs>' +
  '<circle cx="640" cy="640" r="640" fill="#024ad8"/><g clip-path="url(#hp-logo-clip)" fill="#fff">' +
  '<path d="M485-20H619L482 360H597Q645 360 670 393Q695 427 676 477L515 918H380L552 444H451L277 918H142L349 360Z"/>' +
  '<path fill-rule="evenodd" d="M819 358H1070Q1118 358 1143 391Q1168 424 1151 470L1009 866Q1000 890 977 905Q956 918 932 918H752L614 1300H485ZM924 441H1026L883 832H781Z"/></g></svg>',
  brother: '<svg fill="#005cab" fill-rule="evenodd" viewBox="0 0 2.65 0.64"><path d="M2.565.138c-.146 0-.224.082-.227.188a.23.23 0 0 0-.233-.19.23.23 0 0 0-.23.188.186.186 0 0 0-.183-.188.16.16 0 0 0-.115.047V.035h-.11v.33l-.001.033C1.459.466 1.413.5 1.363.5c-.052 0-.1-.024-.1-.102L1.26.37V.247h.171V.143h-.17V.035H1.15v.29A.235.235 0 0 0 .738.222V.138H.725C.582.138.505.218.5.32A.22.22 0 0 0 .282.138a.2.2 0 0 0-.137.056v-.16H.038V.37C.04.5.13.604.27.604.39.604.477.526.5.422v.171h.11V.35C.613.282.655.243.723.242a.235.235 0 1 0 .428.172c0 .114.09.19.2.19.046 0 .086-.02.117-.052v.04h.11V.346c.003-.075.047-.107.095-.107s.09.032.09.106l.001.018v.23h.112V.42c.02.112.116.185.23.185a.216.216 0 0 0 .221-.169h-.108a.12.12 0 0 1-.113.078c-.06 0-.111-.04-.124-.108h.357v.188h.11V.38L2.45.35c.002-.067.046-.106.116-.106h.012V.138zM.269.498A.127.127 0 0 1 .141.37C.141.3.197.242.27.242S.398.298.398.37a.127.127 0 0 1-.129.128m.65 0A.127.127 0 0 1 .793.37C.792.3.847.242.92.242s.128.056.128.128A.127.127 0 0 1 .92.498m1.067-.18a.125.125 0 0 1 .119-.09c.07 0 .11.056.119.09zm.539.227c0 .03.025.055.055.055a.055.055 0 1 0 0-.11.055.055 0 0 0-.055.055m.007 0a.048.048 0 1 1 .096 0 .048.048 0 0 1-.096 0" /><path d="M2.565.52h.022q.013 0 .012.011 0 .012-.012.012h-.022zm0 .03h.022q.01 0 .01.013V.57L2.6.578h.01V.577L2.606.569V.56Q2.604.55 2.598.546q.01-.003.01-.017 0-.016-.02-.018h-.032v.066h.009z" /></svg>',
  epson: '<svg fill="#003f98" viewBox="0 0 300 73.749"><path d="M207.281 60.68c-12.828 0-17.772-11.808-17.772-23.808s4.944-23.8 17.772-23.8c12.815 0 17.772 11.8 17.772 23.8S220.096 60.68 207.28 60.68m0-59.68c-20.2 0-31.864 15.135-31.864 35.872 0 20.744 11.664 35.876 31.864 35.876 20.19 0 31.85-15.132 31.85-35.876C239.13 16.135 227.47 1 207.28 1M1 3.013h50.616v12.074H15.079v15.017H49.15v11.769H15.08v16.796h36.537v12.069H1zm83.472 35.338H71.725v-23.28h12.747c8.86 0 14.752 3.855 14.752 11.643S93.33 38.35 84.472 38.35m-26.82 32.384h14.073v-20.32h12.747c17.251 0 28.828-8.474 28.828-23.701s-11.577-23.7-28.828-23.7h-26.82zM258.905 3.013H244.45v67.725h13.803V43.305c0-7.508-.268-14.168-.523-20.058 1.627 3.39 6.57 13.577 8.85 17.404l17.965 30.087H299V3.013h-13.803V29.76c0 7.5.276 14.86.523 20.736-1.627-3.39-6.557-13.572-8.87-17.393zM129.289 48.33c0 9.101 7.572 12.639 15.624 12.639 5.257 0 13.793-1.525 13.793-8.515 0-7.383-10.429-8.778-20.492-11.457-10.552-2.793-20.715-6.751-20.715-19.3C117.5 7.706 130.732 1 143.092 1c14.27 0 27.396 6.228 27.396 22.034h-14.082c-.478-8.237-6.801-10.35-13.987-10.35-4.794 0-10.83 2.014-10.83 7.77 0 5.266 3.445 6.078 20.583 10.49 4.989 1.247 20.618 4.264 20.618 19.778 0 12.557-9.869 21.937-28.465 21.937-15.128 0-29.307-7.467-29.12-24.329z"/></svg>',
  canon: '<svg viewBox="0 0 118 25"><g fill="#C00"><path d="M19.56 22.251c-5.464 0-9.895-4.4-9.895-9.83s4.43-9.83 9.896-9.83c1.927 0 3.724.547 5.245 1.493L19.56 12.42l9.874-5.663c-1.072-1.699-2.611-3.163-4.476-4.273C22.595 1.08 19.303.208 15.662.208c-5.196 0-9.752 1.872-12.294 4.68-1.88 2.076-3 4.691-3 7.533s1.12 5.457 3 7.533c2.548 2.815 7.036 4.68 12.144 4.68s9.595-1.867 12.146-4.68q.21-.231.405-.47l-.387-1.436a9.9 9.9 0 0 1-8.115 4.203m20.092-.596c-1.987 0-3.599-1.6-3.599-3.574s1.612-3.574 3.599-3.574 3.599 1.6 3.599 3.574-1.612 3.574-3.599 3.574m12.64 2.384L48.151 8.684a5.84 5.84 0 0 0-5.65-4.306c-.702 0-1.376.124-2 .35L31.58 7.952h9.177l1.568 5.815a8.7 8.7 0 0 0-5.67-2.092c-4.307 0-7.798 2.868-7.798 6.405s3.491 6.404 7.797 6.404a9.3 9.3 0 0 0 7.531-3.821l.91 3.375zM69.191 4.378c-.543 0-1.058.12-1.52.335l-5.726 2.652a3.59 3.59 0 0 0-3.55-2.987c-.543 0-1.058.12-1.52.335l-6.994 3.24h4.916v16.086h7.197V9.74c0-.987.806-1.787 1.8-1.787.993 0 1.799.8 1.799 1.787v14.3h7.196V7.953c0-1.974-1.61-3.575-3.598-3.575m45.132 0c-.543 0-1.058.12-1.52.335l-5.726 2.652a3.59 3.59 0 0 0-3.55-2.987c-.543 0-1.058.12-1.52.335l-6.994 3.24h4.916v16.086h7.197V9.74c0-.987.806-1.787 1.8-1.787.993 0 1.799.8 1.799 1.787v14.3h7.197V7.953c0-1.974-1.61-3.575-3.599-3.575"/><path d="M86.41 7.455a2.25 2.25 0 0 0-2.754-1.58 2.23 2.23 0 0 0-1.59 2.736l3.493 12.948a2.25 2.25 0 0 0 2.754 1.58 2.23 2.23 0 0 0 1.59-2.737zm9.77 7.052c0 5.593-4.564 10.127-10.195 10.127S75.789 20.1 75.789 14.507 80.353 4.378 85.985 4.378c5.63 0 10.196 4.535 10.196 10.129"/></g></svg>',
};
function hpBrandOf(device) {
  if (hpIsHpDevice(device)) return 'hp';
  var id = `${device?.manufacturer || ''} ${device?.model || ''} ${device?.name || ''}`.toLowerCase();
  return /\bbrother\b/.test(id) ? 'brother' : /\bepson\b/.test(id) ? 'epson' : /\bcanon\b/.test(id) ? 'canon' : null;
}
var hpBrandBadge = (brand) => (HP_BRAND_LOGOS[brand] ? `<span class="hp-badge ${brand}">${HP_BRAND_LOGOS[brand]}</span>` : '');
var HP_ACCENT = '#0096d6';

// A click inside a dialog (more-info opened from the card, say) is not a click outside the card.
function hpInDialog(ev) {
  return ev.composedPath().some((n) => ['ha-more-info-dialog', 'ha-dialog', 'dialog'].indexOf(n.localName) >= 0);
}

// ── Card ─────────────────────────────────────────────────────────────────────
// The card's focusable controls, by the selector that identifies each across renders.
var HP_FOCUSABLE = ['a.pic', 'button.zoom'];
function hpFocusKey(el) {
  return el?.matches ? HP_FOCUSABLE.find((sel) => el.matches(sel)) || '' : '';
}

var HP_DEFAULTS = {
  show_image: true, show_inks: true, show_alerts: true, show_stats: true, show_eprint: true, show_expired: false, low_threshold: 15, picture: 'auto',
};

class PrinterCard extends HTMLElement {
  static defaults = HP_DEFAULTS;

  static getConfigElement() {
    return document.createElement('printer-card-editor');
  }

  static getStubConfig(hass) {
    var p = hpFindPrinters(hass)[0];
    return p ? { device_id: p.id } : {};
  }

  setConfig(config) {
    if (!config) throw new Error('Invalid configuration');
    this._config = Object.assign({}, this.constructor.defaults, config);
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this._sig = null;
    this._update();
  }

  set hass(hass) {
    this._hass = hass;
    this._update();
  }

  connectedCallback() {
    // Keeps the time-dependent parts ("Last seen 5 minutes ago", expired cartridges) current:
    // _update() only re-renders when they actually change.
    clearInterval(this._timer);
    this._timer = setInterval(() => this._update(), 60000);
  }

  disconnectedCallback() {
    clearInterval(this._timer);
  }

  getCardSize() { return 5; }

  getGridOptions() { return { columns: 12, min_columns: 6 }; }

  _lang() {
    return hpLang((this._config?.language) || (this._hass?.language) || document.documentElement.lang);
  }

  _t(k, vars) { var s = hpT(this._lang(), k); return vars ? hpFill(s, vars) : s; }

  // Discovery is reused until the registry, the config or the availability of the printer's
  // entities changes (an entity coming back online brings the attributes discovery relies on).
  // An incomplete result (states not loaded yet) is searched again on the next update, and so is a
  // missing IPP sensor (the IPP integration may load after HP Printer): its lookup reads the states.
  _resolve() {
    var hass = this._hass, m = this._memo;
    if (m && m.entities === hass.entities && m.devices === hass.devices && m.config === this._config &&
      m.avail === this._availSig(m.devs)) {
      if ((m.r.kind === 'hp' || m.r.kind === 'brother') && !m.r.ipp) {
        var ipp = hpFindIppSensor(hass, m.r.deviceId);
        if (ipp) m.r = Object.assign({}, m.r, { ipp: ipp });
      }
      return m.r;
    }
    var r = this._discover();
    var devs = [r.deviceId].concat(r.kind === 'hp' ? r.subs || [] : []);
    this._memo = r.status && hass.states[r.status]
      ? { entities: hass.entities, devices: hass.devices, config: this._config, devs: devs, avail: this._availSig(devs), r: r }
      : null;
    return r;
  }

  _availSig(devs) {
    var hass = this._hass;
    return hpEntitiesOf(hass, devs).map((e) => (hass.states[e.entity_id].state === 'unavailable' ? 0 : 1)).join('');
  }

  _discover() {
    var hass = this._hass, c = this._config, over = c.entities || {};
    var deviceId = c.device_id;
    if (!deviceId && c.entity && hass.entities?.[c.entity]) deviceId = hass.entities[c.entity].device_id;
    if (!deviceId && over.status && hass.entities?.[over.status]) deviceId = hass.entities[over.status].device_id;
    if (!deviceId) { var p = hpFindPrinters(hass)[0]; deviceId = p?.id; }

    var main = hpEntitiesOf(hass, [deviceId]);
    var status = over.status || hpPick(main, hass, (eid, s) => eid.indexOf('sensor.') === 0 && hpIsHpStatus(s));
    var r = { deviceId: deviceId, kind: 'hp', isHp: true, status: status, inks: [], ipp: over.ipp, total_pages: over.total_pages,
      eprint: over.eprint, eprint_registration: over.eprint_registration };

    if (status && hpIsHpStatus(hass.states[status])) {
      var subs = hpSubDevices(hass, deviceId);
      r.subs = subs;
      r.inks = hpHpInks(hass, subs);
      // ePrint (HP cloud printing): "ePrint status" (connectivity) and "ePrint registered" binary sensors.
      var ep = main.filter((e) => e.entity_id.indexOf('binary_sensor.') === 0 && /eprint/.test(e.entity_id));
      if (!r.eprint) {
        r.eprint = hpPick(ep, hass, (_eid, s) => s.attributes.device_class === 'connectivity') ||
          hpPick(ep, hass, (eid) => /(statut|status)/.test(eid));
      }
      if (!r.eprint_registration) {
        r.eprint_registration = hpPick(ep, hass, (eid, s) => eid !== r.eprint && (/(registr|enregistr)/.test(eid) || /registered/.test(String(s.attributes.state))));
      }
      if (!r.ipp) r.ipp = hpFindIppSensor(hass, deviceId);
      if (!r.total_pages) {
        var all = hpEntitiesOf(hass, subs);
        r.total_pages = hpPick(all, hass, (eid) => /_printer_total_pages$/.test(eid)) ||
          hpPick(all, hass, (eid, s) => hpUnit(s) === 'pages' && s.attributes.state_class === 'total_increasing' && /total_(pages|impressions)$/.test(eid));
      }
    } else if (!status && main.some(hpIsBrotherStatus)) {
      // Brother integration: its status and ink / toner sensors, plus the IPP sensor of the same model for the
      // paper and cover alerts, when the printer is also set up with IPP.
      r.kind = 'brother';
      r.isHp = false;
      var bro = main.filter((e) => e.platform === 'brother');
      r.status = (bro.find((e) => e.translation_key === 'printer_status') || bro.find((e) => e.translation_key === 'status')).entity_id;
      r.inks = hpBrotherInks(bro);
      if (!r.ipp) r.ipp = hpFindIppSensor(hass, deviceId);
      if (!r.total_pages) r.total_pages = bro.find((e) => e.translation_key === 'page_counter')?.entity_id;
    } else {
      // IPP-only printer (or status forced to an IPP sensor).
      r.kind = 'ipp';
      r.isHp = hpIsHpDevice(hass.devices?.[deviceId]);
      r.status = status || hpPick(main, hass, (eid, s) => eid.indexOf('sensor.') === 0 && hpIsIppStatus(s));
      r.ipp = r.ipp || r.status;
      r.inks = hpIppInks(hass, main);
    }
    return r;
  }

  _ids(r) {
    var ids = [r.status, r.ipp, r.total_pages, r.eprint, r.eprint_registration];
    r.inks.forEach((i) => { ids.push(i.level, i.status, i.expiry, i.pages_left); });
    return ids.filter(Boolean);
  }

  // What the card shows that changes with time alone: the "last seen" text and the expired cartridges.
  _timeSig(r) {
    var st = this._hass.states[r.status];
    var out = [];
    if (this._state(r) === 'offline' && st?.last_changed) {
      var since = new Date(st.last_changed);
      if (!Number.isNaN(since.getTime())) out.push(st.last_changed, this._relative(since));
    }
    if (this._config.show_expired) {
      r.inks.forEach((ink) => {
        var d = ink.expiry && this._avail(ink.expiry) ? new Date(this._val(ink.expiry)).getTime() : NaN;
        out.push(!Number.isNaN(d) && d < Date.now());
      });
    }
    return out;
  }

  _update() {
    if (!this._config || !this._hass || !this.shadowRoot) return;
    var r = this._resolve();
    var hass = this._hass;
    var sig = JSON.stringify([this._lang(), this._config, r.deviceId, this._timeSig(r), this._ids(r).map((id) => {
      var s = hass.states[id];
      return s ? [id, s.state, s.attributes.state, s.attributes.state_reason, s.attributes.state_message] : null;
    })]);
    if (sig === this._sig) return;
    this._sig = sig;
    this._render(r);
  }

  _val(id) { var s = id && this._hass.states[id]; return s ? s.state : undefined; }

  _avail(id) { var v = this._val(id); return v !== undefined && v !== 'unavailable' && v !== 'unknown'; }

  _num(id) { return this._avail(id) ? Number(this._val(id)) : NaN; }

  _state(r) {
    var v = this._val(r.status);
    if (v === undefined || v === 'unavailable' || v === 'off') return 'offline';
    if (r.kind === 'ipp') return HP_IPP_STATES[v] || 'unknown';
    if (r.kind === 'brother') return hpBrotherState(v);
    return HP_STATE_COLORS[v] ? v : 'unknown';
  }

  _inkLabel(ink) {
    return this._t(`c_${ink.color}`);
  }

  // Label used inside a sentence: lower case in French, Spanish, Serbian, Italian, Dutch, Portuguese and Polish
  // ("encre jaune", "cartucho negro", "црна", "zwart"), as is in English and German (nouns keep their capital).
  _inkWord(ink) {
    var l = ink.printhead ? this._t('printhead') : this._inkLabel(ink);
    if (['es', 'sr', 'sr-Latn', 'it', 'nl', 'pt', 'pl'].indexOf(this._lang()) >= 0) return l.toLowerCase();
    if (this._lang() !== 'fr') return l;
    // "encre noire", "cartouche noire": the adjective agrees with the feminine noun.
    var w = hpT('fr', `cw_${ink.color}`);
    return w === `cw_${ink.color}` ? l.toLowerCase() : w;
  }

  _alerts(r, state) {
    var c = this._config, out = [];
    var low = Number(c.low_threshold);
    if (Number.isNaN(low)) low = 15;
    var critical = Math.min(low, 5);
    r.inks.forEach((ink) => {
      var label = this._inkWord(ink);
      if (!ink.printhead) {
        var p = this._num(ink.level);
        if (!Number.isNaN(p) && p <= low) {
          // `ink`: shown by the cartridge itself (tank or chip), not repeated as a chip in the mini card.
          out.push({ level: p <= critical ? 'error' : 'warn', icon: 'mdi:water-alert', ink: true,
            text: this._t(p <= critical ? 'al_empty' : 'al_low', { c: label, p: Math.round(p) }) });
        }
      }
      var st = ink.status && this._hass.states[ink.status];
      if (st && st.state === 'off' && !hpCartridgeOk(st.attributes.state)) {
        var key = hpCartridgeProblem(st.attributes.state);
        // A printhead uses its own ph_* form when its language has one (feminine printhead, masculine cartridge).
        var problem = (ink.printhead && (HpI18n[this._lang()] || {})[key.replace('cs_', 'ph_')]) || this._t(key);
        out.push({ level: 'error', icon: ink.printhead ? 'mdi:printer-alert' : 'mdi:alert-circle',
          text: ink.printhead ? this._t('al_printhead', { s: problem }) : this._t('al_cartridge', { c: label, s: problem }) });
      }
      if (c.show_expired && ink.expiry && this._avail(ink.expiry)) {
        var d = new Date(this._val(ink.expiry));
        if (!Number.isNaN(d.getTime()) && d.getTime() < Date.now()) {
          out.push({ level: 'info', icon: 'mdi:calendar-alert', text: this._t('al_expired', { c: label }) });
        }
      }
    });
    if (state === 'stopped') out.push({ level: 'error', icon: 'mdi:printer-alert', text: this._t('al_stopped') });
    out = out.concat(this._ippAlerts(r));
    var rank = { error: 0, warn: 1, info: 2 };
    return out.sort((a, b) => rank[a.level] - rank[b.level]);
  }

  // IPP "printer-state-reasons": media-empty-error, media-jam-warning, door-open…
  _ippAlerts(r) {
    var s = r.ipp && this._hass.states[r.ipp];
    if (!s || s.state === 'unavailable') return [];
    var raw = s.attributes.state_reason;
    var reasons = Array.isArray(raw) ? raw : String(raw || '').split(',');
    var seen = {};
    var out = [];
    reasons.map((x) => String(x).trim()).forEach((reason) => {
      if (!reason || reason === 'none' || reason === 'None') return;
      var level = /-error$/.test(reason) ? 'error' : (/-report$/.test(reason) ? 'info' : 'warn');
      var base = reason.replace(/-(error|warning|report)$/, '');
      // Ink levels are already covered by the cartridges.
      if (/^(marker-supply-low|marker-supply-empty|toner-low|toner-empty|marker-waste)/.test(base) && r.inks.length) return;
      var key = `ipp_${base.replace(/-/g, '_')}`;
      var text = this._t(key);
      if (text === key) text = base.replace(/-/g, ' ').replace(/^./, (ch) => ch.toUpperCase());
      if (seen[text]) return;
      seen[text] = true;
      out.push({ level: level, icon: /media|paper|tray/.test(base) ? 'mdi:paper-roll-outline' : 'mdi:alert', text: text });
    });
    return out;
  }

  _relative(date) {
    var secs = Math.round((date.getTime() - Date.now()) / 1000);
    var units = [['day', 86400], ['hour', 3600], ['minute', 60]];
    try {
      var rtf = new Intl.RelativeTimeFormat(hpLocale(this._lang(), this._hass), { numeric: 'auto' });
      for (var i = 0; i < units.length; i++) {
        if (Math.abs(secs) >= units[i][1]) return rtf.format(Math.round(secs / units[i][1]), units[i][0]);
      }
      return rtf.format(0, 'minute');
    } catch (_e) {
      return date.toLocaleString(hpLocale(this._lang(), this._hass));
    }
  }

  // Drawing set by the `picture` option, else detected from the device.
  _pictureKey(r) {
    var pic = this._config.picture;
    return HP_PICTURES.indexOf(pic) < 1 ? hpPictureFor(this._hass.devices?.[r.deviceId], r.kind) : pic;
  }

  // Custom image, else the configured or detected drawing.
  _picture(r, custom) {
    if (custom) return `<img src="${hpEsc(custom)}" alt="">`;
    var pic = this._pictureKey(r);
    return `<svg class="art art-${pic}" viewBox="0 0 160 120" aria-hidden="true">${HP_ART_DEFS}${HP_ART[pic]}</svg>`;
  }

  // What both cards show: name, state and its color, alerts, picture and header icon.
  _view(r) {
    var c = this._config, hass = this._hass;
    var deviceName = hpDeviceName(hass, r.deviceId);
    var state = this._state(r);
    var offline = state === 'offline';
    var v = {
      name: c.name || deviceName.replace(/\s*\([\d.]+\)\s*$/, '') || this._t('printer'),
      state: state,
      offline: offline,
      color: offline ? 'var(--disabled-text-color, #9e9e9e)' : (HP_STATE_COLORS[state] || 'var(--secondary-text-color)'),
      alerts: offline ? [] : this._alerts(r, state),
      imageHtml: '',
      logoHtml: `<span class="logo mark" aria-hidden="true"><ha-icon icon="mdi:printer"></ha-icon>${hpBrandBadge(hpBrandOf(this._hass.devices?.[r.deviceId]))}</span>`,
    };

    // Picture, with the control panel lit in the status color.
    // Clicking it opens the printer's web admin page, when its address is known.
    if (c.show_image) {
      var custom = c.image && String(c.image).trim();
      // Only http(s) addresses become a link, like the detected configuration URL.
      var custAdmin = c.admin_url && String(c.admin_url).trim();
      var admin = (custAdmin && /^https?:\/\//i.test(custAdmin) ? custAdmin : '') || hpAdminUrl(hass, r);
      var picTag = admin ? 'a' : 'div';
      v.imageHtml = '<' + picTag + ' class="pic' + (offline ? ' off' : '') + (HP_BUSY.indexOf(state) >= 0 ? ' busy' : '') + '"' +
        (admin ? ` href="${hpEsc(admin)}" target="_blank" rel="noopener noreferrer" title="${hpEsc(this._t('open_admin'))}"` : '') + '>' +
        this._picture(r, custom) +
      '</' + picTag + '>';
    }
    return v;
  }

  _statusPill(v) {
    var label = hpEsc(this._t(`st_${v.state}`));
    return `<div class="status" role="img" title="${label}" aria-label="${label}"><ha-icon icon="${HP_STATE_ICONS[v.state] || 'mdi:printer'}"></ha-icon><span>${
      label}</span></div>`;
  }

  // "Last seen 5 minutes ago" while the printer is offline, '' when unknown.
  _lastSeen(r) {
    var st = this._hass.states[r.status];
    var since = st?.last_changed ? new Date(st.last_changed) : null;
    return since && !Number.isNaN(since.getTime()) ? hpEsc(this._t('last_seen', { t: this._relative(since) })) : '';
  }

  // Level of a cartridge and how it is flagged: low (at or below the threshold), nearly empty, faulty.
  _inkInfo(ink) {
    var low = Number(this._config.low_threshold);
    if (Number.isNaN(low)) low = 15;
    var p = this._num(ink.level);
    var known = !Number.isNaN(p);
    var left = Number(this._val(ink.pages_left));
    return {
      p: p,
      pct: known ? Math.max(0, Math.min(100, p)) : 0,
      low: known && p <= low,
      crit: known && p <= Math.min(low, 5),
      bad: !!ink.status && this._val(ink.status) === 'off' && !hpCartridgeOk(this._hass.states[ink.status]?.attributes.state),
      title: this._inkLabel(ink) + (known ? ` · ${Math.round(p)} %` : '') +
        (this._avail(ink.pages_left) && !Number.isNaN(left) ? ` · ${this._t('pages_left', { n: left })}` : ''),
    };
  }

  // Extra control at the top right of the header: none here, the mini card's zoom button.
  _corner() { return ''; }

  _render(r) {
    if (!r.deviceId || !r.status) {
      this.shadowRoot.innerHTML = `${this._styles()}<ha-card><div class="empty"><ha-icon icon="mdi:printer-off"></ha-icon>${this._t('no_device')}</div></ha-card>`;
      return;
    }
    var v = this._view(r);
    this._paint(v, this._full(r, v));
  }

  _paint(v, inner, cls) {
    var focused = hpFocusKey(this.shadowRoot.activeElement);
    var classes = [v.offline ? 'offline' : '', cls || ''].filter(Boolean).join(' ');
    this.shadowRoot.innerHTML = `${this._styles(v.color)}<ha-card class="${classes}">${inner}</ha-card>`;
    // innerHTML replaced the focused control: focus its counterpart so keyboard navigation keeps its place.
    if (focused) this.shadowRoot.querySelector(focused)?.focus({ preventScroll: true });
  }

  // The full card: header (logo, name, status), picture with its chips, ink levels and alerts.
  _full(r, v) {
    var c = this._config;
    var offline = v.offline, alerts = v.alerts;

    var chips = [];
    if (!offline && c.show_alerts) {
      var errors = alerts.filter((a) => a.level === 'error').length;
      var warns = alerts.filter((a) => a.level === 'warn').length;
      if (errors) chips.push(`<span class="chip error"><ha-icon icon="mdi:alert-circle"></ha-icon>${errors}</span>`);
      if (warns) chips.push(`<span class="chip warn"><ha-icon icon="mdi:alert"></ha-icon>${warns}</span>`);
    }
    if (!offline && c.show_eprint && this._avail(r.eprint)) {
      var epOn = this._val(r.eprint) === 'on';
      var epReg = !r.eprint_registration || !this._avail(r.eprint_registration) || this._val(r.eprint_registration) === 'on';
      var epKey = !epReg ? 'ep_unregistered' : (epOn ? 'ep_on' : 'ep_off');
      chips.push('<span class="chip ' + (epOn && epReg ? 'on' : 'muted') + '"><ha-icon icon="' +
        (epOn && epReg ? 'mdi:cloud-print-outline' : 'mdi:cloud-off-outline') + '"></ha-icon>' + this._t(epKey) + '</span>');
    }

    var sub = '';
    if (offline) {
      var seen = this._lastSeen(r);
      sub = `<div class="sub">${this._t('offline_text')}${seen ? `<br><span class="muted">${seen}</span>` : ''}</div>`;
    } else if (c.show_stats && this._avail(r.total_pages)) {
      var n = Number(this._val(r.total_pages));
      sub = '<div class="sub muted"><ha-icon icon="mdi:file-document-multiple-outline"></ha-icon>' +
        hpEsc(this._t('pages', { n: Number.isNaN(n) ? this._val(r.total_pages) : n.toLocaleString(hpLocale(this._lang(), this._hass)) })) + '</div>';
    }

    // Like the Home Connect cards: logo, name and status pill on top, then the picture with the chips.
    var head = '<div class="hd"><div class="header">' + v.logoHtml +
      '<div class="titles"><div class="name">' + hpEsc(v.name) + '</div></div>' + this._statusPill(v) + this._corner() + '</div></div>' +
      '<div class="head">' + v.imageHtml +
      '<div class="meta">' +
        (chips.length ? `<div class="chips">${chips.join('')}</div>` : '') +
        sub +
      '</div></div>';

    var inksHtml = '';
    var cartridges = r.inks.filter((i) => !i.printhead && i.level);
    if (!offline && c.show_inks && cartridges.length) {
      var toner = cartridges.every((i) => i.toner);
      inksHtml = '<div class="section"><div class="section-title"><ha-icon icon="' + (toner ? 'mdi:invert-colors' : 'mdi:water-outline') + '"></ha-icon>' + this._t(toner ? 'toner' : 'inks') + '</div><div class="inks" style="--n:' + cartridges.length + '">' +
        cartridges.map((ink) => {
          var k = this._inkInfo(ink);
          return '<div class="ink' + (k.low ? ' low' : '') + (k.crit ? ' crit' : '') + (k.bad ? ' bad' : '') + '" title="' + hpEsc(k.title) + '">' +
            '<div class="tank"><div class="level" style="height:' + k.pct + '%;' + (k.pct > 0 ? 'min-height:3px;' : '') + 'background:' + HP_INK_COLORS[ink.color] + '"></div>' +
              (k.low || k.bad ? '<ha-icon class="flag" icon="mdi:alert"></ha-icon>' : '') + '</div>' +
            '<div class="pct">' + (Number.isNaN(k.p) ? '—' : `${Math.round(k.p)}<small>%</small>`) + '</div>' +
            '<div class="lbl">' + hpEsc(this._inkLabel(ink)) + '</div>' +
          '</div>';
        }).join('') + '</div></div>';
    }

    var alertsHtml = '';
    if (!offline && c.show_alerts) {
      alertsHtml = '<div class="section"><div class="section-title"><ha-icon icon="mdi:alert-outline"></ha-icon>' + this._t('alerts') + '</div>' +
        (alerts.length
          ? `<div class="alerts">${alerts.map((a) => `<div class="alert ${a.level}"><ha-icon icon="${a.icon}"></ha-icon><span>${hpEsc(hpCap(a.text))}</span></div>`).join('')}</div>`
          : `<div class="alert ok"><ha-icon icon="mdi:check-circle"></ha-icon><span>${this._t('no_alerts')}</span></div>`) +
      '</div>';
    }

    return head + inksHtml + alertsHtml;
  }

  _styles(color) {
    return '<style>' +
      ':host { display: block; height: 100%; --hp-color: ' + (color || 'var(--disabled-text-color, #9e9e9e)') + '; }' +
      'ha-card { height: 100%; box-sizing: border-box; padding: 12px; display: flex; flex-direction: column; gap: 10px; }' +
      // The header's wrapper is its size container (at the narrowest widths the status pill keeps only its icon or dot).
      // Not ha-card: an inline-size container has no intrinsic width, so in a max-content parent (layout-card, an
      // inline-block) the whole card collapsed to its padding; this wrapper only drops the header's own share...
      '.hd { container: printer-card / inline-size; margin-bottom: -2px; }' +
      // ...so the card would shrink to its body. This invisible line gives it back a natural width of ~300px (as wide
      // as a usual header) in such parents, while it can still shrink: it breaks anywhere, so it asks for no minimum.
      'ha-card::after { content: "\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0"; font: 10px monospace; overflow-wrap: anywhere; height: 0; overflow: hidden; visibility: hidden; margin-top: -10px; }' +
      '.empty { display: flex; align-items: center; gap: 10px; color: var(--secondary-text-color); }' +
      // The body starts 8px under the header (the card gap is 10px between body blocks: see .hd).
      '.header { display: flex; align-items: center; gap: 10px; }' +
      // The name gives way first, with an ellipsis, but always keeps a few characters; the buttons never shrink.
      // Basis 0: the name only gets what the pill leaves, so the pill is cut only when even 5ch of name do not fit
      // beside it (with a basis of auto both shrank in proportion, and "Ready" became "Re…" at 320px).
      '.titles { flex: 1 1 0; min-width: 5ch; }' +
      '.logo { flex: none; display: block; width: 40px; height: 40px; line-height: 0; }' +
      // A printer in a round badge, tinted with the accent of the showcase site.
      '.logo.mark { position: relative; display: grid; place-items: center; border-radius: 50%; background: color-mix(in srgb, ' + HP_ACCENT + ' 16%, transparent); color: ' + HP_ACCENT + '; }' +
      '.logo.mark ha-icon { --mdc-icon-size: 24px; }' +
      '.hp-badge { position: absolute; right: -4px; bottom: -4px; width: 18px; height: 18px; border-radius: 50%; line-height: 0;' +
        ' box-shadow: 0 0 0 2px var(--card-background-color, #fff); }' +
      '.hp-badge svg, .hp-badge img { width: 100%; height: 100%; object-fit: contain; }' +
      // Wordmarks: a white pill wider than the round HP mark, still clear of the name.
      '.hp-badge.brother, .hp-badge.epson, .hp-badge.canon { width: 28px; height: 12px; right: -8px; bottom: -3px; padding: 2px 3px; box-sizing: border-box;' +
        ' border-radius: 4px; background: #fff; box-shadow: 0 0 0 1px var(--divider-color, rgba(0,0,0,.12)), 0 0 0 3px var(--card-background-color, #fff); }' +
      '.head { display: flex; align-items: center; gap: 12px; }' +
      'a.pic { cursor: pointer; }' +
      'a.pic:hover img { filter: brightness(1.06); }' +
      '.pic { display: block; position: relative; width: 28%; max-width: 120px; flex-shrink: 0; transition: filter 0.4s, opacity 0.4s; }' +
      '.pic img { display: block; width: 100%; height: auto; }' +
      '.pic svg.art { display: block; width: 100%; height: auto; overflow: visible; }' +
      '.screen { fill: var(--hp-color); opacity: 0.85; filter: drop-shadow(0 0 6px var(--hp-color)); }' +
      '.pic.busy .screen { animation: hp-glow 1.6s ease-in-out infinite; }' +
      '@keyframes hp-glow { 0%, 100% { opacity: 0.95; } 50% { opacity: 0.45; } }' +
      '.pic.off { filter: grayscale(1); opacity: 0.55; }' +
      '.pic.off .screen { display: none; }' +
      '.meta { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }' +
      '.name { font-size: 16px; font-weight: 500; color: var(--primary-text-color); line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }' +
      '.status { display: inline-flex; align-items: center; gap: 6px; flex: 0 1 auto; min-width: 0; max-width: 50%; box-sizing: border-box; overflow: hidden;' +
        ' white-space: nowrap; font-size: 12px; font-weight: 500; color: var(--hp-color);' +
        ' padding: 2px 10px 2px 6px; border-radius: 12px; background: color-mix(in srgb, var(--hp-color) 15%, transparent); }' +
      '.status ha-icon { --mdc-icon-size: 14px; flex: none; }' +
      '.status span { min-width: 0; overflow: hidden; text-overflow: ellipsis; }' +
      // Too narrow for a readable status: its icon only, never cut (the text stays in the pill's title and label),
      // with a smaller logo and tighter gaps, so the name and the detail button of a zoomed mini card still fit at 6 columns.
      '@container printer-card (max-width: 200px) { .header { gap: 6px; } .logo { width: 32px; height: 32px; } .logo.mark ha-icon { --mdc-icon-size: 20px; } .hp-badge { width: 14px; height: 14px; right: -3px; bottom: -3px; }' +
        ' .status { min-width: 22px; padding: 2px 4px; } .status span { display: none; } }' +
      '.chips { display: flex; flex-wrap: wrap; gap: 6px; }' +
      '.chip { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 500; padding: 1px 8px 1px 5px; border-radius: 12px; }' +
      '.chip ha-icon { --mdc-icon-size: 13px; }' +
      '.chip.error { background: color-mix(in srgb, var(--error-color, #db4437) 15%, transparent); color: var(--error-color, #db4437); }' +
      '.chip.warn { background: color-mix(in srgb, var(--warning-color, #ffa600) 15%, transparent); color: var(--warning-color, #ffa600); }' +
      '.chip.on { background: color-mix(in srgb, var(--info-color, #039be5) 15%, transparent); color: var(--info-color, #039be5); }' +
      '.chip.muted { background: var(--secondary-background-color, rgba(128,128,128,0.12)); color: var(--secondary-text-color); }' +
      '.sub { font-size: 11px; color: var(--secondary-text-color); line-height: 1.4; display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }' +
      '.sub ha-icon { --mdc-icon-size: 15px; }' +
      '.muted { color: var(--secondary-text-color); opacity: 0.85; }' +
      '.section { display: flex; flex-direction: column; gap: 6px; }' +
      '.section-title { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; text-transform: uppercase;' +
        ' letter-spacing: .04em; color: var(--secondary-text-color); }' +
      '.section-title ha-icon { --mdc-icon-size: 16px; }' +
      '.inks { display: grid; grid-template-columns: repeat(var(--n), minmax(0, 1fr)); gap: 8px; }' +
      '.ink { display: flex; flex-direction: column; align-items: center; gap: 2px; min-width: 0; }' +
      '.tank { position: relative; width: 100%; max-width: 40px; height: 44px; border-radius: 8px; overflow: hidden;' +
        ' background: var(--secondary-background-color, rgba(128,128,128,0.12)); box-shadow: inset 0 0 0 1px var(--divider-color, rgba(128,128,128,0.25)); }' +
      '.level { position: absolute; left: 0; right: 0; bottom: 0; border-radius: 0 0 8px 8px; transition: height 0.6s ease; }' +
      // Low / nearly empty: outlined outside the tank, so the frame never hides a low level (a low yellow next to an orange frame).
      '.ink.low .tank, .ink.bad .tank { outline: 2px solid var(--warning-color, #ffa600); outline-offset: 1px; }' +
      '.ink.bad .tank, .ink.crit .tank { outline-color: var(--error-color, #db4437); }' +
      '.flag { position: absolute; top: 4px; left: 50%; transform: translateX(-50%); --mdc-icon-size: 16px; color: var(--warning-color, #ffa600); }' +
      '.ink.bad .flag, .ink.crit .flag { color: var(--error-color, #db4437); }' +
      '.pct { font-size: 13px; font-weight: 500; color: var(--primary-text-color); }' +
      '.pct small { font-size: 11px; font-weight: 500; margin-left: 1px; color: var(--secondary-text-color); }' +
      '.lbl { font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }' +
      '.alerts { display: flex; flex-direction: column; gap: 6px; }' +
      '.alert { display: flex; align-items: center; gap: 8px; font-size: 12px; padding: 6px 8px; border-radius: 10px;' +
        ' background: var(--secondary-background-color, rgba(128,128,128,0.1)); color: var(--primary-text-color); }' +
      '.alert ha-icon { --mdc-icon-size: 18px; flex-shrink: 0; }' +
      '.alert.error { background: color-mix(in srgb, var(--error-color, #db4437) 12%, transparent); } .alert.error ha-icon { color: var(--error-color, #db4437); }' +
      '.alert.warn { background: color-mix(in srgb, var(--warning-color, #ffa600) 12%, transparent); } .alert.warn ha-icon { color: var(--warning-color, #ffa600); }' +
      '.alert.info ha-icon { color: var(--secondary-text-color); }' +
      '.alert.ok { color: var(--secondary-text-color); } .alert.ok ha-icon { color: var(--success-color, #43a047); }' +
      // The screen keeps the status color but stops pulsing; levels and hovers change without motion.
      '@media (prefers-reduced-motion: reduce) { .pic.busy .screen { animation: none; } .pic, .level { transition: none; } }' +
    '</style>';
  }
}

// ── printer-mini-card ────────────────────────────────────────────────────────
// Laid out like the Home Connect mini cards: logo, name and status, then the picture with one chip per cartridge and per alert.
// Its detail button (top right, `zoom: false` removes it) switches it to the full card and back;
// a click anywhere else brings it back too.
var HP_MINI_STYLES =
  '.zoom { all: unset; flex: none; cursor: pointer; width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; color: var(--secondary-text-color); }' +
  '.zoom ha-icon { --mdc-icon-size: 16px; }' +
  '.zoom:hover { background: color-mix(in srgb, var(--secondary-text-color) 16%, transparent); color: var(--primary-text-color); }' +
  '.zoom:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 1px; }' +
  '.header > .zoom { margin: -4px -4px -4px 0; }' +
  // Compact view, like the Home Connect mini cards: header (logo, name, status, detail button), then picture and details.
  'ha-card.mini { gap: 10px; }' +
  '.st { display: inline-flex; align-items: center; gap: 4px; flex: 0 1 auto; min-width: 0; max-width: 50%; box-sizing: border-box; overflow: hidden;' +
    ' padding: 1px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;' +
    ' white-space: nowrap; background: color-mix(in srgb, var(--hp-color) 15%, transparent); color: var(--hp-color); }' +
  '.st .dot { flex: none; width: 6px; height: 6px; border-radius: 50%; background: var(--hp-color); }' +
  '.st .tx { min-width: 0; overflow: hidden; text-overflow: ellipsis; }' +
  // Too narrow for a readable status: the dot only (the text stays in the pill's title and label).
  '@container printer-card (max-width: 200px) { .st { min-width: 14px; padding: 4px; } .st .tx { display: none; } }' +
  '.mini .content { display: flex; align-items: center; gap: 12px; }' +
  '.mini .pic { width: 56px; max-width: none; }' +
  '.mini .info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }' +
  // contain: inline-size: the line's text ("Last seen 3 days ago") never sets the card's min-content width, so the
  // offline mini card still shrinks in a `1fr 1fr` grid (layout-card) instead of overflowing it; the text ends with an ellipsis.
  '.line { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--secondary-text-color); min-width: 0; contain: inline-size; }' +
  '.line ha-icon { --mdc-icon-size: 14px; flex-shrink: 0; }' +
  '.line span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }' +
  '.rs { display: flex; flex-wrap: wrap; gap: 6px; }' +
  '.rs:empty { display: none; }' +
  '.r { --t: var(--secondary-text-color); display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px 1px 5px; border-radius: 12px;' +
    ' font-size: 11px; font-weight: 500; white-space: nowrap; color: var(--secondary-text-color); max-width: 100%; min-width: 0; box-sizing: border-box;' +
    ' background: var(--secondary-background-color, rgba(128,128,128,0.12)); }' +
  '.r ha-icon { --mdc-icon-size: 13px; flex: none; color: var(--t); }' +
  // A label wider than the card ends with an ellipsis instead of running out of it (the full text is in the title).
  '.r .tx { min-width: 0; overflow: hidden; text-overflow: ellipsis; }' +
  // A small tank, like the full card's ink levels: filled to the level, outlined when low or nearly empty.
  '.r .mt { position: relative; width: 10px; height: 14px; flex: none; border-radius: 3px; overflow: hidden;' +
    ' background: var(--secondary-background-color, rgba(128,128,128,0.12)); box-shadow: inset 0 0 0 1px var(--divider-color, rgba(128,128,128,0.25)); }' +
  '.r .mt > span { position: absolute; left: 0; right: 0; bottom: 0; }' +
  '.r.warn .mt, .r.error .mt { outline: 1.5px solid var(--t); outline-offset: 0.5px; }' +
  '.r.warn { --t: var(--warning-color, #ffa600); }' +
  '.r.error { --t: var(--error-color, #db4437); }' +
  '.r.warn, .r.error { color: var(--t); background: color-mix(in srgb, var(--t) 15%, transparent); }';

class PrinterMiniCard extends PrinterCard {
  static defaults = Object.assign({}, HP_DEFAULTS, { zoom: true });

  static getConfigElement() {
    return document.createElement('printer-mini-card-editor');
  }

  constructor() {
    super();
    // A click outside the card (and outside a dialog opened from it) brings back the compact view.
    this._onOutside = (ev) => {
      if (!this._zoomed || ev.composedPath().includes(this) || hpInDialog(ev)) return;
      this._zoomed = false;
      this._sig = null;
      this._update();
    };
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._onOutside, true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._onOutside, true);
  }

  getCardSize() { return this._zoomed ? super.getCardSize() : 2; }

  // Home Assistant reads the grid options when it lays out the Sections view, not when the card is
  // zoomed: the mini card always asks for the compact grid, and rows: 'auto' lets the full view grow.
  // At 4 columns (~100-160px) the header cannot hold the logo, a readable name and the detail button.
  getGridOptions() { return { columns: 12, min_columns: 6, rows: 'auto' }; }

  _styles(color) {
    return super._styles(color).replace('</style>', `${HP_MINI_STYLES}</style>`);
  }

  _corner() {
    if (this._config.zoom === false) return '';
    return `<button class="zoom" title="${hpEsc(this._t(this._zoomed ? 'zoom_out' : 'zoom_in'))}"><ha-icon icon="${
      this._zoomed ? 'mdi:arrow-collapse' : 'mdi:arrow-expand'}"></ha-icon></button>`;
  }

  _render(r) {
    if (this._zoomed || !r.deviceId || !r.status) super._render(r);
    else {
      var v = this._view(r);
      var seen = v.offline ? this._lastSeen(r) : '';
      var label = hpEsc(this._t(`st_${v.state}`));
      this._paint(v, '<div class="hd"><div class="header">' + v.logoHtml +
          '<div class="titles"><div class="name">' + hpEsc(v.name) + '</div></div>' +
          `<span class="st" role="img" title="${label}" aria-label="${label}"><span class="dot"></span><span class="tx">${label}</span></span>` + this._corner() +
        '</div></div>' +
        '<div class="content">' + v.imageHtml + '<div class="info">' +
          (seen ? `<div class="line"><ha-icon icon="mdi:clock-outline"></ha-icon><span>${seen}</span></div>` : '') +
          '<div class="rs">' + this._chips(r, v) + '</div>' +
        '</div></div>', 'mini');
    }
    this.shadowRoot.querySelector('.zoom')?.addEventListener('click', (ev) => this._toggleZoom(ev));
  }

  // The detail button: full card, or back to the compact view.
  _toggleZoom(ev) {
    ev.stopPropagation(); // a click on the button is never a click on the header
    this._zoomed = !this._zoomed;
    this._sig = null;
    this._update();
    // Keyboard use (Enter / Space: no click count) keeps the focus on the button that replaced this one.
    if (ev.detail === 0) this.shadowRoot.querySelector('.zoom')?.focus({ preventScroll: true });
  }

  // One chip per cartridge (dot in its color and level), then one per alert the cartridges do not already show.
  _chips(r, v) {
    var c = this._config;
    if (v.offline) return '';
    var out = [];
    if (c.show_inks) {
      r.inks.filter((i) => !i.printhead && i.level).forEach((ink) => {
        var k = this._inkInfo(ink);
        out.push('<span class="r' + (k.crit || k.bad ? ' error' : (k.low ? ' warn' : '')) + '" title="' + hpEsc(k.title) + '">' +
          '<span class="mt"><span style="height:' + k.pct + '%;' + (k.pct > 0 ? 'min-height:2px;' : '') + 'background:' + HP_INK_COLORS[ink.color] + '"></span></span>' + (Number.isNaN(k.p) ? '—' : `${Math.round(k.p)} %`) + '</span>');
      });
    }
    if (c.show_alerts) {
      v.alerts.filter((a) => !a.ink).forEach((a) => {
        var txt = hpEsc(hpCap(a.text));
        out.push(`<span class="r ${a.level}" title="${txt}"><ha-icon icon="${a.icon}"></ha-icon><span class="tx">${txt}</span></span>`);
      });
    }
    return out.join('');
  }
}

// ── printer-card-editor (visual editor, built on HA's ha-form) ───────────────
class PrinterCardEditor extends HTMLElement {
  static defaults = HP_DEFAULTS;

  setConfig(config) {
    this._config = Object.assign({}, config);
    this._render();
  }

  set hass(hass) {
    var prevLang = this._hass?.language;
    this._hass = hass;
    if (this._form && prevLang === (hass?.language)) {
      this._form.hass = hass;
    } else {
      this._render();
    }
  }

  _lang() {
    return hpLang((this._config?.language) || (this._hass?.language));
  }

  _schema() {
    var t = (k) => hpT(this._lang(), k);
    return [
      { name: 'device_id', selector: { device: { filter: [{ integration: 'hpprinter' }, { integration: 'brother' }, { integration: 'ipp' }] } } },
      { name: 'name', selector: { text: {} } },
      {
        type: 'grid', name: '', schema: [
          { name: 'show_image', selector: { boolean: {} } },
          { name: 'show_inks', selector: { boolean: {} } },
          { name: 'show_alerts', selector: { boolean: {} } },
          { name: 'show_stats', selector: { boolean: {} } },
          { name: 'show_eprint', selector: { boolean: {} } },
        ],
      },
      { name: 'low_threshold', selector: { number: { min: 0, max: 50, step: 1, mode: 'slider', unit_of_measurement: '%' } } },
      { name: 'show_expired', selector: { boolean: {} } },
      { name: 'admin_url', selector: { text: { type: 'url' } } },
      {
        name: 'picture',
        selector: { select: { mode: 'dropdown', options: HP_PICTURES.map((v) => ({ value: v, label: t(`pic_${v}`) })) } },
      },
      { name: 'image', selector: { text: {} } },
      {
        name: 'language',
        selector: { select: { mode: 'dropdown', options: [{ value: 'fr', label: 'Français' }, { value: 'en', label: 'English' }, { value: 'de', label: 'Deutsch' }, { value: 'es', label: 'Español' }, { value: 'sr', label: 'Српски' }, { value: 'sr-Latn', label: 'Srpski (latinica)' }, { value: 'it', label: 'Italiano' }, { value: 'nl', label: 'Nederlands' }, { value: 'pt', label: 'Português (Portugal)' }, { value: 'pl', label: 'Polski' }] } },
      },
      {
        type: 'expandable', name: 'entities', title: t('ed_entities'), flatten: false,
        schema: [
          { name: 'status', selector: { entity: { domain: 'sensor' } } },
          { name: 'ipp', selector: { entity: { domain: 'sensor' } } },
          { name: 'total_pages', selector: { entity: { domain: 'sensor' } } },
          { name: 'eprint', selector: { entity: { domain: 'binary_sensor' } } },
          { name: 'eprint_registration', selector: { entity: { domain: 'binary_sensor' } } },
        ],
      },
    ];
  }

  _render() {
    if (!this._config || !this._hass) return;
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.addEventListener('value-changed', (ev) => this._valueChanged(ev));
      this.appendChild(this._form);
    }
    var lang = this._lang();
    this._form.hass = this._hass;
    this._form.schema = this._schema();
    this._form.computeLabel = (s) => {
      if (['status', 'ipp', 'total_pages', 'eprint', 'eprint_registration'].indexOf(s.name) >= 0) return hpT(lang, `en_${s.name}`);
      return hpT(lang, `ed_${s.name}`);
    };
    this._form.computeHelper = (s) => {
      var key = `ed_${s.name}_helper`;
      var txt = hpT(lang, key);
      return txt === key ? undefined : txt;
    };
    this._form.data = Object.assign({}, this.constructor.defaults, this._config);
  }

  _valueChanged(ev) {
    ev.stopPropagation();
    var value = Object.assign({}, ev.detail.value);
    // Keep the YAML short: drop options left empty or at their default.
    Object.keys(value).forEach((key) => {
      if (value[key] === '' || value[key] === null || value[key] === undefined) delete value[key];
    });
    var defaults = this.constructor.defaults;
    Object.keys(defaults).forEach((key) => {
      if (value[key] === defaults[key]) delete value[key];
    });
    if (value.entities) {
      var e = Object.assign({}, value.entities);
      Object.keys(e).forEach((k) => { if (!e[k]) delete e[k]; });
      if (Object.keys(e).length) value.entities = e; else delete value.entities;
    }
    if (this._config.type) value = Object.assign({ type: this._config.type }, value);
    var lang = this._lang();
    this._config = value;
    // A new language option relabels the form.
    if (lang !== this._lang()) this._render();
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: value }, bubbles: true, composed: true }));
  }
}

// The mini card's editor: the full card's options (shown once zoomed in) and the detail button.
class PrinterMiniCardEditor extends PrinterCardEditor {
  static defaults = PrinterMiniCard.defaults;

  _schema() {
    var schema = super._schema();
    schema.splice(2, 0, { name: 'zoom', selector: { boolean: {} } });
    return schema;
  }
}

if (!customElements.get('printer-card-editor')) {
  customElements.define('printer-card-editor', PrinterCardEditor);
}
if (!customElements.get('printer-mini-card-editor')) {
  customElements.define('printer-mini-card-editor', PrinterMiniCardEditor);
}

window.customCards = window.customCards || [];
if (!customElements.get('printer-card')) {
  customElements.define('printer-card', PrinterCard);
  window.customCards.push({
    type: 'printer-card',
    name: 'Printer Card',
    description: 'Status, ink or toner levels and alerts for printers (HP Printer and IPP integrations)',
    preview: true,
    documentationURL: 'https://github.com/juju35/ha-printer-card',
  });
}
if (!customElements.get('printer-mini-card')) {
  customElements.define('printer-mini-card', PrinterMiniCard);
  window.customCards.push({
    type: 'printer-mini-card',
    name: 'Printer Mini Card',
    description: 'Compact printer card: status, ink or toner levels and alerts on two lines, with a button showing the full card',
    preview: true,
    documentationURL: 'https://github.com/juju35/ha-printer-card',
  });
}

console.info(`%c PRINTER-CARD %c v${PRINTER_CARD_VERSION} `, 'color:#fff;background:#0096d6;font-weight:700', 'color:#0096d6;background:#fff');
