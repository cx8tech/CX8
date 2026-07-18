export default function Datenschutz() {
  return (
    <div className="legal-page">
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="page-hero-eyebrow">Rechtliches</div>
          <h1 className="page-hero-title">Cookie-Richtlinie und Datenschutzerklärung</h1>
          <p className="page-hero-sub">Cookie Policy and Privacy Notice — CX8 Technologies | Gemäß DSGVO / GDPR Art. 13</p>
        </div>
      </div>
      <div className="legal-body">
      <div className="legal-inner">

        <section className="legal-section">
          <h2>1. Wer ist verantwortlich? / Who is responsible?</h2>
          <p>Verantwortlicher gemäß Art. 4 Nr. 7 DSGVO:</p>
          <table className="legal-info-table">
            <tbody>
              <tr><td>Name</td><td>Deepthi Jayaprakash, CX8 Technologies</td></tr>
              <tr><td>Adresse</td><td>Anselmstraße 12, 73760 Ostfildern, Deutschland</td></tr>
              <tr><td>Telefon</td><td>017637897016</td></tr>
              <tr><td>E-Mail</td><td><a href="mailto:info@cx8technologies.com">info@cx8technologies.com</a></td></tr>
              <tr><td>Website</td><td>www.cx8technologies.com</td></tr>
            </tbody>
          </table>
        </section>

        <section className="legal-section">
          <h2>2. Was sind Cookies? / What are cookies?</h2>
          <p>Cookies sind kleine Textdateien, die beim Besuch einer Website auf Ihrem Endgerät (Computer, Smartphone, Tablet) gespeichert werden. Sie ermöglichen es, Ihren Browser beim nächsten Besuch wiederzuerkennen.</p>
          <p className="legal-en">Cookies are small text files stored on your device when you visit a website. They allow the website to recognise your browser on subsequent visits.</p>
        </section>

        <section className="legal-section">
          <h2>3. Welche Cookies verwenden wir? / Which cookies do we use?</h2>

          <h3>3.1 Technisch notwendige Cookies <span className="legal-badge legal-badge-green">Keine Einwilligung erforderlich</span></h3>
          <p>Diese Cookies sind für den Betrieb der Website unbedingt erforderlich und erfordern keine Einwilligung.</p>
          <p className="legal-en">These cookies are strictly necessary for the website to function and do not require consent.</p>
          <div className="legal-table-wrap">
            <table className="legal-table">
              <thead>
                <tr><th>Cookie</th><th>Anbieter / Provider</th><th>Zweck / Purpose</th><th>Speicherdauer / Duration</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>sb-auth-token</td>
                  <td>Supabase</td>
                  <td>Benutzer-Authentifizierung und Session-Verwaltung / User authentication and session management</td>
                  <td>Session</td>
                </tr>
                <tr>
                  <td>cx8_consent</td>
                  <td>CX8 Technologies</td>
                  <td>Speichert Ihre Cookie-Einwilligung / Stores your cookie consent choice</td>
                  <td>12 Monate / 12 months</td>
                </tr>
                <tr>
                  <td>ls_checkout_session</td>
                  <td>Lemon Squeezy (Sold through Link, LLC)</td>
                  <td>Betrugsprävention und Sitzungsverwaltung während des Bezahlvorgangs / Fraud prevention and session handling during checkout</td>
                  <td>Session / bis zu 1 Jahr</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="legal-note">Note: exact cookie names set by Lemon Squeezy's hosted checkout may vary. This table reflects the checkout/fraud-prevention cookies generally documented for Lemon Squeezy and will be updated once checkout is integrated.</p>

          <h3>3.2 Analyse-Cookies <span className="legal-badge legal-badge-amber">Nur mit Ihrer Einwilligung</span></h3>
          <p>Diese Cookies werden nur mit Ihrer Einwilligung gesetzt (Google Analytics 4, siehe Abschnitt 5).</p>
          <p className="legal-en">These cookies are only set with your consent (Google Analytics 4, see Section 5).</p>
          <div className="legal-table-wrap">
            <table className="legal-table">
              <thead>
                <tr><th>Cookie</th><th>Anbieter / Provider</th><th>Zweck / Purpose</th><th>Speicherdauer / Duration</th></tr>
              </thead>
              <tbody>
                <tr><td>_ga</td><td>Google LLC</td><td>Unterscheidet Besucher — Google Analytics 4 / Distinguishes visitors</td><td>2 Jahre / 2 years</td></tr>
                <tr><td>_ga_[ID]</td><td>Google LLC</td><td>Session-Status — Google Analytics 4 / Session state</td><td>2 Jahre / 2 years</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="legal-section">
          <h2>4. Rechtsgrundlagen der Verarbeitung / Legal basis for processing</h2>
          <p>Wir verarbeiten Ihre Daten auf folgenden Rechtsgrundlagen:</p>
          <ul>
            <li><strong>Art. 6 Abs. 1 lit. a DSGVO — Einwilligung:</strong> Google Analytics, Analyse-Cookies</li>
            <li><strong>Art. 6 Abs. 1 lit. b DSGVO — Vertragserfüllung:</strong> Supabase-Authentifizierung, Lemon-Squeezy-Zahlungsabwicklung</li>
            <li><strong>Art. 6 Abs. 1 lit. f DSGVO — Berechtigte Interessen:</strong> Sicherheits-Cookies, Session-Verwaltung</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>5. Google Analytics 4</h2>
          <p>Diese Website verwendet Google Analytics 4, einen Webanalysedienst der Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA.</p>
          <table className="legal-info-table">
            <tbody>
              <tr><td>Rechtsgrundlage</td><td>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) — wird erst nach Ihrer ausdrücklichen Zustimmung aktiviert</td></tr>
              <tr><td>IP-Anonymisierung</td><td>Aktiviert — Ihre IP-Adresse wird innerhalb der EU vor der Übertragung an Google gekürzt</td></tr>
              <tr><td>Datenübertragung USA</td><td>Google LLC ist im EU-US Data Privacy Framework zertifiziert (Beschluss vom 10. Juli 2023)</td></tr>
            </tbody>
          </table>
          <p>Widerspruch / Opt-out:</p>
          <ul>
            <li>Ablehnung im Cookie-Banner dieser Website</li>
            <li>Browser-Add-On: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">tools.google.com/dlpage/gaoptout</a></li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>6. Supabase — Nutzerdaten und Authentifizierung</h2>
          <p>Für Benutzerkonten und Datenspeicherung nutzen wir Supabase (Supabase Inc., Oakland, CA, USA).</p>
          <table className="legal-info-table">
            <tbody>
              <tr><td>Rechtsgrundlage</td><td>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</td></tr>
              <tr><td>Serverstandort</td><td>Ausschließlich EU-Server in Frankfurt am Main, Deutschland (AWS eu-central-1) — keine Übertragung außerhalb der EU</td></tr>
              <tr><td>Gespeicherte Daten</td><td>E-Mail-Adresse (verschlüsselt), Passwort-Hash, gespeicherte Berechnungsdaten</td></tr>
              <tr><td>Speicherdauer</td><td>Bis zur Kontolöschung durch den Nutzer</td></tr>
            </tbody>
          </table>
        </section>

        <section className="legal-section">
          <h2>7. Lemon Squeezy — Zahlungsabwicklung / Payment processing</h2>
          <p>Zahlungen werden verarbeitet durch <strong>Sold through Link, LLC</strong> (handelnd als "Lemon Squeezy"), 222 South Main Street, Suite 500, Salt Lake City, UT 84101, USA.</p>
          <p className="legal-en">Payments are processed by Sold through Link, LLC (trading as "Lemon Squeezy"), 222 South Main Street, Suite 500, Salt Lake City, UT 84101, USA.</p>
          <table className="legal-info-table">
            <tbody>
              <tr><td>Rechtsgrundlage</td><td>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</td></tr>
              <tr><td>Datenschutz</td><td><a href="https://www.lemonsqueezy.com/privacy" target="_blank" rel="noopener noreferrer">lemonsqueezy.com/privacy</a></td></tr>
            </tbody>
          </table>
          <p><strong>Wichtig / Important distinction:</strong> Lemon Squeezy tritt als "Merchant of Record" auf — das heißt, Lemon Squeezy schließt den Kaufvertrag im eigenen Namen mit dem Kunden ab, übernimmt die Umsatzsteuer-/Mehrwertsteuerabführung weltweit und die Betrugsprävention. CX8 Technologies selbst schließt keinen Zahlungsvertrag mit dem Kunden und hat keinen Zugriff auf vollständige Zahlungsdaten (Kreditkartennummern).</p>
          <p className="legal-en">Lemon Squeezy acts as the "Merchant of Record" for all purchases — meaning Lemon Squeezy, not CX8 Technologies, is the contracting seller for payment purposes, and separately handles global VAT/sales tax remittance and fraud prevention. CX8 Technologies has no access to full payment card data.</p>
        </section>

        <section className="legal-section">
          <h2>8. Ihre Rechte / Your rights (Art. 15–21 DSGVO)</h2>
          <div className="legal-table-wrap">
            <table className="legal-table">
              <thead>
                <tr><th>Recht / Right</th><th>Grundlage / Basis</th><th>Wie geltend machen / How to exercise</th></tr>
              </thead>
              <tbody>
                <tr><td>Auskunft / Access</td><td>Art. 15 DSGVO</td><td><a href="mailto:info@cx8technologies.com">info@cx8technologies.com</a></td></tr>
                <tr><td>Berichtigung / Rectification</td><td>Art. 16 DSGVO</td><td>E-Mail oder Kontoeinstellungen</td></tr>
                <tr><td>Löschung / Erasure</td><td>Art. 17 DSGVO</td><td>Konto löschen oder E-Mail senden</td></tr>
                <tr><td>Einschränkung / Restriction</td><td>Art. 18 DSGVO</td><td><a href="mailto:info@cx8technologies.com">info@cx8technologies.com</a></td></tr>
                <tr><td>Datenübertragbarkeit / Portability</td><td>Art. 20 DSGVO</td><td>E-Mail — Daten als JSON-Export</td></tr>
                <tr><td>Widerspruch / Object</td><td>Art. 21 DSGVO</td><td>Jederzeit für berechtigte Interessen</td></tr>
                <tr><td>Widerruf der Einwilligung / Withdraw consent</td><td>Art. 7 Abs. 3 DSGVO</td><td>Cookie-Banner oder E-Mail</td></tr>
              </tbody>
            </table>
          </div>
          <p className="legal-note">Antwortzeit: Wir bearbeiten Anfragen innerhalb von 30 Tagen gemäß Art. 12 DSGVO. / Response time: We process requests within 30 days as required by GDPR Art. 12.</p>
        </section>

        <section className="legal-section">
          <h2>9. Beschwerderecht bei der Aufsichtsbehörde / Supervisory Authority</h2>
          <p>Zuständig für CX8 Technologies mit Sitz in Ostfildern (Baden-Württemberg):</p>
          <div className="legal-authority">
            <strong>Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg</strong><br />
            Königstraße 10a, 70173 Stuttgart<br />
            Telefon: +49 711 61 55 41-0<br />
            E-Mail: <a href="mailto:poststelle@lfdi.bwl.de">poststelle@lfdi.bwl.de</a><br />
            Website: <a href="https://www.baden-wuerttemberg.datenschutz.de" target="_blank" rel="noopener noreferrer">www.baden-wuerttemberg.datenschutz.de</a>
          </div>
          <p className="legal-note">International users: UK — <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a> | Ireland — <a href="https://dataprotection.ie" target="_blank" rel="noopener noreferrer">dataprotection.ie</a> | Australia — <a href="https://oaic.gov.au" target="_blank" rel="noopener noreferrer">oaic.gov.au</a></p>
        </section>

        <section className="legal-section">
          <h2>10. Cookie-Einstellungen verwalten / Manage cookie settings</h2>
          <p>Sie können Ihre Cookie-Einstellungen jederzeit ändern. Klicken Sie dazu auf den Button <strong>"Cookie-Einstellungen"</strong> in der Fußzeile dieser Website.</p>
          <p className="legal-en">You can change your cookie settings at any time by clicking "Cookie Settings" in the footer of this website.</p>
          <p className="legal-note">Das Ablehnen von Analyse-Cookies hat keinen Einfluss auf die Funktionalität der Engineering-Tools.</p>
          <button className="legal-cookie-btn" onClick={() => window.klaro?.show()}>
            Cookie-Einstellungen öffnen
          </button>
        </section>

        <section className="legal-section">
          <h2>11. Änderungen / Changes</h2>
          <p>Diese Datenschutzerklärung wird bei Änderungen der Rechtslage oder neuen Diensten aktualisiert. Registrierte Nutzer werden bei wesentlichen Änderungen per E-Mail informiert.</p>
          <p className="legal-en">This privacy notice will be updated when laws change or new services are added. Registered users will be informed by email of material changes.</p>
        </section>

        <p className="legal-stand">Stand / Last updated: Juli 2026</p>
      </div>
      </div>
    </div>
  )
}
