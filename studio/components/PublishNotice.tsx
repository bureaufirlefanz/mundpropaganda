import type { LayoutProps } from "sanity";
import { Box, Card, Text } from "@sanity/ui";

/**
 * Ein Satz über dem Studio: Publish wirkt nicht sofort.
 *
 * Die Website ist statisch — sie wird nach jeder Veröffentlichung neu gebaut,
 * und das dauert ein bis zwei Minuten. Ohne diesen Hinweis ist die
 * naheliegende Erklärung „es funktioniert nicht", und der Anruf kommt, bevor
 * der Build durch ist.
 *
 * Bewusst eine schmale Leiste und kein Dialog: Wer sie zweimal gelesen hat,
 * soll sie überlesen können. Ein Hinweis, den man wegklicken muss, wird
 * weggeklickt, ohne gelesen zu werden.
 *
 * Ein eigenes Studio-Werkzeug mit Deploy-Status wäre schöner und steht als
 * Kür in `CMS-UMBAU.md`, Aufgabe 14. Dieser Satz kostet nichts und trägt
 * das Meiste davon.
 */
export function PublishHinweis(props: LayoutProps) {
  return (
    <>
      <Card padding={2} tone="primary" borderBottom>
        <Box paddingX={2}>
          <Text size={1} muted>
            Veröffentlichte Änderungen erscheinen nach ein bis zwei Minuten auf
            der Website — sie wird dafür neu gebaut. Was Sie im Reiter
            „Presentation“ sehen, ist sofort aktuell.
          </Text>
        </Box>
      </Card>
      {props.renderDefault(props)}
    </>
  );
}
