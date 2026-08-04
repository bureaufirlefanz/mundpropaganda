import { Card, Flex, Text, Stack, Button } from "@sanity/ui";
import { LaunchIcon } from "@sanity/icons/Launch";
import type { UserViewComponent } from "sanity/structure";
import { pfadVon } from "../lib/pfade";

/**
 * Zeigt die Seite neben dem Formular.
 *
 * Bewusst ein schlichtes iframe und nicht das Presentation-Werkzeug: das
 * bräuchte Stega-Markierungen in der Ausgabe und einen Vorschau-Endpunkt in
 * der Astro-App. Für „sehe ich, was ich bearbeite" genügt das hier — und es
 * kostet die ausgelieferte Seite nichts.
 *
 * Gezeigt wird der Dev-Server. Solange er nicht läuft, bleibt der Rahmen leer;
 * deshalb steht der Hinweis darüber.
 */
const BASIS = "http://localhost:4321";

export const WebVorschau: UserViewComponent = ({ document, schemaType }) => {
  const entwurf = document.displayed as { slug?: { current?: string } } | undefined;

  /* Den Pfad NICHT hier zusammensetzen: er kommt aus lib/pfade.ts, derselben
     Quelle, aus der die Website ihre Routen baut. Vorher stand hier
     „/leistungen/<slug>“ fest verdrahtet — mit Magazin, Pillar Pages und
     Rechtstexten hätte die Vorschau ab sofort ins Leere gezeigt. */
  const pfad = pfadVon(schemaType.name, entwurf?.slug?.current);

  if (!pfad) {
    return (
      <Card padding={5} tone="caution" height="fill">
        <Text size={1}>
          Sobald ein URL-Teil gesetzt ist, erscheint hier die Seite.
        </Text>
      </Card>
    );
  }

  const url = `${BASIS}${pfad}`;

  return (
    <Flex direction="column" height="fill">
      <Card padding={2} borderBottom tone="transparent">
        <Flex align="center" justify="space-between" gap={2}>
          <Stack space={2} paddingX={2}>
            <Text size={0} muted>
              {url} — zeigt den letzten Build des Dev-Servers, nicht den Entwurf
            </Text>
          </Stack>
          <Button
            as="a"
            href={url}
            target="_blank"
            rel="noreferrer"
            icon={LaunchIcon}
            mode="bleed"
            text="Öffnen"
            fontSize={1}
          />
        </Flex>
      </Card>

      <Card flex={1}>
        <iframe
          src={url}
          style={{ width: "100%", height: "100%", border: 0 }}
          title="Vorschau"
        />
      </Card>
    </Flex>
  );
};
