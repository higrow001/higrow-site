import * as React from "react"
import { Html, Button, Head, Body, Preview } from "@react-email/components"

interface EmailTemplateProps {
  workshopName: string
  pageLink: string
}

export const AnnouncementTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  workshopName,
  pageLink,
}) => (
  <Html>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
    <Preview>
      An important announcement has been posted by the organizer in '
      {workshopName}' workshop
    </Preview>
    <Body>
      <div>
        <h1>Higrow</h1>
        <p>
          Dear participant, an important announcement has been posted by the
          organizer in '{workshopName}' workshop.
        </p>
        <Button href={pageLink}>Go there</Button>
      </div>
    </Body>
  </Html>
)
