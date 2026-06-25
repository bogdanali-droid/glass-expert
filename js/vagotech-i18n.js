/* VAGOTECH i18n — EN / RO contextual translations
   Glosar tehnic feroviar:
   windscreen      = parbriz (cabina mecanicului)
   laminated glass = sticlă laminată
   tempered glass  = sticlă securizată (călită)
   heat-strengthened = termoîntărită
   rolling stock   = material rulant
   fleet           = flotă
   lead time       = termen de livrare
   in-house        = integral intern / în fabrică proprie
   refurbishment   = retehnologizare
   compliance      = conformitate
   fire & smoke    = foc și fum (comportament)
   driver cab      = cabina mecanicului
   procurement     = achiziții
*/
(function () {
  'use strict';

  var DICT = {
    en: {
      'nav.home': 'Home', 'nav.products': 'Products', 'nav.compliance': 'Compliance',
      'nav.about': 'About', 'nav.cta': 'Request Specs',
      'hero.eyebrow': 'EN 15152 · EN 15153 · EN 12600 · AFER',
      'hero.h1': 'VAGOTECH — Railway & Tramway Glass',
      'hero.subtitle': 'Certified. Precision-Engineered. Delivered in 4–6 Weeks.',
      'hero.body': 'Rail-grade glass for CFR, STB, Electroputere and Astra Vagoane — engineered to European safety standards, manufactured in-house, and delivered on a schedule your fleet planners can rely on. 25+ years of glass engineering from one of Europe\'s Top 20 processors. The only AFER-certified and authorized railway glass manufacturer in Romania.',
      'hero.btn.explore': 'Explore Solutions', 'hero.btn.request': 'Request Specifications',
      'hero.stat.weeks': 'Weeks delivery', 'hero.stat.years': 'Years engineering',
      'hero.stat.top20': 'EU glass processor', 'hero.stat.en45545': 'AFER certified manufacturer',
      'strip.en15152': 'EN 15152 Windscreens', 'strip.en15153': 'EN 15153 Side & Door Glass',
      'strip.en12600': 'EN 12600 Impact Safety', 'strip.en45545': 'AFER Certified Romania',
      'strip.inhouse': 'In-house tempering & lamination',
      'story.h2': 'The VAGOTECH Story',
      'story.subtitle': 'European-Engineered Glass for a Railway Network in Full Modernization',
      'story.p1': 'VAGOTECH is the railway and tramway division of <strong>Glas Expert</strong> &mdash; a European architectural glass manufacturer with 25+ years of experience and a place among the Top 20 glass processors in Europe. The same precision engineering proven on landmark projects across the continent is now focused on a single mission: supplying precision rail-grade glass to the region\'s modernizing fleet operators.',
      'story.p2': '<strong>Why now.</strong> Romania\'s rail network is in the middle of its largest modernization in decades. CFR C&#259;l&#259;tori is introducing new Alstom Coradia Stream electric trainsets and Traxx locomotives. Bucharest\'s STB has deployed new trams and has contracted dozens more. Every new rolling stock delivery and refurbishment programme has one non-negotiable requirement: engineered, dimensionally exact glass delivered on a dependable schedule.',
      'story.p3': '<strong>The challenge operators face.</strong> Rail glass must survive thermal cycling, vibration, impact and decades of daily duty &mdash; while meeting non-negotiable European standards: EN&nbsp;15152 for windscreens, EN&nbsp;15153 for side and door glass, EN&nbsp;12600 for impact performance. A single compliance gap or a slipped delivery can hold an entire vehicle in the workshop. Operators need a partner that treats glass as a precision component, not a commodity.',
      'story.p4': '<strong>The VAGOTECH advantage.</strong> In-house tempering, lamination, curved shaping and custom edge work mean no outsourcing and no compromises. We engineer to exact OEM and operator specifications, document full compliance, and deliver in 4–6 weeks &mdash; against the industry standard of 12–16 weeks from larger European suppliers. European quality, regional proximity, single-supplier accountability.',
      'market.h2': 'Why VAGOTECH Exists',
      'market.subtitle': 'Serving the railway modernization programmes driving today\'s demand',
      'market.cfr.h3': 'CFR Fleet Renewal',
      'market.cfr.p': 'CFR C&#259;l&#259;tori is introducing Alstom Coradia Stream EMUs and Traxx locomotives under EU-funded PNRR programmes. 139+ wagons in active refurbishment cycles create sustained demand for precision replacement glazing on existing fleets.',
      'market.stb.h3': 'STB & Urban Transit',
      'market.stb.p': 'Bucharest\'s STB has contracted new 36-metre trams and runs a 323-tram V3A-M refurbishment programme. Budapest, Belgrade and Sofia operate parallel urban transit modernization. Each vehicle needs side, door and windscreen glass on a reliable schedule.',
      'market.oem.h3': 'Domestic OEM Supply',
      'market.oem.p': 'Romanian builders Electroputere VFU Pa&#537;cani and Astra Vagoane Arad assemble rolling stock for domestic and export markets. OEMs need a glass partner with full EN documentation, in-house production and fast lead times. VAGOTECH is purpose-built for that role.',
      'products.h2': 'VAGOTECH Product Solutions',
      'products.subtitle': 'Purpose-built glass for every railway application — engineered to EN standards and delivered on schedule.',
      'prod.ws.h3': 'Windscreen Glass',
      'prod.ws.challenge': '<strong>The challenge:</strong> Driver cab windscreens on locomotives and EMUs need crystal clarity, must withstand temperature extremes, resist high-energy impacts from ballast and debris, and hold structural integrity across decades of service.',
      'prod.ws.solution': '<strong>VAGOTECH solution:</strong> Laminated, heat-strengthened glass engineered to EN&nbsp;15152. Custom curvature to OEM cab geometry. Optional heating layer for de-icing, UV-protective and acoustic interlayers.',
      'prod.ws.spec1': '<strong>Standard:</strong> EN&nbsp;15152 (rail windscreens)',
      'prod.ws.spec2': '<strong>Type:</strong> Laminated + heat-strengthened',
      'prod.ws.spec3': '<strong>Options:</strong> Heated / de-icing layer',
      'prod.ws.spec4': '<strong>Impact:</strong> High-energy ballast impact resistant',
      'prod.ws.spec5': '<strong>Acoustic:</strong> Noise-reduction interlayer',
      'prod.ws.spec6': '<strong>Lead Time:</strong> 4–6 weeks standard',
      'prod.sd.h3': 'Passenger Side & Door Glass',
      'prod.sd.challenge': '<strong>The challenge:</strong> Passenger and door windows face constant thermal cycling and vibration while carrying comfort and safety expectations — clarity, noise reduction, and certified impact behaviour. Trams and coaches run these windows for decades.',
      'prod.sd.solution': '<strong>VAGOTECH solution:</strong> Tempered or laminated glazing to EN&nbsp;15153 and EN&nbsp;12600 impact class. Custom dimensions, curves and angles for any car type.',
      'prod.sd.spec1': '<strong>Standard:</strong> EN&nbsp;15153 + EN&nbsp;12600',
      'prod.sd.spec2': '<strong>Type:</strong> Tempered or laminated',
      'prod.sd.spec3': '<strong>Dimensions:</strong> Custom curves and angles',
      'prod.sd.spec4': '<strong>Acoustic:</strong> Noise-reduction interlayer',
      'prod.sd.spec5': '<strong>Coatings:</strong> Easy-clean / low-maintenance',
      'prod.sd.spec6': '<strong>Lead Time:</strong> 4–6 weeks standard',
      'prod.int.h3': 'Interior & Partition Glass',
      'prod.int.challenge': '<strong>The challenge:</strong> Interior partitions, crew screens and emergency windows need certified impact resistance, durability and low maintenance — while meeting fire and smoke requirements that are increasingly enforced across EU rolling stock.',
      'prod.int.solution': '<strong>VAGOTECH solution:</strong> Tempered or laminated interior glass to EN&nbsp;12600 impact classification. Clear, frosted or tinted finishes. Anti-scratch coatings. Lightweight builds for vehicle efficiency.',
      'prod.int.spec1': '<strong>Standard:</strong> EN&nbsp;12600',
      'prod.int.spec2': '<strong>Finishes:</strong> Clear, frosted, tinted',
      'prod.int.spec3': '<strong>Impact:</strong> Classified safety behaviour',
      'prod.int.spec4': '<strong>Coatings:</strong> Anti-scratch, easy-clean',
      'prod.int.spec5': '<strong>Weight:</strong> Optimised for vehicle efficiency',
      'prod.int.spec6': '<strong>Lead Time:</strong> 4–6 weeks standard',
      'prod.cust.h3': 'Custom Rail Solutions',
      'prod.cust.challenge': '<strong>The challenge:</strong> Specialised applications — roof glazing, observation windows, emergency exits, curved destination panels — each with unique geometry and OEM specifications, often under tight refurbishment budgets and timelines.',
      'prod.cust.solution': '<strong>VAGOTECH solution:</strong> Full engineering consultation from drawing to delivery. Any shape, size or build. Documented testing and compliance. Dedicated project management for fleet-scale orders.',
      'prod.cust.spec1': '<strong>Engineering:</strong> Design to OEM / operator specs',
      'prod.cust.spec2': '<strong>Builds:</strong> Tempered, laminated, curved, coated',
      'prod.cust.spec3': '<strong>Compliance:</strong> Full EN documentation',
      'prod.cust.spec4': '<strong>Expertise:</strong> 25+ years glass engineering',
      'prod.cust.spec5': '<strong>Capacity:</strong> Fleet-scale orders accommodated',
      'prod.cust.spec6': '<strong>Lead Time:</strong> 5–8 weeks custom projects',
      'comp.h2': 'Why VAGOTECH Over Larger Suppliers?',
      'comp.subtitle': 'Speed, compliance, and proximity — the three things that matter when a vehicle is in the workshop',
      'comp.th.criteria': 'Criteria', 'comp.th.large': 'Large EU Suppliers', 'comp.th.dist': 'Specialist Distributors',
      'comp.row1.label': 'Delivery lead time', 'comp.row1.large': '12–16 weeks', 'comp.row1.dist': '10–14 weeks', 'comp.row1.vago': '4–6 weeks ✓',
      'comp.row2.label': 'AFER Certification', 'comp.row2.vago': '✓ AFER certified manufacturer',
      'comp.row3.label': 'EN 15152 / 15153 / 12600', 'comp.row3.vago': '✓ Compliant builds',
      'comp.row4.label': 'In-house tempering & lamination', 'comp.row4.dist': 'Partial', 'comp.row4.vago': '✓ Full in-house',
      'comp.row5.label': 'Custom curvature & geometry', 'comp.row5.dist': 'Limited', 'comp.row5.vago': '✓ Any geometry',
      'comp.row6.label': 'Manufacturing location (RO/DE/US)', 'comp.row6.large': '✗ UK / FR', 'comp.row6.dist': '✗ SE / UK', 'comp.row6.vago': '✓ Pope&#537;ti-Leordeni, Romania',
      'comp.row7.label': 'Minimum order flexibility', 'comp.row7.large': 'High minimums', 'comp.row7.dist': 'Medium', 'comp.row7.vago': '✓ Pilot orders accepted',
      'comp.row8.label': 'Single supplier accountability', 'comp.row8.large': 'Distributor network', 'comp.row8.dist': 'Distributor network', 'comp.row8.vago': '✓ Direct manufacturer',
      'comp.disclaimer': 'Comparison reflects typical industry lead times and supply-chain characteristics; individual projects vary. VAGOTECH glass is engineered to European (EN) railway standards. For North American projects, applicable standards (e.g. APTA, 49 CFR) are addressed per project specification. Confirm compliance documentation at inquiry.',
      'cred.h2': 'The Glas Expert Pedigree Behind VAGOTECH',
      'cred.subtitle': '25+ Years. Top 20 in Europe. Award-Winning Engineering — Now Applied to Rail.',
      'cred.reddot.h3': 'Red Dot Award 2025',
      'cred.reddot.p': 'Glas Expert\'s VERSATIKA system won the Red Dot Award 2025 for product design. The engineering discipline that earns international design recognition is the same that defines every VAGOTECH rail component — precision first, no compromise.',
      'cred.projects.h3': 'Proven on Landmark Projects',
      'cred.projects.p': 'From Roland Garros Paris to FUTURIUM Berlin, Therme, SKANSKA and ING — Glas Expert glass performs where tolerances are tightest. VAGOTECH brings that same in-house tempering, lamination and curving capability to rolling stock.',
      'cred.stat1': 'Years of glass engineering', 'cred.stat2': 'Glass processor in Europe',
      'cred.stat3': 'Delivery (vs. 12–16 industry avg.)', 'cred.stat4': 'AFER certified · EU rail standards',
      'compl.h2': 'Engineering & Compliance',
      'compl.subtitle': 'All VAGOTECH glass is engineered and documented to the standards that matter for EU railway tendering',
      'compl.en15152.p': 'Glass for driver-cab windscreens on rail vehicles',
      'compl.en15153.p': 'Glass for windows and doors on rail vehicles',
      'compl.en12600.p': 'Pendulum impact test & safety classification',
      'compl.en45545.label': 'Mandatory Romania Certification',
      'compl.en45545.p': 'AFER certified and authorized — the only AFER-certified railway glass manufacturer in Romania',
      'compl.thermal.h4': 'Thermal Testing',
      'compl.thermal.p': 'Temperature cycling and thermal shock resistance for rail duty cycles',
      'compl.acoustic.h4': 'Acoustic Performance',
      'compl.acoustic.p': 'Noise-reduction interlayers — passenger comfort and EN acoustic targets',
      'cta.h2': 'Ready to Source Certified Rail Glass?',
      'cta.p': 'Tell us your vehicle type and glass application — we\'ll respond with a specification and lead time within 24 hours.',
      'cta.btn': 'Request Technical Consultation',
      'form.h3': 'VAGOTECH Inquiry', 'form.subtitle': 'We respond within 24 hours',
      'form.org.label': 'Organization *', 'form.org.placeholder': 'CFR, STB, Electroputere, OEM, or operator name',
      'form.name.label': 'Contact Name *', 'form.email.label': 'Email *',
      'form.phone.label': 'Phone', 'form.phone.placeholder': 'Optional but recommended',
      'form.app.label': 'Application *', 'form.app.select': '-- Select --',
      'form.app.windscreen': 'Windscreen glass (EN 15152)', 'form.app.sidedoor': 'Side & door glass (EN 15153)',
      'form.app.interior': 'Interior & partitions (EN 12600)', 'form.app.custom': 'Custom / multiple applications',
      'form.req.label': 'Glass Requirements *',
      'form.req.placeholder': 'Vehicle type (locomotive, EMU, tram, wagon), glass application, approx. dimensions or drawing reference, vehicle count, target delivery timeline...',
      'form.vol.label': 'Estimated Order Volume *', 'form.vol.select': '-- Select --',
      'form.privacy': 'I have read and acknowledge the <a href="privacy.html" style="color:var(--accent-current);">privacy policy</a> and data handling *',
      'form.submit': 'Request Consultation',
      'res.h2': 'VAGOTECH Resources', 'res.subtitle': 'Technical presentation and contact list for your procurement process',
      'res.pres.h3': 'VAGOTECH Presentation',
      'res.pres.p': '10-slide technical presentation for client meetings and procurement teams. Print to PDF directly from browser.',
      'res.pres.btn': 'Open Presentation',
      'footer.vagotech.h4': 'VAGOTECH',
      'footer.vagotech.p': 'Railway and tramway glass solutions by Glas Expert — European engineering for rail excellence.',
      'footer.tagline': 'From Better to Best.',
      'footer.contact.h4': 'Contact', 'footer.solutions.h4': 'Solutions',
      'footer.sol.ws': 'Windscreen Glass', 'footer.sol.sd': 'Side & Door Glass',
      'footer.sol.int': 'Interior & Partitions', 'footer.sol.cust': 'Custom Rail Solutions',
      'footer.sol.privacy': 'Privacy Policy',
      'footer.copyright': '© 2026 VAGOTECH by Glas Expert. All rights reserved.  |  EN 15152  ·  EN 15153  ·  EN 12600',
    },

    ro: {
      'nav.home': 'Acasă', 'nav.products': 'Produse', 'nav.compliance': 'Conformitate',
      'nav.about': 'Despre', 'nav.cta': 'Solicită Specificații',
      'hero.eyebrow': 'EN 15152 · EN 15153 · EN 12600 · AFER',
      'hero.h1': 'VAGOTECH — Sticlă pentru Material Rulant',
      'hero.subtitle': 'Inginerie de precizie. Livrat în 4–6 săptămâni.',
      'hero.body': 'Sticlă de calitate feroviară pentru CFR, STB, Electroputere și Astra Vagoane — proiectată conform standardelor europene de siguranță, produsă integral în fabrică proprie și livrată pe un calendar previzibil, pe care planificatorii de flotă se pot baza. 25+ ani de experiență în ingineria sticlei, de la unul din primii 20 de producători europeni. Singurul producător de sticlă feroviară omologat și autorizat AFER din România.',
      'hero.btn.explore': 'Explorează Soluțiile', 'hero.btn.request': 'Solicită Specificații',
      'hero.stat.weeks': 'Săptămâni livrare', 'hero.stat.years': 'Ani experiență',
      'hero.stat.top20': 'Producător EU sticlă', 'hero.stat.en45545': 'Omologat AFER',
      'strip.en15152': 'EN 15152 Parbrize', 'strip.en15153': 'EN 15153 Geam lateral și ușă',
      'strip.en12600': 'EN 12600 Siguranță la impact', 'strip.en45545': 'Omologat AFER România',
      'strip.inhouse': 'Călit și laminat în fabrică proprie',
      'story.h2': 'Povestea VAGOTECH',
      'story.subtitle': 'Sticlă inginerată în Europa pentru o rețea feroviară în modernizare accelerată',
      'story.p1': 'VAGOTECH este divizia de material rulant a <strong>Glas Expert</strong> &mdash; producător european de sticlă arhitecturală cu peste 25 de ani de experiență și un loc printre primii 20 de procesatori de sticlă din Europa. Aceeași inginerie de precizie dovedită pe proiecte de referință de pe continent este acum concentrată pe o singură misiune: furnizarea de sticlă de calitate feroviară pentru operatorii care modernizează flota regională.',
      'story.p2': '<strong>De ce acum.</strong> Rețeaua feroviară a României traversează cea mai mare modernizare din ultimele decenii. CFR C&#259;l&#259;tori introduce noi garnituri electrice Alstom Coradia Stream și locomotive Traxx. STB București a pus în circulație tramvaie noi și a contractat zeci în plus. Fiecare livrare de material rulant nou și program de retehnologizare are un singur numitor comun: sticlă dimensionată exact, livrată în termen previzibil.',
      'story.p3': '<strong>Provocarea cu care se confruntă operatorii.</strong> Sticla feroviară trebuie să reziste la cicluri termice, vibrații, impact și zeci de ani de serviciu zilnic &mdash; respectând simultan standarde europene obligatorii: EN&nbsp;15152 pentru parbrize, EN&nbsp;15153 pentru geamuri laterale și uși, EN&nbsp;12600 pentru performanța la impact. Un singur gap de conformitate sau o întârziere de livrare poate bloca un vehicul întreg în atelier. Operatorii au nevoie de un partener care tratează sticla ca pe o componentă de precizie, nu ca pe o marfă.',
      'story.p4': '<strong>Avantajul VAGOTECH.</strong> Călirea, laminarea, curbarea și prelucrarea muchiilor integral în fabrică proprie înseamnă zero subcontractare și zero compromisuri. Proiectăm la specificațiile exacte OEM și operator, documentăm conformitatea completă și livrăm în 4–6 săptămâni &mdash; față de 12–16 săptămâni de la furnizorii europeni mari. Calitate europeană, proximitate regională, responsabilitate furnizor unic.',
      'market.h2': 'De Ce Există VAGOTECH',
      'market.subtitle': 'Servind programele de modernizare feroviară care generează cererea actuală',
      'market.cfr.h3': 'Reînnoirea Flotei CFR',
      'market.cfr.p': 'CFR C&#259;l&#259;tori introduce unități Alstom Coradia Stream și locomotive Traxx prin programele PNRR cu finanțare UE. Peste 139 de vagoane în cicluri active de retehnologizare generează o cerere susținută de geamuri de înlocuire de precizie pe flota existentă.',
      'market.stb.h3': 'STB și Transport Urban',
      'market.stb.p': 'STB București a contractat tramvaie noi de 36 de metri și derulează un program de retehnologizare pentru 323 de tramvaie V3A-M. Budapesta, Belgradul și Sofia operează programe paralele de modernizare a transportului urban. Fiecare vehicul necesită geam lateral, de ușă și parbriz pe un calendar fiabil.',
      'market.oem.h3': 'Furnizor OEM Intern',
      'market.oem.p': 'Producătorii români Electroputere VFU Pa&#537;cani și Astra Vagoane Arad asamblează material rulant pentru piața internă și la export. OEM-urile au nevoie de un partener pentru sticlă cu documentație EN completă, producție proprie și termene rapide. VAGOTECH este construit special pentru acest rol.',
      'products.h2': 'Soluțiile de Produs VAGOTECH',
      'products.subtitle': 'Sticlă special concepută pentru orice aplicație feroviară — proiectată conform standardelor EN și livrată la termen.',
      'prod.ws.h3': 'Geam Parbriz',
      'prod.ws.challenge': '<strong>Provocarea:</strong> Parbrize cabina mecanicului la locomotive și EMU-uri necesită claritate perfectă, trebuie să reziste la temperature extreme, să suporte impacturi cu energie ridicată de la balast și resturi, și să-și mențină integritatea structurală pe parcursul a zeci de ani de serviciu.',
      'prod.ws.solution': '<strong>Soluția VAGOTECH:</strong> Sticlă laminată, termoîntărită, proiectată conform EN&nbsp;15152. Curbură personalizată la geometria cabinei OEM. Strat de încălzire opțional pentru dezghețare, folii de protecție UV și acustice.',
      'prod.ws.spec1': '<strong>Standard:</strong> EN&nbsp;15152 (parbrize feroviare)',
      'prod.ws.spec2': '<strong>Tip:</strong> Laminat + termoîntărit',
      'prod.ws.spec3': '<strong>Opțiuni:</strong> Strat încălzitor / dezghețare',
      'prod.ws.spec4': '<strong>Impact:</strong> Rezistent la impact cu balast cu energie ridicată',
      'prod.ws.spec5': '<strong>Acustic:</strong> Folie reducere zgomot',
      'prod.ws.spec6': '<strong>Termen livrare:</strong> 4–6 săptămâni standard',
      'prod.sd.h3': 'Geam Lateral și Ușă Pasageri',
      'prod.sd.challenge': '<strong>Provocarea:</strong> Geamurile de pasageri și de ușă sunt supuse permanent la cicluri termice și vibrații, în timp ce trebuie să răspundă așteptărilor de confort și siguranță — claritate, reducerea zgomotului și comportament la impact conform. Tramvaiele și vagoanele rulează cu aceste geamuri timp de decenii.',
      'prod.sd.solution': '<strong>Soluția VAGOTECH:</strong> Sticlă securizată sau laminată conform EN&nbsp;15153 și clasă de impact EN&nbsp;12600. Dimensiuni, curbe și unghiuri personalizate pentru orice tip de vehicul.',
      'prod.sd.spec1': '<strong>Standard:</strong> EN&nbsp;15153 + EN&nbsp;12600',
      'prod.sd.spec2': '<strong>Tip:</strong> Securizat sau laminat',
      'prod.sd.spec3': '<strong>Dimensiuni:</strong> Curbe și unghiuri personalizate',
      'prod.sd.spec4': '<strong>Acustic:</strong> Folie reducere zgomot',
      'prod.sd.spec5': '<strong>Acoperiri:</strong> Ușor de curățat / întreținere redusă',
      'prod.sd.spec6': '<strong>Termen livrare:</strong> 4–6 săptămâni standard',
      'prod.int.h3': 'Geam Interior și Partiții',
      'prod.int.challenge': '<strong>Provocarea:</strong> Pereții despărțitori interiori, panourile de separare echipaj-pasageri și ferestrele de urgență necesită rezistență la impact, durabilitate și întreținere redusă — respectând simultan cerințele de foc și fum, din ce în ce mai strict aplicate la materialul rulant UE.',
      'prod.int.solution': '<strong>Soluția VAGOTECH:</strong> Sticlă interioară securizată sau laminată conform clasificării la impact EN&nbsp;12600. Finisaje clare, sablate sau nuanțate. Acoperiri anti-zgâriere. Execuții ușoare pentru eficiența vehiculului.',
      'prod.int.spec1': '<strong>Standard:</strong> EN&nbsp;12600',
      'prod.int.spec2': '<strong>Finisaje:</strong> Clar, sablat, nuanțat',
      'prod.int.spec3': '<strong>Impact:</strong> Comportament la siguranță clasificat',
      'prod.int.spec4': '<strong>Acoperiri:</strong> Anti-zgâriere, ușor de curățat',
      'prod.int.spec5': '<strong>Greutate:</strong> Optimizat pentru eficiența vehiculului',
      'prod.int.spec6': '<strong>Termen livrare:</strong> 4–6 săptămâni standard',
      'prod.cust.h3': 'Soluții Feroviare Personalizate',
      'prod.cust.challenge': '<strong>Provocarea:</strong> Aplicații specializate — vitraje de acoperiș, ferestre de observație, ieșiri de urgență, panouri de destinație curbate — fiecare cu geometrie unică și specificații OEM, adesea sub constrângeri bugetare și termene strânse de retehnologizare.',
      'prod.cust.solution': '<strong>Soluția VAGOTECH:</strong> Consultanță de inginerie completă de la desen la livrare. Orice formă, dimensiune sau execuție. Testare documentată și conformitate. Management de proiect dedicat pentru comenzi la scară de flotă.',
      'prod.cust.spec1': '<strong>Inginerie:</strong> Proiectare conform specificațiilor OEM / operator',
      'prod.cust.spec2': '<strong>Execuții:</strong> Securizat, laminat, curbat, acoperit',
      'prod.cust.spec3': '<strong>Conformitate:</strong> Documentație EN completă',
      'prod.cust.spec4': '<strong>Expertiză:</strong> 25+ ani inginerie sticlă',
      'prod.cust.spec5': '<strong>Capacitate:</strong> Comenzi la scară de flotă acceptate',
      'prod.cust.spec6': '<strong>Termen livrare:</strong> 5–8 săptămâni proiecte personalizate',
      'comp.h2': 'De Ce VAGOTECH față de Furnizori Mai Mari?',
      'comp.subtitle': 'Viteză, conformitate și proximitate — cele trei lucruri care contează când un vehicul stă în atelier',
      'comp.th.criteria': 'Criteriu', 'comp.th.large': 'Furnizori Majori UE', 'comp.th.dist': 'Distribuitori Specializați',
      'comp.row1.label': 'Termen de livrare', 'comp.row1.large': '12–16 săptămâni', 'comp.row1.dist': '10–14 săptămâni', 'comp.row1.vago': '4–6 săptămâni ✓',
      'comp.row2.label': 'Omologare AFER', 'comp.row2.vago': '✓ Omologat AFER România',
      'comp.row3.label': 'EN 15152 / 15153 / 12600', 'comp.row3.vago': '✓ Execuții conforme',
      'comp.row4.label': 'Călit și laminat integral intern', 'comp.row4.dist': 'Parțial', 'comp.row4.vago': '✓ Integral intern',
      'comp.row5.label': 'Curbură și geometrie personalizată', 'comp.row5.dist': 'Limitat', 'comp.row5.vago': '✓ Orice geometrie',
      'comp.row6.label': 'Locație fabricație (RO/DE/US)', 'comp.row6.large': '✗ UK / FR', 'comp.row6.dist': '✗ SE / UK', 'comp.row6.vago': '✓ Pope&#537;ti-Leordeni, România',
      'comp.row7.label': 'Flexibilitate comandă minimă', 'comp.row7.large': 'Minime ridicate', 'comp.row7.dist': 'Medii', 'comp.row7.vago': '✓ Comenzi pilot acceptate',
      'comp.row8.label': 'Responsabilitate furnizor unic', 'comp.row8.large': 'Rețea distribuitori', 'comp.row8.dist': 'Rețea distribuitori', 'comp.row8.vago': '✓ Producător direct',
      'comp.disclaimer': 'Comparația reflectă termene tipice de livrare și caracteristici de lanț de aprovizionare; proiectele individuale variază. Sticla VAGOTECH este proiectată conform standardelor europene feroviare (EN). Pentru proiectele nord-americane, standardele aplicabile (ex. APTA, 49 CFR) sunt tratate per specificație de proiect. Confirmați documentația de conformitate la solicitare.',
      'cred.h2': 'Expertiza Glas Expert din Spatele VAGOTECH',
      'cred.subtitle': '25+ Ani. Top 20 în Europa. Inginerie Premiată — Acum Aplicată în Domeniul Feroviar.',
      'cred.reddot.h3': 'Premiul Red Dot 2025',
      'cred.reddot.p': 'Sistemul VERSATIKA al Glas Expert a câștigat Premiul Red Dot 2025 pentru design de produs. Disciplina de inginerie care câștigă recunoaștere internațională în design este aceeași care definește fiecare componentă feroviară VAGOTECH — precizie înainte de toate, fără compromisuri.',
      'cred.projects.h3': 'Dovedit pe Proiecte de Referință',
      'cred.projects.p': 'De la Roland Garros Paris la FUTURIUM Berlin, Therme, SKANSKA și ING — sticla Glas Expert performează acolo unde toleranțele sunt cele mai stricte. VAGOTECH aduce aceeași capacitate de călit, laminare și curbare internă la materialul rulant.',
      'cred.stat1': 'Ani de inginerie a sticlei', 'cred.stat2': 'Producător sticlă în Europa',
      'cred.stat3': 'Livrare (față de 12–16 medie industrie)', 'cred.stat4': 'Omologat AFER · Standarde EN feroviare',
      'compl.h2': 'Inginerie și Conformitate',
      'compl.subtitle': 'Toată sticla VAGOTECH este proiectată și documentată conform standardelor relevante pentru licitațiile feroviare UE',
      'compl.en15152.p': 'Sticlă pentru parbrize cabina mecanicului la vehicule feroviare',
      'compl.en15153.p': 'Sticlă pentru ferestre și uși la vehicule feroviare',
      'compl.en12600.p': 'Test de impact cu pendulul și clasificare de siguranță',
      'compl.en45545.label': 'Omologare Obligatorie România',
      'compl.en45545.p': 'Omologat și autorizat AFER — singurul producător de sticlă feroviară omologat AFER din România',
      'compl.thermal.h4': 'Testare Termică',
      'compl.thermal.p': 'Rezistență la ciclu termic și șoc termic pentru ciclurile de serviciu feroviar',
      'compl.acoustic.h4': 'Performanță Acustică',
      'compl.acoustic.p': 'Folii de reducere a zgomotului — confort pasageri și obiective acustice EN',
      'cta.h2': 'Gata să Aprovizionați Sticlă Feroviară de Calitate?',
      'cta.p': 'Spuneți-ne tipul vehiculului și aplicația de sticlă — vă răspundem cu o specificație și termen de livrare în 24 de ore.',
      'cta.btn': 'Solicită Consultanță Tehnică',
      'form.h3': 'Cerere VAGOTECH', 'form.subtitle': 'Răspundem în 24 de ore',
      'form.org.label': 'Organizație *', 'form.org.placeholder': 'CFR, STB, Electroputere, OEM sau numele operatorului',
      'form.name.label': 'Persoană de contact *', 'form.email.label': 'Email *',
      'form.phone.label': 'Telefon', 'form.phone.placeholder': 'Opțional, recomandat',
      'form.app.label': 'Aplicație *', 'form.app.select': '-- Selectați --',
      'form.app.windscreen': 'Geam parbriz (EN 15152)', 'form.app.sidedoor': 'Geam lateral și ușă (EN 15153)',
      'form.app.interior': 'Geam interior și partiții (EN 12600)', 'form.app.custom': 'Personalizat / aplicații multiple',
      'form.req.label': 'Cerințe sticlă *',
      'form.req.placeholder': 'Tipul vehiculului (locomotivă, EMU, tramvai, vagon), aplicația de sticlă, dimensiuni aproximative sau referință desen, număr vehicule, termen de livrare dorit...',
      'form.vol.label': 'Volum estimat comandă *', 'form.vol.select': '-- Selectați --',
      'form.privacy': 'Am citit și accept <a href="privacy.html" style="color:var(--accent-current);">politica de confidențialitate</a> și prelucrarea datelor *',
      'form.submit': 'Solicită Consultanță',
      'res.h2': 'Resurse VAGOTECH', 'res.subtitle': 'Prezentare tehnică pentru procesul dumneavoastră de achiziție',
      'res.pres.h3': 'Prezentare VAGOTECH',
      'res.pres.p': 'Prezentare tehnică în 10 slide-uri pentru întâlniri cu clienți și echipe de achiziții. Printare în PDF direct din browser.',
      'res.pres.btn': 'Deschide Prezentarea',
      'footer.vagotech.h4': 'VAGOTECH',
      'footer.vagotech.p': 'Soluții de sticlă feroviară și pentru tramvai de la Glas Expert — inginerie europeană pentru excelență în domeniul feroviar.',
      'footer.tagline': 'De la Mai Bine la Cel Mai Bun.',
      'footer.contact.h4': 'Contact', 'footer.solutions.h4': 'Soluții',
      'footer.sol.ws': 'Geam Parbriz', 'footer.sol.sd': 'Geam Lateral și Ușă',
      'footer.sol.int': 'Interior și Partiții', 'footer.sol.cust': 'Soluții Feroviare Personalizate',
      'footer.sol.privacy': 'Politică de Confidențialitate',
      'footer.copyright': '© 2026 VAGOTECH by Glas Expert. Toate drepturile rezervate.  |  EN 15152  ·  EN 15153  ·  EN 12600',
    }
  };

  function applyLang(lang) {
    var d = DICT[lang];
    if (!d) return;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = d[el.getAttribute('data-i18n')];
      if (v !== undefined) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = d[el.getAttribute('data-i18n-html')];
      if (v !== undefined) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var v = d[el.getAttribute('data-i18n-placeholder')];
      if (v !== undefined) el.setAttribute('placeholder', v);
    });
    document.documentElement.setAttribute('lang', lang);
    var btn = document.getElementById('langToggle');
    if (btn) btn.textContent = lang === 'en' ? 'RO' : 'EN';
    try { localStorage.setItem('vagotech-lang', lang); } catch (e) {}
  }

  function toggle() {
    var cur = 'en';
    try { cur = localStorage.getItem('vagotech-lang') || 'en'; } catch (e) {}
    applyLang(cur === 'en' ? 'ro' : 'en');
  }

  function init() {
    var saved = 'en';
    try { saved = localStorage.getItem('vagotech-lang') || 'en'; } catch (e) {}
    if (saved !== 'en') applyLang(saved);
    var btn = document.getElementById('langToggle');
    if (btn) btn.textContent = saved === 'en' ? 'RO' : 'EN';
  }

  window.vagotechI18n = { toggle: toggle, apply: applyLang };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
