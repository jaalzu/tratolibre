import { Box, Heading, Text, Stack } from "@chakra-ui/react";

export const metadata = {
  title: "Términos y Condiciones | TratoLibre",
  description: "Leé los términos y condiciones de uso de TratoLibre.",
};

const lastUpdated = "Abril de 2026";

const sections = [
  {
    title: "1. Aceptación de los términos",
    content: [
      `Al acceder y utilizar TratoLibre (en adelante, "la plataforma"), aceptás estos Términos y Condiciones en su totalidad. Si no estás de acuerdo con alguna parte, no podés usar nuestros servicios.`,
      `TratoLibre se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados mediante la publicación en el sitio y entrarán en vigencia a partir de su publicación. El uso continuado de la plataforma implica la aceptación de los términos modificados.`,
    ],
  },
  {
    title: "2. Descripción del servicio",
    content: [
      `TratoLibre es una plataforma digital que facilita la compra, venta e intercambio de objetos usados entre personas particulares. Actuamos exclusivamente como intermediario tecnológico y no somos parte de las transacciones entre usuarios.`,
      `No garantizamos la calidad, seguridad, ni legalidad de los artículos publicados, la veracidad de las descripciones, la capacidad de los vendedores para completar las transacciones, ni la capacidad de los compradores para realizar los pagos correspondientes.`,
    ],
  },
  {
    title: "3. Registro y cuenta de usuario",
    content: [
      `Para acceder a ciertas funcionalidades de TratoLibre, debés registrarte y crear una cuenta. Al hacerlo, te comprometés a proporcionar información verdadera, precisa, actual y completa.`,
      `Sos responsable de mantener la confidencialidad de tus credenciales de acceso y de todas las actividades realizadas bajo tu cuenta. Debés notificarnos de inmediato ante cualquier uso no autorizado de tu cuenta. TratoLibre no será responsable por daños o pérdidas derivados del uso no autorizado de tu cuenta.`,
      `Podemos suspender o cancelar tu cuenta si detectamos violaciones a estos términos, comportamiento fraudulento, o actividades que perjudiquen a otros usuarios o a la plataforma.`,
    ],
  },
  {
    title: "4. Publicación de artículos",
    content: [
      `Al publicar un artículo en TratoLibre, garantizás que: (a) tenés el derecho legal de vender o intercambiar dicho artículo; (b) la descripción, fotos y precio son precisos y no inducen a error; (c) el artículo no está prohibido por la legislación argentina ni por estas normas.`,
      `Está expresamente prohibido publicar artículos ilegales, falsificados, robados, armas, sustancias controladas, medicamentos sin prescripción, material para adultos, animales vivos, y cualquier otro artículo cuya comercialización esté prohibida por la ley argentina.`,
      `TratoLibre se reserva el derecho de eliminar publicaciones que violen estas normas sin previo aviso y de suspender las cuentas infractoras.`,
    ],
  },
  {
    title: "5. Transacciones entre usuarios",
    content: [
      `Las transacciones se realizan directamente entre usuarios. TratoLibre no interviene en la negociación del precio, el método de pago, la entrega ni ningún otro aspecto de la transacción.`,
      `Recomendamos a los usuarios acordar todos los detalles de la transacción a través del chat de la plataforma, preferir encuentros en lugares públicos y seguros, y verificar el estado del artículo antes de concretar el pago.`,
      `TratoLibre no se hace responsable por pérdidas, estafas, fraudes u otros perjuicios derivados de las transacciones entre usuarios.`,
    ],
  },
  {
    title: "6. Conducta del usuario",
    content: [
      `Al usar TratoLibre, te comprometés a: (a) respetar a los demás usuarios en todas las comunicaciones; (b) no publicar contenido falso, engañoso, ofensivo o ilegal; (c) no usar la plataforma para actividades fraudulentas o ilegales; (d) no intentar acceder a cuentas de otros usuarios; (e) no usar sistemas automatizados para interactuar con la plataforma sin autorización expresa.`,
      `La violación de estas normas puede resultar en la suspensión o cancelación permanente de tu cuenta.`,
    ],
  },
  {
    title: "7. Propiedad intelectual",
    content: [
      `Todo el contenido de TratoLibre (diseño, código, textos, logos, imágenes propias de la plataforma) es propiedad de TratoLibre y está protegido por las leyes de propiedad intelectual argentinas e internacionales.`,
      `Al publicar contenido en la plataforma (fotos, descripciones, etc.), nos otorgás una licencia no exclusiva, gratuita y mundial para usar, reproducir, modificar y mostrar dicho contenido con el único fin de operar y mejorar el servicio.`,
    ],
  },
  {
    title: "8. Limitación de responsabilidad",
    content: [
      `TratoLibre se provee "tal como está" y "según disponibilidad". No garantizamos que el servicio sea ininterrumpido, seguro o libre de errores.`,
      `En la máxima medida permitida por la ley argentina, TratoLibre no será responsable por daños indirectos, incidentales, especiales, consecuentes o punitivos derivados del uso o la imposibilidad de usar la plataforma.`,
    ],
  },
  {
    title: "9. Ley aplicable y jurisdicción",
    content: [
      `Estos Términos y Condiciones se rigen por las leyes de la República Argentina. Ante cualquier controversia, las partes se someten a la jurisdicción de los Tribunales Ordinarios de la Ciudad Autónoma de Buenos Aires, renunciando expresamente a cualquier otro fuero que pudiera corresponder.`,
    ],
  },
  {
    title: "10. Contacto",
    content: [
      `Si tenés preguntas sobre estos Términos y Condiciones, podés contactarnos en: contacto@tratolibre.com`,
    ],
  },
];

export default function TermsAndConditionsPage() {
  return (
    <Box px={{ base: 4, md: 8 }} py={6}>
      <Box maxW="800px" mx="auto">
        {/* HEADER */}
        <Box
          bg="neutral.50"
          borderRadius="3xl"
          px={{ base: 5, md: 10 }}
          py={{ base: 8, md: 12 }}
          mb={3}
        >
          <Text
            fontSize="xs"
            fontWeight="bold"
            color="brand.hover"
            textTransform="uppercase"
            letterSpacing="wider"
            mb={2}
          >
            Legal
          </Text>
          <Heading
            as="h1"
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="bold"
            color="neutral.800"
            mb={3}
          >
            Términos y Condiciones
          </Heading>
          <Text fontSize="sm" color="neutral.400">
            Última actualización: {lastUpdated}
          </Text>
        </Box>

        {/* CONTENT */}
        <Box
          bg="neutral.50"
          borderRadius="3xl"
          px={{ base: 5, md: 10 }}
          py={{ base: 8, md: 12 }}
        >
          <Stack gap={10}>
            <Box
              p={5}
              bg="brand.subtle"
              borderRadius="xl"
              border="2px solid"
              borderColor="brand.default"
            >
              <Text fontSize="md" color="fg.muted" lineHeight="tall">
                Por favor, leé estos términos detenidamente antes de usar
                TratoLibre. Al registrarte o usar la plataforma, confirmás que
                leíste, entendiste y aceptás estos Términos y Condiciones.
              </Text>
            </Box>

            {sections.map((section) => (
              <Box key={section.title}>
                <Heading
                  as="h2"
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="semibold"
                  color="neutral.900"
                  mb={4}
                >
                  {section.title}
                </Heading>
                <Stack gap={3}>
                  {section.content.map((paragraph, i) => (
                    <Text
                      key={i}
                      color="neutral.700"
                      lineHeight="tall"
                      fontSize="sm"
                    >
                      {paragraph}
                    </Text>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
