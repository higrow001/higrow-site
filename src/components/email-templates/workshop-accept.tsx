import * as React from "react"
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

interface EmailTemplateProps {
  workshopName: string
  pageLink: string
}

export const WorkshopAcceptTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  workshopName,
  pageLink,
}) => (
  <Html>
    <Head />
    <Preview>We accepted your workshop</Preview>
    <Tailwind>
      <Body className="bg-white my-auto mx-auto font-sans">
        <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
          <Section>
            <Heading className="text-[32px] font-archivo text-black text-center font-bold">
              {" "}
              HiGrow.{" "}
            </Heading>
          </Section>
          <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
            Your workshops is accepted!
          </Heading>
          <Text className="text-black text-[14px] leading-[24px]">Hey,</Text>
          <Text className="text-black text-[14px] leading-[24px]">
            Congratulations! You're workshop "{workshopName}" is approved by out
            team! See participants and make announcements now!
          </Text>
          <Button
            pX={20}
            pY={12}
            className="bg-[#000000] my-auto mx-auto mt-2 mb-2 rounded text-white text-[12px] font-semibold no-underline text-center"
            href={pageLink}
          >
            Check Now
          </Button>
          <Text className="text-black text-[14px] leading-[24px]">
            or copy and paste this URL into your browser:{" "}
            <a href={pageLink} className="text-blue-600 no-underline">
              {pageLink}
            </a>
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
)
