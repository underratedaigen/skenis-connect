# Atsiliepimų sistema

Vieša dalis: `/atsiliepimai`, pagrindinio puslapio pasitikėjimo sekcija ir bendras kortelių komponentas. Jei nėra patvirtintų įrašų, rodome darbo principus; nėra tuščio „Ką sako klientai“ bloko ar išgalvoto bendro įvertinimo.

Administravimas: `/admin/testimonials` po esamu Supabase Auth / `admin` vaidmens patikrinimu. Naujas tikras įrašas, redagavimas, šaltinis, įvertinimas, teksto išplėtimas, leidimas viešinti, autentiškumo patvirtinimas, išskyrimas pagrindiniame puslapyje, publikavimas ir archyvavimas. Archyvavimas išsaugo įrašą, bet pašalina jį iš viešo rodinio. Sintetinių duomenų importo čia nėra. Tiesioginio atsiliepimo autentiškumą ir leidimą patikrina administratorius; žyma pati savaime nėra kliento tapatybės patvirtinimas.

## Supabase įjungimas

1. Įprastu projekto migracijų procesu pritaikyti `supabase/migrations/202609280001_testimonials.sql` į tą pačią duomenų bazę, kurioje yra ankstesnės migracijos. Esamos QR, užklausų ir autentifikacijos lentelės neliečiamos.
2. Nustatyti `VITE_TESTIMONIALS_ENABLED=true` ir atlikti naują build. Pagal nutylėjimą `false`, todėl svetainė neveikia su neegzistuojančia lentele.
3. Esamas administratorius įrašo tikrą tekstą su šaltiniu. Viešinti galima tik pažymėjus autentiškumo patikrą ir leidimą viešinti. Patikrinti publikavimą ir archyvavimą tikroje administratoriaus sesijoje.

Viešos SELECT taisyklės ir papildomas kliento filtras leidžia tik `published`, `verified`, `consent`, nesintetinius įrašus su neateities data. DB apribojimai atmeta sintetinius įrašus; anoniminis rašymas neleidžiamas. Naujų admin paskyrų ar teisių sistema nesukuria. Bendras įvertinimas skaičiuojamas tik iš patvirtintų tikrų įrašų; JSON-LD netikrų `Review` ar `AggregateRating` nepridedama.

Nuotolinė migracija šiame kodo atnaujinime netaikoma. Prieš produkcinį įjungimą reikia DB integracijos patikros su administratoriaus ir anoniminiu vaidmenimis. Šaltiniai įvedami rankiniu būdu; Google ir Facebook automatinio importo nėra. Viešas sąrašas šiuo metu įkelia iki 1 000 patvirtintų įrašų; filtravimas ir puslapiavimas vyksta naršyklėje. Didesniam kiekiui reikėtų serverinio filtravimo.

## 200 testinių įrašų

`src/data/fixtures/testimonials.synthetic.json` yra tiksliai 200 įrašų. Vardai – `Testinis klientas 001` ir pan.; šaltinis `synthetic`, `synthetic: true`, `verified: false`, `featured: false`, būsena `draft`, leidimas `false`. Yra 10 kategorijų, visi 1–5 įvertinimai, skirtingi teksto ilgiai ir 50 išplėstinių tekstų. Failą atkuria `node scripts/generate-testimonials.mjs`.

Kūrimo aplinkoje paleisti `npm run dev`, atidaryti `/testavimas/atsiliepimai`. Tai noindex puslapis su nuolatine įspėjimo juosta ir žyma kiekvienoje kortelėje. Veikia paieška, paslaugos ir įvertinimo filtrai, rikiavimas, 12 kortelių puslapiai, „Rodyti daugiau“, ilgo teksto atidarymas, tuščia paieška ir klaviatūros valdymas. Testiniai įvertinimai neįtraukiami į klientų vidurkį.

Maršrutas ir jo dinaminis importas uždaryti `import.meta.env.DEV` sąlyga. Produkciniame build ir prerender nėra šių 200 įrašų. `/testavimas/atsiliepimai` produkcijoje atidaro 404. Failas laikomas `src`, ne `public`; jis nesiunčiamas į Supabase ir nėra sitemap.
