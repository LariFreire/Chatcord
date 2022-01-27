import { Box, Button, Text, Image } from '@skynexui/components';
import { useRouter } from 'next/router';
import appConfig from '../config.json';
import errorImage from '../img/Toy-Story-4.png';

export default function notFound() {
  const root = useRouter();

  return (
    <>
      <Box
        styleSheet={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
          }}
        >

        <Image
          styleSheet={{
            maxHeight: { xs: '40vh', sm: '100%' },
            padding: { xs: '20px 30px', sm: '0px 0px' },
          }}
          src={errorImage.src}
        />

        <Text styleSheet={{ fontSize: { xs: '18px', sm: '25px' }, fontWeight: '600', margin: '2% 2% 1%', color: appConfig.theme.colors.primary[900] }}>
          !PAGE NOT FOUND - 404 ERROR!
        </Text>

        <Text styleSheet={{ fontSize: { xs: '12px', sm: '18px' }, fontWeight: '600', textAlign: 'center', margin: '0% 2% 2%', color: appConfig.theme.colors.neutrals[600] }}>
          Chegamos ao INFINITO e ALÉM!
        </Text>

        <Button
          buttonColors={{
            contrastColor: appConfig.theme.colors.neutrals["050"],
            mainColor: appConfig.theme.colors.primary[900],
            mainColorLight: appConfig.theme.colors.primary[400],
            mainColorStrong: appConfig.theme.colors.primary[600],
          }}
          label="Go Home"
          variant="secondary"
          rounded="sm"
          size="lg"
          styleSheet={{
            disabled: {},
            focus: {},
            hover: {
              cursor: 'pointer'
            },
            margin: { xs: '10%', sm: '0%' },
          }}
          onClick={(event) => root.push("/")}
        />
      </Box>
    </>
  )
}