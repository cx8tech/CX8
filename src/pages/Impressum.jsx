export default function Impressum() {
  return (
    <div className="legal-page">
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="page-hero-eyebrow">Rechtliches</div>
          <h1 className="page-hero-title">Impressum</h1>
          <p className="page-hero-sub">Angaben gemäß § 5 TMG (Telemediengesetz)</p>
        </div>
      </div>
      <div className="legal-body">
      <div className="legal-inner">

        <section className="legal-section">
          <h2>1. Kontaktdaten</h2>
          <table className="legal-info-table">
            <tbody>
              <tr><td>Name</td><td>Deepthi Jayaprakash</td></tr>
              <tr><td>Unternehmen</td><td>CX8 Technologies</td></tr>
              <tr><td>Adresse</td><td>Anselmstraße 12, 73760 Ostfildern, Deutschland</td></tr>
              <tr><td>Telefon</td><td>017637897016</td></tr>
              <tr><td>E-Mail</td><td><a href="mailto:info@cx8technologies.com">info@cx8technologies.com</a></td></tr>
              <tr><td>Website</td><td>www.cx8technologies.com</td></tr>
            </tbody>
          </table>
        </section>

        <section className="legal-section">
          <h2>2. Steuernummer</h2>
          <p>Steuernummer: <em>Beantragt</em> — wird nach Zuteilung durch das Finanzamt ergänzt.</p>
          <p className="legal-note">Die Steuernummer wird innerhalb von 4–8 Wochen nach der Gewerbeanmeldung zugewiesen.</p>
        </section>

        <section className="legal-section">
          <h2>3. Berufsbezeichnung</h2>
          <p>CX8 Technologies ist ein Einzelunternehmen mit Sitz in Ostfildern, Baden-Württemberg. Tätigkeitsschwerpunkt: Entwicklung und Vertrieb digitaler Ingenieurwerkzeuge sowie Content Creation. Die Tätigkeit unterliegt keinen besonderen berufsrechtlichen Regelungen.</p>
        </section>

        <section className="legal-section">
          <h2>4. Haftungsausschluss</h2>

          <h3>4.1 Haftung für Inhalte</h3>
          <p>Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte nach den allgemeinen Gesetzen verantwortlich.</p>

          <h3>4.2 Haftung für Engineering-Berechnungen</h3>
          <p>Die Berechnungstools auf dieser Website dienen ausschließlich als unverbindliche Orientierungshilfe. Sie ersetzen nicht die Beratung durch qualifizierte Ingenieure oder die Überprüfung anhand aktueller Herstellerdatenblätter.</p>
          <p>CX8 Technologies übernimmt keine Haftung für:</p>
          <ul>
            <li>Technische Entscheidungen auf Basis der Berechnungsergebnisse</li>
            <li>Schäden durch die Verwendung nicht verifizierter Ergebnisse</li>
            <li>Abweichungen zwischen Website-Daten und aktuellen Herstellerspezifikationen</li>
          </ul>
          <p>Alle Ergebnisse sind vor der Umsetzung durch qualifizierte Fachkräfte zu verifizieren.</p>

          <h3>4.3 Haftung für Links</h3>
          <p>Für Inhalte verlinkter externer Websites übernehmen wir keine Haftung. Für die Inhalte externer Seiten ist der jeweilige Anbieter verantwortlich.</p>
        </section>

        <section className="legal-section">
          <h2>5. Urheberrecht</h2>
          <p>Die durch CX8 Technologies erstellten Inhalte unterliegen dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung oder Verbreitung bedürfen der schriftlichen Zustimmung. Technische Spezifikationsdaten stammen aus öffentlich zugänglichen Herstellerdatenblättern.</p>
        </section>

        <section className="legal-section">
          <h2>6. Online-Streitschlichtung</h2>
          <p>Die EU-Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a></p>
          <p>Wir nehmen nicht an Streitbeilegungsverfahren vor Verbraucherschlichtungsstellen teil.</p>
        </section>

        <section className="legal-section legal-section-en">
          <h2>Legal Notice (English)</h2>
          <table className="legal-info-table">
            <tbody>
              <tr><td>Name</td><td>Deepthi Jayaprakash</td></tr>
              <tr><td>Business</td><td>CX8 Technologies</td></tr>
              <tr><td>Address</td><td>Anselmstraße 12, 73760 Ostfildern, Germany</td></tr>
              <tr><td>Phone</td><td>017637897016</td></tr>
              <tr><td>Email</td><td><a href="mailto:info@cx8technologies.com">info@cx8technologies.com</a></td></tr>
            </tbody>
          </table>
          <p>CX8 Technologies provides engineering calculation tools for guidance purposes only. All results must be verified by qualified engineers before implementation. CX8 Technologies accepts no liability for decisions made on the basis of these tools.</p>
        </section>

        <p className="legal-stand">Stand: Juli 2026</p>
      </div>
      </div>
    </div>
  )
}
