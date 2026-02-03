const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mt-8">
    <h2 className="text-lg font-semibold">{title}</h2>
    <div className="mt-3 space-y-3 text-slate-800">{children}</div>
  </section>
);

const SubTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mt-5 text-base font-semibold text-slate-900">{children}</h3>
);

const List = ({ children }: { children: React.ReactNode }) => (
  <ul className="mt-3 space-y-2 pl-5 leading-relaxed list-disc">{children}</ul>
);

export const PrivacyPage = () => {
  const effectiveDate = 'February 3, 2026';
  const serviceName = 'no.pics / OneTimePhoto';
  const website = 'https://no.pics';
  const contactEmail = 'hello@no.pics';

  return (
    <div className="min-h-screen px-4 py-10 text-white">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-[28px] bg-white p-8 text-black sm:p-10">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Privacy Policy</h1>

            <div className="mt-4 space-y-1 text-sm text-slate-600">
              <p>
                <span className="font-semibold">Effective date:</span>{' '}
                {effectiveDate}
              </p>
              <p>
                <span className="font-semibold">Service:</span> {serviceName}
              </p>
              <p>
                <span className="font-semibold">Website:</span> {website}
              </p>
              <p>
                <span className="font-semibold">Contact:</span>{' '}
                <a
                  className="underline hover:opacity-80"
                  href={`mailto:${contactEmail}`}
                >
                  {contactEmail}
                </a>
              </p>
            </div>
          </header>

          <div className="text-slate-800">
            <p className="leading-relaxed">
              This Privacy Policy explains how we collect, use, and protect
              information when you use {serviceName} (the “Service”, “we”,
              “our”).
            </p>

            <Section title="1) What the Service does">
              <p className="leading-relaxed">
                The Service lets you upload a photo and generate a link for
                one-time viewing. By design, the photo is deleted after the
                first successful view or when the time-to-live (TTL) expires —
                whichever comes first.
              </p>
            </Section>

            <Section title="2) Information we process">
              <SubTitle>2.1 Content you upload</SubTitle>
              <List>
                <li>Image files you upload (e.g., .jpg, .png).</li>
                <li>
                  Technical metadata required to operate the Service (e.g., file
                  name, mime type, size, created time, TTL/expiry time, and
                  internal identifiers).
                </li>
              </List>

              <SubTitle>2.2 Information collected automatically</SubTitle>
              <List>
                <li>
                  IP address, user-agent, and basic request data (timestamps,
                  endpoints).
                </li>
                <li>
                  Logs for debugging, reliability, and security (e.g., errors,
                  suspicious activity).
                </li>
              </List>

              <p className="text-sm text-slate-600">
                We do not sell personal data. We do not use your uploads for
                advertising.
              </p>
            </Section>

            <Section title="3) Passphrases and protected photos">
              <p className="leading-relaxed">
                Some photos may be protected with a passphrase. We do not store
                passphrases in plain text. We may store a hash or another
                verification artifact needed to validate access.
              </p>
            </Section>

            <Section title="4) How we use information">
              <List>
                <li>
                  To provide core functionality (upload, store until TTL,
                  one-time viewing, deletion).
                </li>
                <li>
                  To operate and secure the Service (abuse prevention, rate
                  limiting, incident response).
                </li>
                <li>
                  To diagnose errors and improve performance and reliability.
                </li>
                <li>To comply with legal obligations where applicable.</li>
              </List>
            </Section>

            <Section title="5) Legal bases (EEA/UK)">
              <p className="leading-relaxed">
                If you are in the EEA/UK, we typically process data based on:
              </p>
              <List>
                <li>
                  Performance of a contract (providing the Service you request).
                </li>
                <li>
                  Legitimate interests (security, abuse prevention, service
                  reliability).
                </li>
                <li>
                  Consent (only if we introduce optional analytics/cookies that
                  require consent).
                </li>
              </List>
            </Section>

            <Section title="6) Retention and deletion">
              <List>
                <li>
                  Photos are retained only until first view or TTL expiry
                  (whichever comes first).
                </li>
                <li>
                  Logs may be retained for a limited time for security and
                  diagnostics (typically 7–30 days, depending on infrastructure
                  settings).
                </li>
              </List>
            </Section>

            <Section title="7) Sharing and processors">
              <p className="leading-relaxed">
                We may use infrastructure providers to run the Service (e.g.,
                hosting, CDN/proxy, and storage). These providers process data
                only to the extent necessary to deliver the Service.
              </p>
            </Section>

            <Section title="8) International transfers">
              <p className="leading-relaxed">
                Our providers may process data in different countries. Where
                required, we use appropriate safeguards for cross-border
                transfers.
              </p>
            </Section>

            <Section title="9) Security">
              <p className="leading-relaxed">
                We use reasonable technical and organizational measures to
                protect information. However, no system can be guaranteed 100%
                secure.
              </p>
            </Section>

            <Section title="10) Your rights">
              <p className="leading-relaxed">
                Depending on your location, you may have rights to access,
                correct, delete, or restrict processing of your personal data.
                To make a request, contact us at{' '}
                <a
                  className="underline hover:opacity-80"
                  href={`mailto:${contactEmail}`}
                >
                  {contactEmail}
                </a>
                .
              </p>
              <p className="text-sm text-slate-600">
                Note: due to the one-time nature of the Service, we may not be
                able to identify or retrieve specific uploads without the
                relevant link/ID you provide.
              </p>
            </Section>

            <Section title="11) Changes to this policy">
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                publish the updated version on this page and update the
                effective date.
              </p>
            </Section>

            <Section title="12) Contact">
              <p className="leading-relaxed">
                Questions about privacy can be sent to{' '}
                <a
                  className="underline hover:opacity-80"
                  href={`mailto:${contactEmail}`}
                >
                  {contactEmail}
                </a>
                .
              </p>
            </Section>

            <hr className="my-8 border-slate-200" />

            <p className="text-sm text-slate-600">
              <span className="font-semibold">Reminder:</span> Photos are
              deleted after the first view or when the TTL expires. Do not
              upload illegal content or anything you’re not comfortable sharing
              with the link recipient.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
