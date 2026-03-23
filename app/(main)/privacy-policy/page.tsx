import { Box, Heading, Text, Stack } from "@chakra-ui/react";

export const metadata = {
  title: "Política de Privacidad | TratoLibre",
  description:
    "Conocé cómo TratoLibre recopila, usa y protege tu información personal.",
};

const lastUpdated = "Abril de 2026";

const sections = [
  {
    title: "1. Información que recopilamos",
    content: [
      `Al registrarte y usar TratoLibre, recopilamos información que nos proporcionás directamente, como tu nombre, dirección de correo electrónico, contraseña, provincia y ciudad de residencia, y foto de perfil (opcional).`,
      `Cuando publicás un artículo, recopilamos el título, descripción, fotos, precio, categoría, condición y ubicación del artículo. Cuando usás el chat, guardamos los mensajes intercambiados entre usuarios para permitir el funcionamiento del servicio.`,
      `También recopilamos automáticamente información técnica como dirección IP, tipo de navegador, páginas visitadas y duración de las sesiones, a través de cookies y tecnologías similares.`,
    ],
  },
  {
    title: "2. Cómo usamos tu información",
    content: [
      `Usamos tu información para: (a) proveer, operar y mejorar la plataforma; (b) gestionar tu cuenta y autenticar tu identidad; (c) facilitar la comunicación entre compradores y vendedores; (d) enviarte notificaciones relevantes sobre tu actividad en la plataforma; (e) detectar y prevenir fraudes y actividades ilegales; (f) cumplir con obligaciones legales.`,
      `No usamos tu información personal para publicidad de terceros. No vendemos ni alquilamos tu información a terceros con fines comerciales.`,
    ],
  },
  {
    title: "3. Compartir información con terceros",
    content: [
      `TratoLibre utiliza proveedores de servicios externos para operar la plataforma, incluyendo servicios de hosting e infraestructura (Supabase/AWS), almacenamiento de archivos, y análisis de uso. Estos proveedores acceden a tu información únicamente en la medida necesaria para prestar sus servicios y están obligados a protegerla.`,
      `Podemos divulgar tu información si es requerido por ley, orden judicial, o autoridad gubernamental competente; para proteger los derechos, propiedad o seguridad de TratoLibre, sus usuarios u otros; o en el contexto de una fusión, adquisición o venta de activos de la empresa.`,
      `Tu información de perfil público (nombre de usuario, provincia, foto de perfil) es visible para otros usuarios de la plataforma.`,
    ],
  },
  {
    title: "4. Almacenamiento y seguridad",
    content: [
      `Tu información se almacena en servidores seguros. Implementamos medidas técnicas y organizativas para proteger tus datos contra acceso no autorizado, alteración, divulgación o destrucción, incluyendo cifrado de contraseñas, conexiones HTTPS y políticas de seguridad a nivel de base de datos (Row Level Security).`,
      `Sin embargo, ningún sistema de seguridad es completamente infalible. Te recomendamos usar una contraseña segura y no compartirla con nadie.`,
    ],
  },
  {
    title: "5. Tus derechos sobre tus datos",
    content: [
      `De acuerdo con la Ley 25.326 de Protección de Datos Personales de la República Argentina, tenés derecho a: (a) acceder a los datos personales que tenemos sobre vos; (b) rectificar datos inexactos o desactualizados; (c) solicitar la supresión de tus datos cuando ya no sean necesarios para los fines para los que fueron recopilados; (d) oponerte al tratamiento de tus datos en determinadas circunstancias.`,
      `Para ejercer estos derechos, podés contactarnos en privacidad@tratolibre.com. Responderemos tu solicitud en un plazo máximo de 30 días hábiles.`,
    ],
  },
  {
    title: "6. Cookies y tecnologías de seguimiento",
    content: [
      `Usamos cookies esenciales para el funcionamiento de la plataforma (autenticación de sesión, preferencias). No usamos cookies de seguimiento publicitario de terceros.`,
      `Podés configurar tu navegador para rechazar cookies, aunque esto puede afectar el funcionamiento de algunas funciones de TratoLibre.`,
    ],
  },
  {
    title: "7. Menores de edad",
    content: [
      `TratoLibre no está dirigido a personas menores de 18 años. No recopilamos intencionalmente información personal de menores. Si tomamos conocimiento de que un menor ha proporcionado información personal, procederemos a eliminarla de nuestros sistemas.`,
    ],
  },
  {
    title: "8. Retención de datos",
    content: [
      `Conservamos tu información personal mientras tu cuenta esté activa o según sea necesario para proveer el servicio. Si eliminás tu cuenta, procederemos a eliminar o anonimizar tu información personal en un plazo razonable, excepto cuando su conservación sea requerida por ley o para resolver disputas pendientes.`,
    ],
  },
  {
    title: "9. Cambios a esta política",
    content: [
      `Podemos actualizar esta Política de Privacidad periódicamente. Te notificaremos de cambios significativos mediante un aviso en la plataforma o por correo electrónico. Te recomendamos revisar esta política regularmente.`,
    ],
  },
  {
    title: "10. Contacto y autoridad de aplicación",
    content: [
      `Para consultas o solicitudes relacionadas con tu privacidad, contactanos en: privacidad@tratolibre.com`,
      `La Agencia de Acceso a la Información Pública (www.argentina.gob.ar/aaip) es el organismo competente para atender denuncias y consultas en materia de protección de datos personales en la República Argentina.`,
    ],
  },
];
export default function PrivacyPolicyPage() {
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
            color="fg"
            mb={3}
          >
            Política de Privacidad
          </Heading>
          <Text fontSize="sm" color="fg.subtle">
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
                En TratoLibre nos tomamos en serio la privacidad de tus datos.
                Esta política explica qué información recopilamos, cómo la
                usamos y qué derechos tenés sobre ella, de acuerdo con la Ley
                25.326 de Protección de Datos Personales de la República
                Argentina.
              </Text>
            </Box>

            {sections.map((section) => (
              <Box key={section.title}>
                <Heading
                  as="h2"
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="semibold"
                  color="fg"
                  mb={4}
                >
                  {section.title}
                </Heading>
                <Stack gap={3}>
                  {section.content.map((paragraph, i) => (
                    <Text
                      key={i}
                      color="fg.muted"
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
