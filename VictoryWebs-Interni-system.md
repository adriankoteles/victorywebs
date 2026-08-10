VICTORY WEBS – Agency OS (Technická Specifikace)
1. HLAVNÍ DASHBOARD (Pohled Majitele)
Centrální řídicí panel pro okamžitý přehled o zdraví agentury.
* Rychlé finanční widgety (Klíčové metriky):
    * Celkový historický výdělek (Total Revenue).
    * Měsíční výdělek (Obrat za aktuální měsíc).
    * MRR (Měsíční opakující se příjmy z paušálů).
* Aktivita: Aktuální počet aktivních klientů.
* Revenue Graf: Vizuální křivka růstu obratu za posledních 6–12 měsíců.
* Leaderboard Klientů (LTV - Lifetime Value): Žebříček top klientů seřazených podle toho, kolik u agentury historicky utratili.
* War Room (Urgentní pozornost):
    * Projekty, kterým se blíží deadline.
    * Faktury po splatnosti.
    * Nezpracované požadavky od klientů.
2. SPRÁVA KLIENTŮ (Klientská Databáze)
Vše od první poptávky až po dlouhodobou správu. Údaje se nevyplňují ručně, většinu zadá klient sám v onboardingu.
* Základní přehled: Tabulka s vyhledáváním (podle názvu firmy, jména, IČO nebo ID).
* Klientská Karta (Detail klienta):
    * Autentizace (Systémový přístup):
        * Unikátní systémové ID (Generováno sekvenčně, např. VW-001, VW-002...).
        * 6místný PIN kód (Statický přístupový kód pro klienta, žádná složitá hesla).
    * Identita a Fakturace (Business Info):
        * Název firmy (Auto-vyplněno z ARES podle IČO).
        * Jméno a příjmení hlavní kontaktní osoby.
        * E-mail a telefon.
        * IČO / DIČ.
        * Sídlo firmy / Fakturační adresa.
        * Fakturační e-mail (Pokud je jiný než osobní, např. na účetní).
    * Status a Štítky (Tagy): Onboarding / In Development / Active Monthly / Paused.
    * Technický Hub (Web Info):
        * Odkazy na weby (Hlavní produkční doména + Testovací staging doména).
        * Technické přístupy (Odkaz na GitHub repo, Registrátor domény, Hosting).
        * Odkazy na firemní sociální sítě.
    * Paušální modul (Retainer):
        * Aktivní VC Paušál: ANO/NE.
        * Délka úvazku a den v měsíci, kdy se generuje faktura.
        * Zbývající servisní hodiny (např. stav 0.5 h z celkových 2 h pro tento měsíc).
    * Archiv a Historie: Záznamy z onboardingu, odeslané feedbacky, všechny vystavené faktury a přehled projektů klienta.
3. PROJEKTY (Kanban Pipeline)
Místo pro řízení exekuce. Každý web nebo úprava je samostatný projekt.
* Tvorba projektu:
    * Název projektu.
    * Přiřazení ke konkrétnímu klientovi.
    * Cena za projekt (nebo odečet hodin, pokud jde o paušál).
    * Deadline (Datum odevzdání).
    * Popis zadání.
* Kanban fáze (Pevný workflow):
    * A. Nabídka: Vyjednávání, čeká se na podpis.
    * B. V práci: Aktivní vývoj (kódování, design).
    * C. Hotovo: Odevzdáno klientovi.
    * D. Zaplaceno: Faktura je proplacena (může se přesouvat automaticky po spárování platby).
* Bezpečnost dat: Smazání projektu funguje jako "Soft Delete". Projekt zmizí z hlavní plochy, ale zůstane archivovaný u klienta (vyžaduje ověřovací klik k archivaci).
4. FINANCE A FAKTURY (Real-time Kalkulačka)
Jádro pro čistou hlavu majitele agentury. Přesně víš, co je tvoje a co patří státu.
* Generátor faktur: Tvorba a evidence klientských faktur (včetně generování QR kódů).
* Finanční Widgety:
    * Na cestě (Očekávané příjmy): Celková hodnota vystavených, ale zatím nezaplacených faktur.
    * Obrat (Hrubý příjem): Všechny zaplacené faktury od klientů (včetně DPH).
    * Náklady: Tlačítko [Přidat náklad] (zadá se datum, název položky, částka a % DPH).
    * Daňový štít (DPH k úhradě): Automaticky kalkulovaná částka (DPH z obratu mínus DPH z nákladů). Tohle zůstává mamce na účtu pro finančák.
    * Čistý výdělek: Reálné peníze (Obrat - DPH - Náklady), které patří čistě Victory Webs.
5. KLIENTSKÝ ONBOARDING (Automatizovaný vstup)
Frictionless proces, kterým si klient projde sám po podpisu smlouvy.
* Přihlašovací brána: Animovaný prémiový pozdrav. Přihlášení pouze přes přidělené ID (např. VW-001) a 6místný PIN.
* Právní rámec: Odkliknutí souhlasu se zpracováním údajů (GDPR) a obchodních podmínek.
* Chytrý sběr dat (Auto-fill):
    * Klient zadá IČO $\rightarrow$ Systém sám předvyplní název firmy, DIČ a adresu.
    * Doplní pouze: Jméno, E-mail, Telefon (volitelně) a specifikuje fakturační e-mail.
* Briefing (Dotazník): Otázky na obor firmy, konkurenci a vizuální požadavky na nový web.
* Interní Upsell: Nenásilná reklama/nabídka na „Victory Webs Care“ (Měsíční paušál). I když ho klient nekoupí hned, uvidí ho.
6. KLIENTSKÝ DASHBOARD (Zóna Klienta)
Co vidí klient, když se přihlásí na tvojedomena.cz/id-klienta.
* Status projektů: Vizualizace, v jaké fázi se nachází tvorba jeho webu (Nabídka $\rightarrow$ Vývoj $\rightarrow$ Hotovo).
* Fakturační centrum: Seznam všech jeho faktur (možnost stáhnout PDF nebo zaplatit přes QR).
* Firemní profil: Přehled údajů, které zadal v onboardingu (s možností zažádat o změnu).
* Servisní zóna (Pokud má paušál): Zobrazení zbývajících hodin podpory a možnost odeslat rychlý tiket (požadavek na úpravu webu).
* Upsell okno: Permanentní, ale čistý blok s výhodami měsíční správy webu (pokud paušál ještě nemá).
7. FEEDBACK (Modul pro V2 / Budoucnost)
Bude přidáno v další fázi pro měření spokojenosti a sběr referencí.
* Automatický dotazník po dokončení projektu (Hodnocení rychlosti, komunikace, kvality kódu/designu).
* Dashboard pro majitele s průměrným skóre a slovním hodnocením, které se dá rovnou exportovat jako recenze na web Victory Webs.


