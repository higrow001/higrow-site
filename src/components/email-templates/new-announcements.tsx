import * as React from "react"
import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
interface EmailTemplateProps {
  participantName: string;
  workshopName: string;
  pageLink: string;
  userName: string;
  
}

export const AnnouncementTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  participantName,
  workshopName,
  pageLink,
  userName
}) => (
  <Html>
  <Head />
  <Preview>New Workshop Announcement</Preview>
  <Tailwind>
  <Body className="bg-white my-auto mx-auto font-sans">
  <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
  <Section>
    <Heading className="text-[32px] font-archivo text-black text-center font-bold"> HiGrow. </Heading>
  </Section>

  <Heading className="text-black text-[24px] font-normal text-center p-0 my-[20px] mx-0">
              New Announcement alert!
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello {userName},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Workshop you enrolled in "{workshopName}" just made an announcement . Hurry up! It might be important.
              </Text>
              <Button
                pX={20}
                pY={12}
                className="bg-[#000000] my-auto mx-auto mt-2 mb-2 rounded text-white text-[12px] font-semibold no-underline text-center"
                href={pageLink}
              >
              See Announcement 
              </Button>
              <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{' '}
              <a
                href={pageLink}
                className="text-blue-600 no-underline"
              >
                {pageLink}
              </a>
            </Text>
    </Container>
  </Body>
  </Tailwind>
</Html>
)
